import React from 'react';
import { Download } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  useToast,
} from '@/shared/components/ui';

export const ReportingPage: React.FC = () => {
  const { success } = useToast();

  const reports = [
    {
      title: 'Official Student Registry (Census)',
      desc: 'Full student demographic roster for regional ministry export',
      format: 'CSV / PDF',
    },
    {
      title: 'Statutory Attendance Summary',
      desc: 'Monthly attendance statistics with truancy breakdown by cohort',
      format: 'Excel / PDF',
    },
    {
      title: 'Grade Distribution & Transcripts',
      desc: 'Consolidated end-of-term academic grade distributions',
      format: 'CSV',
    },
    {
      title: 'SEPA Financial Aging Ledger',
      desc: 'Accounts receivable ledger broken down by 30/60/90 days',
      format: 'Excel',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Operational Reporting & Ministry Data Exports
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Census generation, OneRoster 1.2 data exchange, and regulatory
          statutory exports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, idx) => (
          <Card key={idx} className="hover:shadow-sm transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm">{r.title}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {r.desc}
                  </CardDescription>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                  {r.format}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                leadingIcon={<Download className="h-3.5 w-3.5" />}
                onClick={() =>
                  success('Report Exported', {
                    message: `${r.title} generated in ${r.format} format.`,
                  })
                }
              >
                Generate Export
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
