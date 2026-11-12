import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { STAFF_MEMBERS, DEPARTMENTS } from '@/data/mockData';
import { formatDate } from '@/shared/utils/formatters';
import { ArrowLeft, Award } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from '@/shared/components/ui';

export const StaffProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const staff = STAFF_MEMBERS.find(s => s.id === id) ?? STAFF_MEMBERS[0];
  const department = DEPARTMENTS.find(d => d.id === staff?.departmentId);

  if (!staff) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Staff member not found.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/staff')}
        >
          Back to Faculty Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        leadingIcon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => navigate('/staff')}
      >
        Back to Staff Directory
      </Button>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-teal-100 text-teal-800 border-2 border-teal-200 flex items-center justify-center font-bold text-xl shrink-0">
              {staff.firstName[0]}
              {staff.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  {staff.firstName} {staff.lastName}
                </h1>
                <Badge
                  variant={staff.isActive ? 'success' : 'neutral'}
                  size="sm"
                  dot
                >
                  {staff.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {staff.jobTitle} • {department?.name ?? 'General Instruction'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Credentials & Professional Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {staff.qualifications.map((q, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 border border-slate-200"
              >
                <Award className="h-4 w-4 text-brand-600 shrink-0" />
                <span>{q}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Contractual Workload & Deputat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Employment Type</span>
              <span className="font-semibold text-slate-900">
                {staff.employmentType}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Contracted Hours / Week</span>
              <span className="font-semibold text-slate-900">
                {staff.contractedHoursPerWeek} hrs
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Allocated Teaching Periods</span>
              <span className="font-semibold text-slate-900">
                {staff.allocatedHoursPerWeek} hrs
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Appointment Date</span>
              <span className="font-semibold text-slate-900">
                {formatDate(staff.joinDate)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
