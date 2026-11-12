import React, { useState, useMemo } from 'react';
import { useTenant } from '@/providers';
import {
  getTimetableSlotsByCampus,
  getPeriodsByCampus,
  getClassesByCampus,
  getSubjectsByCampus,
  getRoomsByCampus,
  STAFF_MEMBERS,
} from '@/data/mockData';
import { DayOfWeek, Room } from '@/shared/types';
import { Clock, Plus, Users } from 'lucide-react';
import { Card, CardContent, Button, Select } from '@/shared/components/ui';
import { useNavigate } from 'react-router-dom';

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'MON', label: 'Monday' },
  { key: 'TUE', label: 'Tuesday' },
  { key: 'WED', label: 'Wednesday' },
  { key: 'THU', label: 'Thursday' },
  { key: 'FRI', label: 'Friday' },
];

export const TimetablePage: React.FC = () => {
  const { activeCampus } = useTenant();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'room'>(
    'class'
  );
  const campusId = activeCampus?.id ?? 'campus-mm';

  const classes = useMemo(() => getClassesByCampus(campusId), [campusId]);
  const periods = useMemo(() => getPeriodsByCampus(campusId), [campusId]);
  const subjects = useMemo(() => getSubjectsByCampus(campusId), [campusId]);
  const rooms: Room[] = useMemo(() => getRoomsByCampus(campusId), [campusId]);
  const staff = useMemo(
    () => STAFF_MEMBERS.filter(s => s.campusId === campusId),
    [campusId]
  );
  const slots = useMemo(() => getTimetableSlotsByCampus(campusId), [campusId]);

  const [selectedEntityId, setSelectedEntityId] = useState<string>(
    classes[0]?.id ?? ''
  );

  const filteredSlots = useMemo(() => {
    return slots.filter(s => {
      if (viewMode === 'class') return s.classId === selectedEntityId;
      if (viewMode === 'teacher') return s.teacherId === selectedEntityId;
      return s.roomId === selectedEntityId;
    });
  }, [slots, viewMode, selectedEntityId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Timetable Management & Resource Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bell period schedules, room bookings, multi-view weekly grid &
            real-time collision detection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leadingIcon={<Clock className="h-4 w-4" />}
            onClick={() => navigate('/timetable/bell-schedule')}
          >
            Bell Schedules
          </Button>
          <Button
            variant="outline"
            size="sm"
            leadingIcon={<Users className="h-4 w-4" />}
            onClick={() => navigate('/timetable/substitutions')}
          >
            Teacher Substitutions
          </Button>
        </div>
      </div>

      {/* View Switcher & Entity Selector */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 mr-1">
              View Matrix:
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => {
                  setViewMode('class');
                  setSelectedEntityId(classes[0]?.id ?? '');
                }}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'class'
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-600'
                }`}
              >
                Class Cohort
              </button>
              <button
                onClick={() => {
                  setViewMode('teacher');
                  setSelectedEntityId(staff[0]?.id ?? '');
                }}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'teacher'
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-600'
                }`}
              >
                Teacher Schedule
              </button>
              <button
                onClick={() => {
                  setViewMode('room');
                  setSelectedEntityId(rooms[0]?.id ?? '');
                }}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'room'
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-600'
                }`}
              >
                Room Utilization
              </button>
            </div>
          </div>

          <div className="w-60">
            <Select
              value={selectedEntityId}
              onChange={e => setSelectedEntityId(e.target.value)}
              options={
                viewMode === 'class'
                  ? classes.map(c => ({ value: c.id, label: c.name }))
                  : viewMode === 'teacher'
                    ? staff.map(s => ({
                        value: s.id,
                        label: `${s.firstName} ${s.lastName}`,
                      }))
                    : rooms.map((r: Room) => ({ value: r.id, label: r.name }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Timetable Weekly Matrix Grid */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3 w-32 border-r border-slate-200">
                  Period / Time
                </th>
                {DAYS.map(d => (
                  <th
                    key={d.key}
                    className="p-3 border-r border-slate-200 min-w-[160px]"
                  >
                    <span className="font-bold text-slate-900 block">
                      {d.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periods.map(period => (
                <tr key={period.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-900 bg-slate-50/50 border-r border-slate-200">
                    <span className="font-bold block">{period.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {period.startTime} - {period.endTime}
                    </span>
                  </td>

                  {DAYS.map(day => {
                    const slot = filteredSlots.find(
                      s => s.periodId === period.id && s.dayOfWeek === day.key
                    );
                    const subject = subjects.find(
                      sub => sub.id === slot?.subjectId
                    );
                    const teacher = staff.find(st => st.id === slot?.teacherId);
                    const room = rooms.find((r: Room) => r.id === slot?.roomId);

                    return (
                      <td
                        key={day.key}
                        className="p-2 border-r border-slate-200 align-top"
                      >
                        {period.type === 'BREAK' || period.type === 'LUNCH' ? (
                          <div className="h-full py-3 bg-slate-50 text-center text-slate-400 font-medium italic rounded">
                            {period.name}
                          </div>
                        ) : slot ? (
                          <div className="p-2.5 rounded-lg bg-brand-50 border border-brand-200 text-brand-900 space-y-1 shadow-sm">
                            <span className="font-bold text-xs block text-brand-800">
                              {subject?.name ?? 'Subject'}
                            </span>
                            <div className="text-[10px] text-brand-600 flex items-center justify-between">
                              <span>
                                {teacher
                                  ? `${teacher.firstName[0]}. ${teacher.lastName}`
                                  : ''}
                              </span>
                              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-brand-100">
                                {room?.name}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-14 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300 hover:border-slate-400 transition-colors cursor-pointer">
                            <Plus className="h-4 w-4" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
