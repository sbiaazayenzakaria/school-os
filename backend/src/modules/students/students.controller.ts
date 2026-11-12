import {
  Controller, Get, Post, Put, Delete, Param, Body, Query,
  UseGuards, ParseIntPipe, DefaultValuePipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('students')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('organizations/:organizationId/students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'List students for an organization (tenant-scoped)' })
  @ApiQuery({ name: 'campusId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  findAll(
    @Param('organizationId') organizationId: string,
    @Query('campusId') campusId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize = 20,
  ) {
    return this.service.findAll(organizationId, campusId, page, pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student details (tenant-scoped)' })
  findOne(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.service.findOne(id, organizationId);
  }

  @Post()
  @Roles('ORGANIZATION_ADMIN', 'CAMPUS_PRINCIPAL', 'ACADEMIC_COORDINATOR')
  @ApiOperation({ summary: 'Create a new student record' })
  create(
    @Param('organizationId') organizationId: string,
    @Body() dto: CreateStudentDto,
  ) {
    return this.service.create(dto, organizationId);
  }

  @Put(':id')
  @Roles('ORGANIZATION_ADMIN', 'CAMPUS_PRINCIPAL', 'ACADEMIC_COORDINATOR')
  @ApiOperation({ summary: 'Update student record' })
  update(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.service.update(id, organizationId, dto);
  }

  @Delete(':id')
  @Roles('ORGANIZATION_ADMIN', 'CAMPUS_PRINCIPAL')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete student (blocked if Legal Hold active)' })
  remove(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.service.softDelete(id, organizationId);
  }
}
