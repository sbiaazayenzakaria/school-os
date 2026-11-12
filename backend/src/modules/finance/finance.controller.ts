import { Controller, Get, Post, Param, Body, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('finance')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('organizations/:organizationId/finance')
export class FinanceController {
  constructor(private readonly service: FinanceService) {}

  @Get('invoices')
  findInvoices(@Param('organizationId') org: string, @Query('studentId') studentId?: string, @Query('status') status?: string, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1, @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize = 20) {
    return this.service.findInvoices(org, studentId, status, page, pageSize);
  }

  @Get('invoices/summary')
  getSummary(@Param('organizationId') org: string) {
    return this.service.getFinancialSummary(org);
  }

  @Get('invoices/:id')
  findOne(@Param('organizationId') org: string, @Param('id') id: string) {
    return this.service.findOne(id, org);
  }

  @Post('invoices')
  @Roles('ORGANIZATION_ADMIN','CAMPUS_PRINCIPAL','STAFF')
  create(@Param('organizationId') org: string, @Body() dto: CreateInvoiceDto) {
    return this.service.create(dto, org);
  }

  @Post('invoices/:id/payments')
  @Roles('ORGANIZATION_ADMIN','CAMPUS_PRINCIPAL','STAFF')
  recordPayment(@Param('organizationId') org: string, @Param('id') id: string, @Body() dto: CreatePaymentDto) {
    return this.service.recordPayment(id, org, dto);
  }
}
