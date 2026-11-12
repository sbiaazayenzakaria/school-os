import React, { useState, useMemo } from 'react';
import { useTenant } from '@/providers';
import { STUDENTS, CLASSES } from '@/data/mockData';
import { AttendanceStatus } from '@/shared/types';
import { CheckCircle, Save, FileText, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Select,
  Input,
  useToast,
} from '@/shared/components/ui';

export const AttendancePage: React.FC = () => {
  const { activeCampus } = useTenant();
  const { success } = useToast();

  const classes = useMemo(() => {
    if (!activeCampus) return [];
    return CLASSES.filter(c => c.campusId === activeCampus.id);
  }, [activeCampus]);

  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id ?? ''
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-09');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);

  const students = useMemo(() => {
    return STUDENTS.filter(s => s.classId === selectedClassId);
  }, [selectedClassId]);

  // Attendance state dictionary: studentId -> AttendanceStatus
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    () => {
      const init: Record<string, AttendanceStatus> = {};
      STUDENTS.forEach(s => {
        init[s.id] = 'PRESENT';
      });
      return init;
    }
  );

  const isPrimary = activeCampus?.attendanceMode === 'HOMEROOM_DAILY';

  const markAll = (status: AttendanceStatus) => {
    const updated = { ...statuses };
    students.forEach(s => {
      updated[s.id] = status;
    });
    setStatuses(updated);
  };

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    success('Register Submitted', {
      message: `Attendance register successfully verified and locked for ${selectedDate}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Attendance Register
            </h1>
            <Badge variant="brand" size="sm">
              {isPrimary
                ? 'Primary: Homeroom Daily'
                : 'Secondary: Period-by-Period'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dual-mode fast registration, automated absence tracking &
            cross-period truancy detection
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leadingIcon={<Save className="h-4 w-4" />}
          onClick={handleSave}
        >
          Submit & Lock Register
        </Button>
      </div>

      {/* Control bar: Class, Date, Period (if secondary) */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-52">
              <Select
                label="Select Class"
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                options={classes.map(c => ({ value: c.id, label: c.name }))}
              />
            </div>

            <div className="w-44">
              <Input
                label="Register Date"
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>

            {!isPrimary && (
              <div className="w-40">
                <Select
                  label="Timetable Period"
                  value={String(selectedPeriod)}
                  onChange={e => setSelectedPeriod(Number(e.target.value))}
                  options={[
                    { value: '1', label: 'Period 1 (08:00)' },
                    { value: '2', label: 'Period 2 (09:00)' },
                    { value: '3', label: 'Period 3 (10:15)' },
                    { value: '4', label: 'Period 4 (11:15)' },
                    { value: '5', label: 'Period 5 (13:30)' },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Rapid 1-Click Homeroom Action */}
          <div className="flex items-center gap-2 pt-4 sm:pt-0">
            <Button
              variant="outline"
              size="sm"
              leadingIcon={<CheckCircle className="h-4 w-4 text-emerald-600" />}
              onClick={() => markAll('PRESENT')}
            >
              Mark All Present
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Student Attendance Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Pupil Roll Call Grid</CardTitle>
              <CardDescription className="text-xs">
                Click status pill to toggle between Present, Late, Medical,
                Excused, and Unexcused
              </CardDescription>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {students.length} Pupils in Cohort
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Primary Guardian</th>
                <th className="p-3">Attendance Status</th>
                <th className="p-3 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(s => {
                const currentStatus = statuses[s.id] ?? 'PRESENT';
                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center shrink-0">
                          {s.firstName[0]}
                          {s.lastName[0]}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block">
                            {s.firstName} {s.lastName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {s.studentNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-slate-600">
                      {s.guardians[0]?.firstName} {s.guardians[0]?.lastName} (
                      {s.guardians[0]?.phone})
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-1.5">
                        {(
                          [
                            {
                              key: 'PRESENT',
                              label: 'Present',
                              color: 'emerald',
                            },
                            { key: 'LATE', label: 'Late', color: 'amber' },
                            {
                              key: 'ABSENT_EXCUSED',
                              label: 'Excused',
                              color: 'sky',
                            },
                            { key: 'MEDICAL', label: 'Medical', color: 'teal' },
                            {
                              key: 'ABSENT_UNEXCUSED',
                              label: 'Unexcused',
                              color: 'rose',
                            },
                          ] as const
                        ).map(opt => {
                          const isActive = currentStatus === opt.key;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => setStudentStatus(s.id, opt.key)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                                isActive
                                  ? opt.color === 'emerald'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : opt.color === 'amber'
                                      ? 'bg-amber-500 text-white shadow-sm'
                                      : opt.color === 'sky'
                                        ? 'bg-sky-600 text-white shadow-sm'
                                        : opt.color === 'teal'
                                          ? 'bg-teal-600 text-white shadow-sm'
                                          : 'bg-rose-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      {currentStatus === 'ABSENT_UNEXCUSED' && (
                        <span className="text-[11px] text-rose-600 font-medium inline-flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Statutory
                          Truancy Notice
                        </span>
                      )}
                      {currentStatus === 'MEDICAL' && (
                        <span className="text-[11px] text-teal-700 font-medium inline-flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Medical Note Attached
                        </span>
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
