import React, { useState, useMemo } from 'react';
import { useTenant } from '@/providers';
import {
  getYearGroupsByCampus,
  getClassesByCampus,
  getSubjectsByCampus,
  getRoomsByCampus,
  STAFF_MEMBERS,
} from '@/data/mockData';
import { Layers, BookOpen, DoorOpen, Plus, Users } from 'lucide-react';
import { Card, CardContent, Button, Badge } from '@/shared/components/ui';

type TabKey = 'yearGroups' | 'classes' | 'subjects' | 'rooms';

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
}

export const AcademicStructurePage: React.FC = () => {
  const { activeCampus } = useTenant();
  const [activeTab, setActiveTab] = useState<TabKey>('classes');

  const campusId = activeCampus?.id ?? 'campus-vh';
  const yearGroups = useMemo(() => getYearGroupsByCampus(campusId), [campusId]);
  const classes = useMemo(() => getClassesByCampus(campusId), [campusId]);
  const subjects = useMemo(() => getSubjectsByCampus(campusId), [campusId]);
  const rooms = useMemo(() => getRoomsByCampus(campusId), [campusId]);

  const tabs: TabItem[] = [
    {
      key: 'classes',
      label: `Classes & Sections (${classes.length})`,
      icon: <Users className="h-4 w-4" />,
    },
    {
      key: 'yearGroups',
      label: `Year Groups / Cohorts (${yearGroups.length})`,
      icon: <Layers className="h-4 w-4" />,
    },
    {
      key: 'subjects',
      label: `Curriculum Subjects (${subjects.length})`,
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      key: 'rooms',
      label: `Classrooms & Labs (${rooms.length})`,
      icon: <DoorOpen className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Academic Structure & Facilities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cohorts, classes, physical rooms, curriculum catalog & subject
            allocations for {activeCampus?.name}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leadingIcon={<Plus className="h-4 w-4" />}
          onClick={() => {}}
        >
          Add Academic Entity
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === tab.key
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel 1: Classes */}
      {activeTab === 'classes' && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Class Name</th>
                  <th className="p-3">Cohort</th>
                  <th className="p-3">Homeroom Teacher</th>
                  <th className="p-3">Assigned Room</th>
                  <th className="p-3">Enrollment / Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map(cl => {
                  const yg = yearGroups.find(y => y.id === cl.yearGroupId);
                  const teacher = STAFF_MEMBERS.find(
                    s => s.id === cl.homeroomTeacherId
                  );
                  const room = rooms.find(r => r.id === cl.roomId);
                  const pct = Math.round(
                    (cl.currentEnrollment / cl.maxCapacity) * 100
                  );

                  return (
                    <tr key={cl.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">
                        {cl.name}
                      </td>
                      <td className="p-3 text-slate-600">{yg?.name}</td>
                      <td className="p-3">
                        {teacher ? (
                          <span className="font-medium text-slate-800">
                            {teacher.firstName} {teacher.lastName}
                          </span>
                        ) : (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-600">
                        {room?.name ?? 'Standard Room'}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {cl.currentEnrollment} / {cl.maxCapacity}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({pct}%)
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Panel 2: Year Groups */}
      {activeTab === 'yearGroups' && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Year Group / Grade</th>
                  <th className="p-3">Educational Level</th>
                  <th className="p-3">Class Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {yearGroups.map(yg => {
                  const count = classes.filter(
                    c => c.yearGroupId === yg.id
                  ).length;
                  return (
                    <tr key={yg.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-400">
                        {yg.order}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {yg.name}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={yg.type === 'PRIMARY' ? 'brand' : 'info'}
                          size="sm"
                        >
                          {yg.type}
                        </Badge>
                      </td>
                      <td className="p-3 font-semibold text-slate-700">
                        {count} sections
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Panel 3: Subjects */}
      {activeTab === 'subjects' && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3">Curriculum Type</th>
                  <th className="p-3">Periods / Week</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-600">
                      {s.code}
                    </td>
                    <td className="p-3 font-semibold text-slate-900">
                      {s.name}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={s.type === 'CORE' ? 'success' : 'neutral'}
                        size="sm"
                      >
                        {s.type}
                      </Badge>
                    </td>
                    <td className="p-3 font-medium text-slate-700">
                      {s.periodsPerWeek} periods
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Panel 4: Rooms */}
      {activeTab === 'rooms' && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Room Identifier</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Building & Floor</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Fitted Equipment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{r.name}</td>
                    <td className="p-3">
                      <Badge variant="neutral" size="sm">
                        {r.type}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-600">
                      {r.building} • Floor {r.floor}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {r.capacity} seats
                    </td>
                    <td className="p-3 text-slate-500">
                      {r.equipment.join(', ') || 'Standard'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
