import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/providers';
import { ArrowLeft } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
} from '@/shared/components/ui';

export const CampusDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeCampus } = useTenant();

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/organizations')}
        leadingIcon={<ArrowLeft className="h-4 w-4" />}
      >
        Back to Organizations
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{activeCampus?.name}</CardTitle>
            <Badge variant="brand">{activeCampus?.type}</Badge>
          </div>
          <CardDescription>
            {activeCampus?.address}, {activeCampus?.city},{' '}
            {activeCampus?.country}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="text-slate-400 block font-bold">
                Term Structure
              </span>
              <span className="font-semibold text-slate-800">
                {activeCampus?.termStructure}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold">
                Grading Policy
              </span>
              <span className="font-semibold text-slate-800">
                {activeCampus?.gradingSystem}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold">
                Attendance Mode
              </span>
              <span className="font-semibold text-slate-800">
                {activeCampus?.attendanceMode}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold">Timezone</span>
              <span className="font-semibold text-slate-800">
                {activeCampus?.timezone}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
