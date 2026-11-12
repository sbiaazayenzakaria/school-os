import React from 'react';
import { STAFF_MEMBERS } from '@/data/mockData';
import { Plus, CheckCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from '@/shared/components/ui';

export const HRPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Human Resources & Employment Contracts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Contractual teaching loads, statutory background clearance tracking
            (DBS/Führungszeugnis) & leave management
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leadingIcon={<Plus className="h-4 w-4" />}
        >
          New Staff Contract
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">
              Full-Time Faculty
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              8 Contracts
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium">
              100% compliant credentials
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">
              Background Checks Verified
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              100% Complete
            </h3>
            <span className="text-[11px] text-slate-400">
              Judicial records clean
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">
              Pending Leave Requests
            </span>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">
              1 Request
            </h3>
            <span className="text-[11px] text-amber-600 font-medium">
              Cover substitute arranged
            </span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Faculty Contract Dossiers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Job Title</th>
                <th className="p-3">Contract Type</th>
                <th className="p-3">Teaching Quota</th>
                <th className="p-3 text-right">Police Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {STAFF_MEMBERS.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="p-3 text-slate-600">{s.jobTitle}</td>
                  <td className="p-3">
                    <Badge variant="neutral" size="sm">
                      {s.employmentType}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono text-slate-700">
                    {s.contractedHoursPerWeek} hrs/week
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />{' '}
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
