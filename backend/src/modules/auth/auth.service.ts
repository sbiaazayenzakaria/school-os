import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto/auth.dto';

const BCRYPT_ROUNDS = 12;
const TOKEN_REUSE_DETECTION_WINDOW_MS = 60_000; // 60 s

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── Register ────────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) {
      // Timing-safe: same response regardless of existence to prevent user enumeration
      throw new ConflictException('Registration failed — please try a different email');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    return { user, message: 'Registration successful' };
  }

  // ─── Login ────────────────────────────────────────────────────────────────────

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    // Always fetch to prevent timing attacks based on user existence
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    // Constant-time comparison even when user not found (compare against dummy hash)
    const dummyHash = '$2b$12$DUMMY.HASH.TO.PREVENT.TIMING.ATTACKS.00000000';
    const isValid = await bcrypt.compare(
      dto.password,
      user?.passwordHash ?? dummyHash,
    );

    if (!user || !isValid || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateAndStoreTokens(user, ipAddress, userAgent);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ...tokens,
    };
  }

  // ─── Refresh Token Rotation ───────────────────────────────────────────────────

  async refreshTokens(
    userId: string,
    rawRefreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const tokenHash = this.hashToken(rawRefreshToken);

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    // ── Token Reuse Detection (Rotation Security) ─────────────────────────────
    if (!storedToken || storedToken.userId !== userId) {
      // If a revoked token is presented, revoke ALL tokens for user (family attack)
      if (storedToken?.isRevoked) {
        await this.prisma.refreshToken.updateMany({
          where: { userId },
          data: { isRevoked: true },
        });
        throw new ForbiddenException(
          'Refresh token reuse detected — all sessions terminated for security',
        );
      }
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.isRevoked) {
      await this.prisma.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });
      throw new ForbiddenException('Revoked refresh token presented — sessions terminated');
    }

    if (new Date() > storedToken.expiresAt) {
      throw new UnauthorizedException('Refresh token expired — please log in again');
    }

    const user = storedToken.user;

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    // Issue new token pair
    return this.generateAndStoreTokens(user, ipAddress, userAgent);
  }

  // ─── Logout ──────────────────────────────────────────────────────────────────

  async logout(userId: string, rawRefreshToken?: string) {
    if (rawRefreshToken) {
      const tokenHash = this.hashToken(rawRefreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { userId, tokenHash },
        data: { isRevoked: true },
      });
    } else {
      // Revoke all sessions
      await this.prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
    }
  }

  // ─── Change Password ──────────────────────────────────────────────────────────

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const isCurrentValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password must differ from current password');
    }

    const newHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    // Revoke all existing refresh tokens on password change (security best practice)
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });

    return { message: 'Password changed successfully. Please log in again.' };
  }

  // ─── Token Generation Helpers ─────────────────────────────────────────────────

  private async generateAndStoreTokens(
    user: { id: string; email: string },
    ipAddress?: string,
    userAgent?: string,
  ) {
    const memberships = await this.prisma.tenantMembership.findMany({
      where: { userId: user.id, isActive: true },
      select: { role: true },
    });
    const roles = [...new Set(memberships.map((m) => m.role))];

    const accessToken = this.jwt.sign(
      { sub: user.id, email: user.email, roles },
      {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRATION', '15m'),
      },
    );

    const rawRefreshToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);

    const refreshExpiry = new Date();
    const refreshDays = parseInt(
      this.config.get('JWT_REFRESH_EXPIRATION', '7d').replace('d', ''),
    );
    refreshExpiry.setDate(refreshExpiry.getDate() + refreshDays);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: refreshExpiry,
        ipAddress,
        userAgent,
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // ─── Profile ─────────────────────────────────────────────────────────────────

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        isActive: true,
        isMfaEnabled: true,
        lastLoginAt: true,
        memberships: {
          where: { isActive: true },
          select: {
            role: true,
            permissions: true,
            organizationId: true,
            campusId: true,
            organization: { select: { name: true } },
          },
        },
        createdAt: true,
      },
    });
    return user;
  }
}
