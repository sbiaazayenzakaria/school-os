import {
  Controller, Get, Post, Put, Param, Body, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all organizations accessible to the current user' })
  findAll(@CurrentUser() user: any) {
    const isSuperAdmin = user.roles?.includes('PLATFORM_SUPER_ADMIN');
    return this.service.findAll(user.sub, isSuperAdmin);
  }

  @Get(':organizationId')
  @ApiOperation({ summary: 'Get a single organization by ID' })
  findOne(@Param('organizationId') id: string, @CurrentUser() user: any) {
    const isSuperAdmin = user.roles?.includes('PLATFORM_SUPER_ADMIN');
    return this.service.findOne(id, user.sub, isSuperAdmin);
  }

  @Post()
  @Roles('PLATFORM_SUPER_ADMIN')
  @ApiOperation({ summary: 'Create a new organization (Super Admin only)' })
  create(@Body() dto: CreateOrganizationDto) {
    return this.service.create(dto);
  }

  @Put(':organizationId')
  @Roles('PLATFORM_SUPER_ADMIN', 'ORGANIZATION_ADMIN')
  @ApiOperation({ summary: 'Update an organization' })
  update(@Param('organizationId') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.service.update(id, dto);
  }
}
