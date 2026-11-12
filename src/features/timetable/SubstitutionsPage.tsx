import React from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  useToast,
} from '@/shared/components/ui';
import { useNavigate } from 'react-router-dom';

export const SubstitutionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();

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
              Teacher Substitution & Cover Dispatch
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Emergency faculty cover allocation, supply teacher booking & live
            timetable re-routing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today’s Faculty Absences</CardTitle>
            <CardDescription className="text-xs">
              Teachers marked absent requiring urgent classroom coverage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border border-rose-200 bg-rose-50 rounded-lg flex items-start justify-between">
              <div>
                <span className="font-bold text-xs text-rose-900 block">
                  Prof. Claire Rousseau (Sciences)
                </span>
                <span className="text-[11px] text-rose-700">
                  Absent: Medical leave • Affected: Period 3 (6ème A), Period 4
                  (5ème A)
                </span>
              </div>
              <Badge variant="danger" size="sm">
                Cover Needed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Available Qualified Cover Faculty
            </CardTitle>
            <CardDescription className="text-xs">
              Staff members with free periods matching the curriculum domain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-slate-900 block">
                  Prof. Pierre Blanc
                </span>
                <span className="text-[11px] text-slate-500">
                  Free Periods: 3 & 4 (Today)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  success('Cover Assigned', {
                    message:
                      'Prof. Pierre Blanc assigned to cover Period 3 (6ème A).',
                  })
                }
              >
                Dispatch Cover
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
