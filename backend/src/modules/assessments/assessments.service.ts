import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { CreateGradeDto } from './dto/create-grade.dto';

@Injectable()
export class AssessmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByClass(classId: string, organizationId: string) {
    return this.prisma.assessment.findMany({
      where: { classId, campus: { organizationId } },
      include: { subject: true, term: true, grades: { include: { student: { select: { id: true, firstName: true, lastName: true } } } } },
      orderBy: { date: 'desc' },
    });
  }

  async createAssessment(dto: CreateAssessmentDto) {
    return this.prisma.assessment.create({ data: { ...dto, date: new Date(dto.date) }, include: { subject: true } });
  }

  async submitGrades(assessmentId: string, grades: CreateGradeDto[], gradedById: string) {
    const assessment = await this.prisma.assessment.findUniqueOrThrow({ where: { id: assessmentId } });
    return this.prisma.$transaction(
      grades.map((g) =>
        this.prisma.grade.upsert({
          where: { assessmentId_studentId: { assessmentId, studentId: g.studentId } },
          create: { ...g, assessmentId, gradedById, gradedAt: new Date() },
          update: { rawScore: g.rawScore, competencyLevel: g.competencyLevel as any, narrativeComment: g.narrativeComment, gradedById, gradedAt: new Date() },
        }),
      ),
    );
  }

  async publishGrades(assessmentId: string) {
    return this.prisma.grade.updateMany({ where: { assessmentId }, data: { isPublished: true } });
  }

  async getStudentGradebook(studentId: string, organizationId: string, termId?: string) {
    return this.prisma.grade.findMany({
      where: {
        studentId,
        student: { organizationId },
        ...(termId ? { assessment: { termId } } : {}),
        isPublished: true,
      },
      include: { assessment: { include: { subject: true, term: true } } },
      orderBy: { gradedAt: 'desc' },
    });
  }
}
