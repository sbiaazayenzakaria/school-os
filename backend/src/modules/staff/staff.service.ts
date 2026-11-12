import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, campusId?: string, page = 1, pageSize = 20) {
    const where: any = { organizationId };
    if (campusId) where.campusId = campusId;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.staffMember.findMany({
        where,
        include: { department: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ lastName: 'asc' }],
      }),
      this.prisma.staffMember.count({ where }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string, organizationId: string) {
    const staff = await this.prisma.staffMember.findFirst({
      where: { id, organizationId },
      include: { department: true },
    });
    if (!staff) throw new NotFoundException('Staff member not found');
    return staff;
  }

  async create(dto: CreateStaffDto, organizationId: string) {
    const count = await this.prisma.staffMember.count({ where: { organizationId } });
    const employeeNumber = `EMP-${String(count + 1).padStart(5, '0')}`;
    return this.prisma.staffMember.create({
      data: { ...dto, organizationId, employeeNumber },
    });
  }

  async update(id: string, organizationId: string, dto: UpdateStaffDto) {
    await this.findOne(id, organizationId);
    return this.prisma.staffMember.update({ where: { id }, data: dto });
  }

  async deactivate(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.staffMember.update({ where: { id }, data: { isActive: false } });
  }
}
