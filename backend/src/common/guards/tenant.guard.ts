import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * TenantGuard: Core multi-tenant authorization guard
 *
 * GOLDEN SECURITY RULE: The backend NEVER trusts the frontend's selected org/campus.
 * Every request independently verifies that the requesting user holds a valid,
 * active TenantMembership for the organization referenced in the route/header,
 * and that membership grants the required roles and permission keys.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Allow public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.sub) {
      throw new UnauthorizedException('Authentication required');
    }

    // Platform super admins bypass tenant checks
    if (user.roles?.includes('PLATFORM_SUPER_ADMIN')) {
      return true;
    }

    // Resolve organizationId from route params, body, or headers
    const organizationId =
      request.params?.organizationId ||
      request.body?.organizationId ||
      request.headers?.['x-tenant-id'];

    if (!organizationId) {
      // No org context required for this endpoint
      return true;
    }

    // ── CRITICAL: Independent DB query to verify membership ──────────────────
    const membership = await this.prisma.tenantMembership.findFirst({
      where: {
        userId: user.sub,
        organizationId,
        isActive: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'Access denied: No active membership for this organization',
      );
    }

    // Attach verified membership to request for downstream use
    request.membership = membership;

    // ── Role check ──────────────────────────────────────────────────────────
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(membership.role)) {
        throw new ForbiddenException(
          `Access denied: Role '${membership.role}' is not authorized for this operation`,
        );
      }
    }

    // ── Permission key check ─────────────────────────────────────────────────
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredPermissions && requiredPermissions.length > 0) {
      const memberPermissions = membership.permissions || [];
      const hasAll = requiredPermissions.every((p) =>
        memberPermissions.includes(p),
      );
      if (!hasAll) {
        throw new ForbiddenException(
          'Access denied: Insufficient permissions for this operation',
        );
      }
    }

    return true;
  }
}
