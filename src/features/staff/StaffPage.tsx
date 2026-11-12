import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/providers';
import { STAFF_MEMBERS, DEPARTMENTS } from '@/data/mockData';
import { StaffMember } from '@/shared/types';
import { Plus, Award } from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  DataTable,
  Column,
} from '@/shared/components/ui';

export const StaffPage: React.FC = () => {
  const { activeCampus } = useTenant();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const campusStaff = useMemo(() => {
    if (!activeCampus) return [];
    return STAFF_MEMBERS.filter(s => s.campusId === activeCampus.id);
  }, [activeCampus]);

  const departments = useMemo(() => {
    if (!activeCampus) return [];
    return DEPARTMENTS.filter(d => d.campusId === activeCampus.id);
  }, [activeCampus]);

  const filteredStaff = useMemo(() => {
    return campusStaff.filter(s => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.jobTitle.toLowerCase().includes(q) ||
        s.employeeNumber.toLowerCase().includes(q);
      const matchesDept = deptFilter === 'ALL' || s.departmentId === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [campusStaff, searchQuery, deptFilter]);

  const columns: Column<StaffMember>[] = [
    {
      key: 'employeeNumber',
      header: 'Staff ID',
      className: 'font-mono text-xs text-slate-500',
    },
    {
      key: 'name',
      header: 'Faculty Member',
      render: s => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
            {s.firstName[0]}
            {s.lastName[0]}
          </div>
          <div>
            <span className="font-semibold text-xs text-slate-900 block">
              {s.firstName} {s.lastName}
            </span>
            <span className="text-[11px] text-slate-500">{s.jobTitle}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'qualifications',
      header: 'Credentials & Teaching Diplomas',
      render: s => (
        <div className="flex flex-wrap gap-1">
          {s.qualifications.map((q, idx) => (
            <Badge key={idx} variant="brand" size="sm">
              <Award className="h-3 w-3 mr-1" />
              {q}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'workload',
      header: 'Teaching Workload',
      render: s => {
        const pct = Math.min(
          100,
          Math.round((s.allocatedHoursPerWeek / s.contractedHoursPerWeek) * 100)
        );
        return (
          <div className="w-36">
            <div className="flex justify-between text-[11px] text-slate-600 mb-1">
              <span>
                {s.allocatedHoursPerWeek}h / {s.contractedHoursPerWeek}h
              </span>
              <span className="font-semibold">{pct}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  pct > 95 ? 'bg-amber-500' : 'bg-brand-600'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'type',
      header: 'Contract Type',
      render: s => (
        <Badge
          variant={s.employmentType === 'PERMANENT' ? 'success' : 'neutral'}
          size="sm"
        >
          {s.employmentType}
        </Badge>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      align: 'right',
      render: s => (
        <span className="text-xs text-slate-500 font-mono">{s.email}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Teachers & Faculty Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            European qualification tracking (CAPES, Agrégation, Staatsexamen),
            workload meters & contracts
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leadingIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate('/staff')}
        >
          Add Faculty Member
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search faculty name, title, credential..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {departments.length > 0 && (
            <div className="w-full sm:w-60">
              <Select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Departments' },
                  ...departments.map(d => ({ value: d.id, label: d.name })),
                ]}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={filteredStaff}
            keyExtractor={s => s.id}
          />
        </CardContent>
      </Card>
    </div>
  );
};
