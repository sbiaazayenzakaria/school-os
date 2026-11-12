import React, { useMemo } from 'react';
import { useTenant } from '@/providers';
import { getPeriodsByCampus } from '@/data/mockData';
import { Plus, ArrowLeft } from 'lucide-react';
import { Card, CardContent, Button, Badge } from '@/shared/components/ui';
import { useNavigate } from 'react-router-dom';

export const BellSchedulePage: React.FC = () => {
  const { activeCampus } = useTenant();
  const navigate = useNavigate();

  const periods = useMemo(() => {
    return getPeriodsByCampus(activeCampus?.id ?? 'campus-mm');
  }, [activeCampus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/timetable')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Bell Schedule & Period Structure
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Period duration (45m/50m/60m), instructional blocks, passing
            periods, and lunch breaks for {activeCampus?.name}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leadingIcon={<Plus className="h-4 w-4" />}
        >
          Add Bell Period
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Period Label</th>
                <th className="p-3">Time Window</th>
                <th className="p-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periods.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono text-slate-400 font-bold">
                    {p.order}
                  </td>
                  <td className="p-3 font-bold text-slate-900">{p.name}</td>
                  <td className="p-3 font-mono text-slate-600">
                    {p.startTime} – {p.endTime}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        p.type === 'LESSON'
                          ? 'brand'
                          : p.type === 'LUNCH'
                            ? 'warning'
                            : 'neutral'
                      }
                      size="sm"
                    >
                      {p.type}
                    </Badge>
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
