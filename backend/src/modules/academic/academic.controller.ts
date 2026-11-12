import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AcademicService } from './academic.service';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('academic')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('organizations/:organizationId/academic')
export class AcademicController {
  constructor(private readonly service: AcademicService) {}

  @Get('campuses/:campusId/academic-years')
  getAcademicYears(@Param('campusId') campusId: string) { return this.service.getAcademicYears(campusId); }
  @Post('campuses/:campusId/academic-years')
  createAcademicYear(@Param('campusId') campusId: string, @Body() body: any) { return this.service.createAcademicYear({ ...body, campusId }); }

  @Get('campuses/:campusId/year-groups')
  getYearGroups(@Param('campusId') campusId: string) { return this.service.getYearGroups(campusId); }
  @Post('campuses/:campusId/year-groups')
  createYearGroup(@Param('campusId') campusId: string, @Body() body: any) { return this.service.createYearGroup({ ...body, campusId }); }

  @Get('campuses/:campusId/classes')
  getClasses(@Param('campusId') campusId: string) { return this.service.getClasses(campusId); }
  @Post('campuses/:campusId/classes')
  createClass(@Param('campusId') campusId: string, @Body() body: any) { return this.service.createClass({ ...body, campusId }); }

  @Get('campuses/:campusId/subjects')
  getSubjects(@Param('campusId') campusId: string) { return this.service.getSubjects(campusId); }
  @Post('campuses/:campusId/subjects')
  createSubject(@Param('campusId') campusId: string, @Body() body: any) { return this.service.createSubject({ ...body, campusId }); }

  @Get('campuses/:campusId/departments')
  getDepartments(@Param('campusId') campusId: string) { return this.service.getDepartments(campusId); }
  @Post('campuses/:campusId/departments')
  createDepartment(@Param('campusId') campusId: string, @Body() body: any) { return this.service.createDepartment({ ...body, campusId }); }
}
