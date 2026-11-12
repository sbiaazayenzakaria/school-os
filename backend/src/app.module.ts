import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { CampusesModule } from './modules/campuses/campuses.module';
import { StudentsModule } from './modules/students/students.module';
import { StaffModule } from './modules/staff/staff.module';
import { AcademicModule } from './modules/academic/academic.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { TimetableModule } from './modules/timetable/timetable.module';
import { FinanceModule } from './modules/finance/finance.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AdmissionsModule } from './modules/admissions/admissions.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    // ─── Configuration ──────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ─── Rate Limiting ──────────────────────────────────────────────────────────
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 200,
      },
    ]),

    // ─── Infrastructure ─────────────────────────────────────────────────────────
    PrismaModule,

    // ─── Domain Modules ─────────────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    OrganizationsModule,
    CampusesModule,
    StudentsModule,
    StaffModule,
    AcademicModule,
    AttendanceModule,
    AssessmentsModule,
    TimetableModule,
    FinanceModule,
    AnnouncementsModule,
    AdmissionsModule,
    AuditModule,
  ],
})
export class AppModule {}
