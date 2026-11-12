import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async findInvoices(organizationId: string, studentId?: string, status?: string, page = 1, pageSize = 20) {
    const where: any = { organizationId };
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.invoice.findMany({
        where,
        include: { lineItems: true, student: { select: { id: true, firstName: true, lastName: true, studentNumber: true } } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { issueDate: 'desc' },
      }),
      this.prisma.invoice.count({ where }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string, organizationId: string) {
    const inv = await this.prisma.invoice.findFirst({
      where: { id, organizationId },
      include: { lineItems: true, payments: true, student: true },
    });
    if (!inv) throw new NotFoundException('Invoice not found');
    return inv;
  }

  async create(dto: CreateInvoiceDto, organizationId: string) {
    const count = await this.prisma.invoice.count({ where: { organizationId } });
    const year = new Date().getFullYear();
    const invoiceNumber = `INV-${year}-${String(count + 1).padStart(5, '0')}`;
    
    // Calculate total in minor units (integer arithmetic — no floats)
    const total = dto.lineItems.reduce((sum, li) => sum + li.amountMinorUnits, 0);

    return this.prisma.invoice.create({
      data: {
        organizationId,
        studentId: dto.studentId,
        invoiceNumber,
        issueDate: new Date(dto.issueDate),
        dueDate: new Date(dto.dueDate),
        currency: dto.currency,
        totalMinorUnits: total,
        lineItems: { create: dto.lineItems },
      },
      include: { lineItems: true },
    });
  }

  async recordPayment(invoiceId: string, organizationId: string, dto: CreatePaymentDto) {
    const invoice = await this.findOne(invoiceId, organizationId);
    
    const newPaidTotal = invoice.paidMinorUnits + dto.amountMinorUnits;
    const newStatus = newPaidTotal >= invoice.totalMinorUnits
      ? 'PAID'
      : invoice.status === 'DRAFT' ? 'ISSUED' : invoice.status;

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { paidMinorUnits: newPaidTotal, status: newStatus as any },
    });

    return this.prisma.payment.create({
      data: { invoiceId, ...dto, paidAt: new Date() },
    });
  }

  async getFinancialSummary(organizationId: string) {
    const result = await this.prisma.invoice.aggregate({
      where: { organizationId, status: { in: ['ISSUED', 'OVERDUE'] } },
      _sum: { totalMinorUnits: true, paidMinorUnits: true },
      _count: { id: true },
    });

    const outstanding = (result._sum.totalMinorUnits ?? 0) - (result._sum.paidMinorUnits ?? 0);
    return { outstandingMinorUnits: outstanding, openInvoiceCount: result._count.id };
  }
}
