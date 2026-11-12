import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { BulkAttendanceDto } from './dto/create-attendance.dto';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('organizations/:organizationId/attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get attendance records for a class' })
  findByClass(
    @Param('organizationId') org: string,
    @Param('classId') classId: string,
    @Query('date') date?: string,
  ) {
    return this.service.findByClass(classId, org, date);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get attendance records for a student' })
  findByStudent(
    @Param('organizationId') org: string,
    @Param('studentId') studentId: string,
  ) {
    return this.service.findByStudent(studentId, org);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get daily attendance summary (present/absent/late counts)' })
  getSummary(
    @Param('organizationId') org: string,
    @Query('campusId') campusId?: string,
  ) {
    return this.service.getAbsenceSummary(org, campusId);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Submit bulk attendance register (upsert per student per date)' })
  bulkCreate(
    @Body() dto: BulkAttendanceDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.service.bulkCreate(dto.records, userId);
  }
}
