import React, { useState, useMemo } from 'react';
import { useTenant } from '@/providers';
import { STUDENTS } from '@/data/mockData';
import { Guardian } from '@/shared/types';
import { Mail, Phone, CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  Badge,
  Input,
  DataTable,
  Column,
} from '@/shared/components/ui';

interface GuardianWithStudent extends Guardian {
  studentName: string;
  studentId: string;
}

export const GuardiansPage: React.FC = () => {
  const { activeCampus } = useTenant();
  const [searchQuery, setSearchQuery] = useState('');

  const campusGuardians = useMemo(() => {
    if (!activeCampus) return [];
    const list: GuardianWithStudent[] = [];
    const students = STUDENTS.filter(s => s.campusId === activeCampus.id);
    students.forEach(s => {
      s.guardians.forEach(g => {
        list.push({
          ...g,
          studentName: `${s.firstName} ${s.lastName}`,
          studentId: s.id,
        });
      });
    });
    return list;
  }, [activeCampus]);

  const filtered = useMemo(() => {
    return campusGuardians.filter(g => {
      const q = searchQuery.toLowerCase();
      return (
        `${g.firstName} ${g.lastName}`.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.studentName.toLowerCase().includes(q)
      );
    });
  }, [campusGuardians, searchQuery]);

  const columns: Column<GuardianWithStudent>[] = [
    {
      key: 'name',
      header: 'Guardian',
      render: g => (
        <div>
          <span className="font-semibold text-xs text-slate-900 block">
            {g.firstName} {g.lastName}
          </span>
          <span className="text-[11px] text-slate-400 capitalize">
            {g.relationship.toLowerCase()}
          </span>
        </div>
      ),
    },
    {
      key: 'studentName',
      header: 'Dependent Pupil',
      render: g => (
        <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
          {g.studentName}
        </span>
      ),
    },
    {
      key: 'contact',
      header: 'Contact Information',
      render: g => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Mail className="h-3 w-3 text-slate-400" />
            <span>{g.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Phone className="h-3 w-3 text-slate-400" />
            <span>{g.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'custody',
      header: 'Legal Custody (Art. 8)',
      render: g =>
        g.hasLegalParentalResponsibility ? (
          <Badge variant="success" size="sm" dot>
            Verified Legal Custody
          </Badge>
        ) : (
          <Badge variant="warning" size="sm">
            Contact Only
          </Badge>
        ),
    },
    {
      key: 'pickup',
      header: 'Pickup Authorized',
      align: 'right',
      render: g =>
        g.isEmergencyPickupAuthorized ? (
          <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" /> Yes
          </span>
        ) : (
          <span className="text-xs text-slate-400">No</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Parents & Legal Guardians
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Parental authority tracking, emergency pickup authorizations &
            verified contact points
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search guardian or dependent pupil..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(g, idx) => `${g.id}-${idx}`}
          />
        </CardContent>
      </Card>
    </div>
  );
};
