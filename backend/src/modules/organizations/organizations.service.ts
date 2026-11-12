import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, isSuperAdmin: boolean) {
    if (isSuperAdmin) {
      return this.prisma.organization.findMany({
        include: { campuses: true },
        orderBy: { name: 'asc' },
      });
    }
    // Regular users only see orgs they're members of
    return this.prisma.organization.findMany({
      where: {
        memberships: { some: { userId, isActive: true } },
      },
      include: { campuses: { where: { isActive: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, userId: string, isSuperAdmin: boolean) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: { campuses: true },
    });
    if (!org) throw new NotFoundException('Organization not found');

    if (!isSuperAdmin) {
      const membership = await this.prisma.tenantMembership.findFirst({
        where: { userId, organizationId: id, isActive: true },
      });
      if (!membership) throw new ForbiddenException('Access denied');
    }
    return org;
  }

  async create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({ data: dto });
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    await this.prisma.organization.findUniqueOrThrow({ where: { id } });
    return this.prisma.organization.update({ where: { id }, data: dto });
  }
}
