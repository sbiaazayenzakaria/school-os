import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async findByClass(classId: string, organizationId: string, date?: string) {
    // Verify class belongs to org
    const cls = await this.prisma.schoolClass.findFirst({ where: { id: classId, campus: { organizationId } } });
    if (!cls) throw new NotFoundException('Class not found');

    const where: any = { classId };
    if (date) where.date = { gte: new Date(date + 'T00:00:00Z'), lte: new Date(date + 'T23:59:59Z') };

    return this.prisma.attendanceRecord.findMany({
      where,
      include: { student: { select: { id: true, firstName: true, lastName: true, studentNumber: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async findByStudent(studentId: string, organizationId: string, termId?: string) {
    const student = await this.prisma.student.findFirst({ where: { id: studentId, organizationId } });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.attendanceRecord.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
      take: 100,
    });
  }

  async bulkCreate(dtos: CreateAttendanceDto[], recordedById: string) {
    const records = dtos.map((dto) => ({
      ...dto,
      date: new Date(dto.date),
      recordedById,
      recordedAt: new Date(),
    }));

    return this.prisma.$transaction(
      records.map((r) =>
        this.prisma.attendanceRecord.upsert({
          where: {
            // Use composite unique: studentId + date + period (simulate upsert)
            id: `${r.studentId}-${r.date.toISOString().split('T')[0]}-${r.period ?? 0}`,
          },
          create: r,
          update: { status: r.status, notes: r.notes, recordedById, recordedAt: new Date() },
        }),
      ),
    );
  }

  async getAbsenceSummary(organizationId: string, campusId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totals = await this.prisma.attendanceRecord.groupBy({
      by: ['status'],
      where: {
        date: { gte: today, lt: tomorrow },
        student: { organizationId, ...(campusId ? { campusId } : {}) },
      },
      _count: { status: true },
    });

    return totals.map((t) => ({ status: t.status, count: t._count.status }));
  }
}
