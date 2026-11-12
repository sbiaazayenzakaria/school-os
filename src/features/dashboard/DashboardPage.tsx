import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTenant } from '@/providers';
import { getDashboardMetrics, ANNOUNCEMENTS } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Plus,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  DataTable,
  Column,
} from '@/shared/components/ui';
import { Student } from '@/shared/types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { activeOrganization, activeCampus } = useTenant();
  const navigate = useNavigate();

  const metrics = getDashboardMetrics(
    activeOrganization?.id ?? 'org-ecole-paris',
    activeCampus?.id
  );

  const announcements = ANNOUNCEMENTS.filter(
    a => a.organizationId === (activeOrganization?.id ?? 'org-ecole-paris')
  );

  const studentColumns: Column<Student>[] = [
    {
      key: 'studentNumber',
      header: 'Student ID',
      className: 'font-mono text-xs text-slate-500',
    },
    {
      key: 'name',
      header: 'Student',
      render: s => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-xs shrink-0">
            {s.firstName[0]}
            {s.lastName[0]}
          </div>
          <div>
            <span className="font-medium text-slate-900 block text-xs">
              {s.firstName} {s.lastName}
            </span>
            <span className="text-[11px] text-slate-400">{s.nationality}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: s => (
        <Badge
          variant={s.status === 'ACTIVE' ? 'success' : 'neutral'}
          size="sm"
          dot
        >
          {s.status}
        </Badge>
      ),
    },
    {
      key: 'enrollmentDate',
      header: 'Enrolled',
      align: 'right',
      render: s => (
        <span className="text-xs text-slate-600">
          {formatDate(s.enrollmentDate)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Urgent Announcement */}
      {announcements.some(a => a.isUrgent) && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg shadow-sm flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wide">
              Urgent Broadcast Alert
            </h4>
            <p className="text-xs text-rose-700 font-medium mt-0.5">
              {announcements.find(a => a.isUrgent)?.title}
            </p>
            <p className="text-xs text-rose-600 mt-1">
              {announcements.find(a => a.isUrgent)?.body}
            </p>
          </div>
          <Badge variant="danger" size="sm">
            URGENT
          </Badge>
        </div>
      )}

      {/* Header Greeting & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('overview')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {activeOrganization?.name} • {activeCampus?.name} •{' '}
            <span className="font-semibold">{activeCampus?.type} LEVEL</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leadingIcon={<CalendarCheck className="h-4 w-4" />}
            onClick={() => navigate('/attendance')}
          >
            {t('actions.recordAttendance')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leadingIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate('/students')}
          >
            {t('actions.newEnrollment')}
          </Button>
        </div>
      </div>

      {/* 4 European KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                {t('metrics.totalStudents')}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {metrics.totalStudents}
              </h3>
              <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="h-3 w-3" /> +12% this academic term
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Active Staff */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                {t('metrics.activeStaff')}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {metrics.activeStaff}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Teaching & Admin Faculty
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                {t('metrics.attendanceToday')}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {metrics.attendanceRateToday}%
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Mode:{' '}
                {activeCampus?.attendanceMode === 'HOMEROOM_DAILY'
                  ? 'Homeroom'
                  : 'Period'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CalendarCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Receivables */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                {t('metrics.outstandingFees')}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatCurrency(
                  metrics.outstandingFeesMinorUnits,
                  metrics.currency
                )}
              </h3>
              <p className="text-[11px] text-amber-600 font-medium mt-1">
                SEPA direct debits queued
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CreditCard className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  {t('attendanceTrend')}
                </CardTitle>
                <CardDescription className="text-xs">
                  Historical attendance percentage across past 4 weeks
                </CardDescription>
              </div>
              <Badge variant="brand" size="sm">
                Live Register
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metrics.attendanceTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                      <stop
                        offset="95%"
                        stopColor="#4F46E5"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                  />
                  <YAxis
                    domain={[70, 100]}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAtt)"
                    name="Attendance %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Admissions Funnel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  {t('admissionsPipeline')}
                </CardTitle>
                <CardDescription className="text-xs">
                  Active applicant cohort distribution by review stage
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                trailingIcon={<ArrowUpRight className="h-3 w-3" />}
                onClick={() => navigate('/admissions')}
              >
                View Pipeline
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.admissionsPipeline}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 10, fill: '#64748B' }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#6366F1"
                    radius={[4, 4, 0, 0]}
                    name="Candidates"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pupil Registrations Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">
              {t('recentEnrollments')}
            </CardTitle>
            <CardDescription className="text-xs">
              Latest pupil profiles registered in the active campus dossier
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/students')}
          >
            {t('actions.viewReports')}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={studentColumns}
            data={metrics.recentEnrollments}
            keyExtractor={s => s.id}
            onRowClick={s => navigate(`/students/${s.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
};
