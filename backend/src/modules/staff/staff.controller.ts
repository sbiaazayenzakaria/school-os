import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe, DefaultValuePipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('staff')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('organizations/:organizationId/staff')
export class StaffController {
  constructor(private readonly service: StaffService) {}

  @Get()
  findAll(@Param('organizationId') org: string, @Query('campusId') campus?: string, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1, @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize = 20) {
    return this.service.findAll(org, campus, page, pageSize);
  }
  @Get(':id')
  findOne(@Param('organizationId') org: string, @Param('id') id: string) {
    return this.service.findOne(id, org);
  }
  @Post()
  @Roles('ORGANIZATION_ADMIN','CAMPUS_PRINCIPAL')
  create(@Param('organizationId') org: string, @Body() dto: CreateStaffDto) {
    return this.service.create(dto, org);
  }
  @Put(':id')
  @Roles('ORGANIZATION_ADMIN','CAMPUS_PRINCIPAL')
  update(@Param('organizationId') org: string, @Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.service.update(id, org, dto);
  }
  @Delete(':id')
  @Roles('ORGANIZATION_ADMIN')
  @HttpCode(HttpStatus.OK)
  deactivate(@Param('organizationId') org: string, @Param('id') id: string) {
    return this.service.deactivate(id, org);
  }
}
