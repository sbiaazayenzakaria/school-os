import { Controller, Get, Post, Param, Body, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { CreateGradeDto } from './dto/create-grade.dto';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('assessments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('organizations/:organizationId/assessments')
export class AssessmentsController {
  constructor(private readonly service: AssessmentsService) {}

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get all assessments for a class' })
  findByClass(@Param('organizationId') org: string, @Param('classId') classId: string) {
    return this.service.findByClass(classId, org);
  }

  @Post()
  @Roles('TEACHER','ACADEMIC_COORDINATOR','CAMPUS_PRINCIPAL')
  @ApiOperation({ summary: 'Create a new assessment' })
  createAssessment(@Body() dto: CreateAssessmentDto) {
    return this.service.createAssessment(dto);
  }

  @Post(':assessmentId/grades')
  @Roles('TEACHER','ACADEMIC_COORDINATOR')
  @ApiOperation({ summary: 'Submit/update grades for an assessment (batch)' })
  submitGrades(
    @Param('assessmentId') id: string,
    @Body() dto: { grades: CreateGradeDto[] },
    @CurrentUser('sub') userId: string,
  ) {
    return this.service.submitGrades(id, dto.grades, userId);
  }

  @Post(':assessmentId/publish')
  @Roles('TEACHER','ACADEMIC_COORDINATOR','CAMPUS_PRINCIPAL')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish grades to students/parents' })
  publishGrades(@Param('assessmentId') id: string) {
    return this.service.publishGrades(id);
  }

  @Get('gradebook/student/:studentId')
  @ApiOperation({ summary: "Get student's published gradebook" })
  getGradebook(
    @Param('organizationId') org: string,
    @Param('studentId') studentId: string,
    @Query('termId') termId?: string,
  ) {
    return this.service.getStudentGradebook(studentId, org, termId);
  }
}
