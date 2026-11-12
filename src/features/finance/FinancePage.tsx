import React, { useMemo } from 'react';
import { useTenant } from '@/providers';
import { INVOICES, STUDENTS } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { Plus, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  DataTable,
  Column,
  useToast,
} from '@/shared/components/ui';
import { Invoice } from '@/shared/types';

export const FinancePage: React.FC = () => {
  const { activeOrganization } = useTenant();
  const { success } = useToast();

  const invoices = useMemo(() => {
    return INVOICES.filter(
      i => i.organizationId === (activeOrganization?.id ?? 'org-ecole-paris')
    );
  }, [activeOrganization]);

  const totalBilled = invoices.reduce((sum, i) => sum + i.totalMinorUnits, 0);
  const totalPaid = invoices.reduce((sum, i) => sum + i.paidMinorUnits, 0);
  const totalOutstanding = totalBilled - totalPaid;
  const currency = activeOrganization?.baseCurrency ?? 'EUR';

  const columns: Column<Invoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice No.',
      className: 'font-mono text-xs font-bold text-slate-800',
    },
    {
      key: 'student',
      header: 'Billed Pupil',
      render: inv => {
        const student = STUDENTS.find(s => s.id === inv.studentId);
        return (
          <div className="text-xs">
            <span className="font-semibold text-slate-900 block">
              {student
                ? `${student.firstName} ${student.lastName}`
                : 'Direct Payer'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {student?.studentNumber}
            </span>
          </div>
        );
      },
    },
    {
      key: 'dates',
      header: 'Issue / Due Date',
      render: inv => (
        <span className="text-xs text-slate-600">
          {formatDate(inv.issueDate)} • Due {formatDate(inv.dueDate)}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total Amount',
      render: inv => (
        <span className="text-xs font-bold text-slate-900">
          {formatCurrency(inv.totalMinorUnits, inv.currency)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'SEPA Ledger Status',
      render: inv => (
        <Badge
          variant={
            inv.status === 'PAID'
              ? 'success'
              : inv.status === 'OVERDUE'
                ? 'danger'
                : 'warning'
          }
          size="sm"
          dot
        >
          {inv.status}
        </Badge>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: inv => (
        <Button
          variant="outline"
          size="sm"
          leadingIcon={<FileText className="h-3.5 w-3.5" />}
          onClick={() =>
            success('Receipt Downloaded', {
              message: `SEPA VAT invoice receipt ${inv.invoiceNumber} downloaded.`,
            })
          }
        >
          Receipt
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Finance, Tuition Billing & SEPA Invoicing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic ISO 4217 multi-currency tuition schedules, SEPA direct
            debits & minor-unit precision
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leadingIcon={<Plus className="h-4 w-4" />}
          onClick={() =>
            success('Invoice Issued', {
              message: 'New term tuition invoice draft generated.',
            })
          }
        >
          Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">
              Total Invoiced
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {formatCurrency(totalBilled, currency)}
            </h3>
            <span className="text-[11px] text-slate-400">All terms active</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">
              Collected via SEPA / Bank
            </span>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {formatCurrency(totalPaid, currency)}
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium">
              Reconciled to ledger
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">
              Outstanding Balance
            </span>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">
              {formatCurrency(totalOutstanding, currency)}
            </h3>
            <span className="text-[11px] text-amber-600 font-medium">
              1 overdue reminder queued
            </span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={invoices}
            keyExtractor={i => i.id}
          />
        </CardContent>
      </Card>
    </div>
  );
};
