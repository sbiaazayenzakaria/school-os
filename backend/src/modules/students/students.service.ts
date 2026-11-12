import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    organizationId: string,
    campusId?: string,
    page = 1,
    pageSize = 20,
  ) {
    const where: any = { organizationId, isDeleted: false };
    if (campusId) where.campusId = campusId;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.student.findMany({
        where,
        include: { guardians: true, class: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string, organizationId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, organizationId, isDeleted: false },
      include: {
        guardians: true,
        class: true,
        attendanceRecords: { orderBy: { date: 'desc' }, take: 10 },
        grades: { include: { assessment: true }, orderBy: { gradedAt: 'desc' }, take: 10 },
      },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async create(dto: CreateStudentDto, organizationId: string) {
    const studentNumber = await this.generateStudentNumber(organizationId);
    return this.prisma.student.create({
      data: { ...dto, organizationId, studentNumber },
      include: { guardians: true },
    });
  }

  async update(id: string, organizationId: string, dto: UpdateStudentDto) {
    const student = await this.prisma.student.findFirst({
      where: { id, organizationId, isDeleted: false },
    });
    if (!student) throw new NotFoundException('Student not found');
    return this.prisma.student.update({ where: { id }, data: dto });
  }

  async softDelete(id: string, organizationId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, organizationId, isDeleted: false },
    });
    if (!student) throw new NotFoundException('Student not found');

    // Check legal hold
    const hold = await this.prisma.legalHold.findFirst({
      where: { entityId: id, entityType: 'Student', isActive: true },
    });
    if (hold) {
      throw new NotFoundException(
        'Cannot delete student — an active Legal Hold is in place',
      );
    }

    return this.prisma.student.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date(), status: 'ARCHIVED' },
    });
  }

  private async generateStudentNumber(organizationId: string): Promise<string> {
    const count = await this.prisma.student.count({ where: { organizationId } });
    const prefix = 'STU';
    return `${prefix}-${String(count + 1).padStart(6, '0')}`;
  }
}
