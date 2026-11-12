import React, { useMemo } from 'react';
import { useTenant } from '@/providers';
import { STUDENTS } from '@/data/mockData';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from '@/shared/components/ui';

export const AttendanceReportPage: React.FC = () => {
  const { activeCampus } = useTenant();

  const students = useMemo(() => {
    if (!activeCampus) return [];
    return STUDENTS.filter(s => s.campusId === activeCampus.id);
  }, [activeCampus]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Attendance Analytics & Statutory Truancy Alerts
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          European statutory attendance thresholds, excuse document tracking &
          cohort trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">
              Campus Average Rate
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">94.8%</h3>
            <span className="text-[11px] text-emerald-600 font-medium">
              +1.4% vs last term
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">
              Excused Medical Absences
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">12 cases</h3>
            <span className="text-[11px] text-slate-400">
              All certificates verified
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">
              Truancy Threshold Exceeded
            </span>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">1 Alert</h3>
            <span className="text-[11px] text-rose-600 font-medium">
              Requires parental notice
            </span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Cohort Absence Distribution</CardTitle>
          <CardDescription className="text-xs">
            Individual pupil attendance rates for regulatory compliance
            reporting
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Total Sessions</th>
                <th className="p-3">Absences</th>
                <th className="p-3">Rate</th>
                <th className="p-3 text-right">Regulatory Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s, idx) => {
                const absences = idx === 2 ? 4 : idx === 1 ? 2 : 0;
                const total = 40;
                const rate = Math.round(((total - absences) / total) * 100);
                const isTruant = rate < 90;

                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="p-3 text-slate-600">{total} sessions</td>
                    <td className="p-3 text-slate-600">{absences} sessions</td>
                    <td className="p-3 font-bold text-slate-900">{rate}%</td>
                    <td className="p-3 text-right">
                      {isTruant ? (
                        <Badge variant="danger" size="sm">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Truancy
                          Warning
                        </Badge>
                      ) : (
                        <Badge variant="success" size="sm">
                          <CheckCircle className="h-3 w-3 mr-1" /> Compliant
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
