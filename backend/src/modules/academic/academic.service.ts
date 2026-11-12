import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AcademicService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Academic Years ──────────────────────────────────────────────────────────
  async getAcademicYears(campusId: string) {
    return this.prisma.academicYear.findMany({ where: { campusId }, include: { terms: { orderBy: { order: 'asc' } } }, orderBy: { startDate: 'desc' } });
  }
  async createAcademicYear(data: any) {
    return this.prisma.academicYear.create({ data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) } });
  }

  // ─── Year Groups ─────────────────────────────────────────────────────────────
  async getYearGroups(campusId: string) {
    return this.prisma.yearGroup.findMany({ where: { campusId }, include: { classes: true }, orderBy: { order: 'asc' } });
  }
  async createYearGroup(data: any) {
    return this.prisma.yearGroup.create({ data });
  }

  // ─── Classes ─────────────────────────────────────────────────────────────────
  async getClasses(campusId: string, academicYearId?: string) {
    return this.prisma.schoolClass.findMany({
      where: { campusId, ...(academicYearId ? { academicYearId } : {}) },
      include: { yearGroup: true, academicYear: true },
      orderBy: { name: 'asc' },
    });
  }
  async createClass(data: any) {
    return this.prisma.schoolClass.create({ data, include: { yearGroup: true } });
  }

  // ─── Subjects ────────────────────────────────────────────────────────────────
  async getSubjects(campusId: string) {
    return this.prisma.subject.findMany({ where: { campusId }, include: { department: true }, orderBy: { name: 'asc' } });
  }
  async createSubject(data: any) {
    return this.prisma.subject.create({ data });
  }

  // ─── Departments ─────────────────────────────────────────────────────────────
  async getDepartments(campusId: string) {
    return this.prisma.department.findMany({ where: { campusId }, orderBy: { name: 'asc' } });
  }
  async createDepartment(data: any) {
    return this.prisma.department.create({ data });
  }

  // ─── Terms ───────────────────────────────────────────────────────────────────
  async createTerm(data: any) {
    return this.prisma.term.create({ data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) } });
  }
}
