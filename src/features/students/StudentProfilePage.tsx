import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  STUDENTS,
  YEAR_GROUPS,
  CLASSES,
  ATTENDANCE_RECORDS,
  INVOICES,
} from '@/data/mockData';
import { formatDate, formatCurrency } from '@/shared/utils/formatters';
import {
  ArrowLeft,
  Shield,
  Download,
  Mail,
  Phone,
  CheckCircle,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  SensitivityBadge,
  LegalHoldBanner,
  useToast,
} from '@/shared/components/ui';

type ProfileTab = 'overview' | 'guardians' | 'attendance' | 'finance' | 'gdpr';

interface TabItem {
  key: ProfileTab;
  label: string;
}

export const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { info, success } = useToast();

  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const student = STUDENTS.find(s => s.id === id) ?? STUDENTS[0];
  const yearGroup = YEAR_GROUPS.find(yg => yg.id === student?.yearGroupId);
  const schoolClass = CLASSES.find(c => c.id === student?.classId);
  const attendance = ATTENDANCE_RECORDS.filter(
    a => a.studentId === student?.id
  );
  const invoices = INVOICES.filter(i => i.studentId === student?.id);

  if (!student) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Student dossier not found.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/students')}
        >
          Back to Students
        </Button>
      </div>
    );
  }

  const tabs: TabItem[] = [
    { key: 'overview', label: 'Overview & Demographics' },
    { key: 'guardians', label: `Guardians (${student.guardians.length})` },
    { key: 'attendance', label: `Attendance Records (${attendance.length})` },
    { key: 'finance', label: `Tuition & Invoices (${invoices.length})` },
    { key: 'gdpr', label: 'GDPR & Custodial Rights' },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          leadingIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/students')}
        >
          Back to Student Directory
        </Button>
      </div>

      {/* Legal Hold alert banner if active */}
      {student.hasLegalHold && (
        <LegalHoldBanner reason="Legal Hold placed by Data Protection Officer. Automated deletion, retention purging and record anonymization are suspended by educational legal mandate." />
      )}

      {/* Dossier Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-brand-100 text-brand-700 border-2 border-brand-200 flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                {student.firstName[0]}
                {student.lastName[0]}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">
                    {student.firstName} {student.lastName}
                  </h1>
                  <Badge variant="success" size="sm" dot>
                    {student.status}
                  </Badge>
                  {student.hasSEN && <SensitivityBadge type="SEN" />}
                  {student.hasMedicalAlert && (
                    <SensitivityBadge type="MEDICAL" />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5 font-mono">
                  <span>ID: {student.studentNumber}</span>
                  <span>•</span>
                  <span>Class: {schoolClass?.name ?? 'Assigned'}</span>
                  <span>•</span>
                  <span>Cohort: {yearGroup?.name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leadingIcon={<Download className="h-4 w-4" />}
                onClick={() =>
                  success('Dossier Export', {
                    message: `Official dossier for ${student.firstName} ${student.lastName} generated in PDF/JSON format.`,
                  })
                }
              >
                Export Dossier
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  info('Record Update', {
                    message: 'Dossier edit mode activated.',
                  })
                }
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 mt-6 -mb-6 gap-6 text-xs font-semibold">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Personal & Demographic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Legal Name</span>
                <span className="font-medium text-slate-900">
                  {student.firstName} {student.lastName}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Date of Birth</span>
                <span className="font-medium text-slate-900">
                  {formatDate(student.dateOfBirth)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Gender</span>
                <span className="font-medium text-slate-900">
                  {student.gender}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Nationality</span>
                <span className="font-medium text-slate-900">
                  {student.nationality ?? 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Languages at Home</span>
                <span className="font-medium text-slate-900">
                  {student.languagesSpoken.join(', ')}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Academic Enrollment Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Enrollment Date</span>
                <span className="font-medium text-slate-900">
                  {formatDate(student.enrollmentDate)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Current Status</span>
                <Badge variant="success" size="sm" dot>
                  {student.status}
                </Badge>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Special Needs (SEN)</span>
                <span>
                  {student.hasSEN ? 'Accommodations Active' : 'None registered'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Medical Protocol</span>
                <span>
                  {student.hasMedicalAlert
                    ? 'Physician plan on file'
                    : 'Standard'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'guardians' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {student.guardians.map(g => (
            <Card key={g.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">
                      {g.firstName} {g.lastName}
                    </CardTitle>
                    <CardDescription className="text-xs capitalize">
                      Relationship: {g.relationship.toLowerCase()}
                    </CardDescription>
                  </div>
                  {g.isPrimaryContact && (
                    <Badge variant="brand" size="sm">
                      Primary Contact
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{g.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{g.phone}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span>
                      Legal Custodial Responsibility Verified (Art. 8)
                    </span>
                  </div>
                  {g.isEmergencyPickupAuthorized && (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <CheckCircle className="h-3.5 w-3.5 text-brand-600" />
                      <span>Authorized for daily school pickup</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'attendance' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recorded Attendance Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {attendance.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No absence or attendance incidents logged for this period.
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Recorded At</th>
                    <th className="p-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendance.map(a => (
                    <tr key={a.id}>
                      <td className="p-3 font-medium text-slate-900">
                        {formatDate(a.date)}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            a.status === 'PRESENT'
                              ? 'success'
                              : a.status === 'LATE'
                                ? 'warning'
                                : 'danger'
                          }
                          size="sm"
                          dot
                        >
                          {a.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-500">{a.recordedAt}</td>
                      <td className="p-3 text-slate-600">{a.notes ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'finance' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Tuition Invoices & Fee Ledger
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {invoices.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No outstanding or historical invoices found for this pupil.
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Invoice Number</th>
                    <th className="p-3">Issue Date</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map(i => (
                    <tr key={i.id}>
                      <td className="p-3 font-mono text-slate-800">
                        {i.invoiceNumber}
                      </td>
                      <td className="p-3 text-slate-600">
                        {formatDate(i.issueDate)}
                      </td>
                      <td className="p-3 text-slate-600">
                        {formatDate(i.dueDate)}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {formatCurrency(i.totalMinorUnits, i.currency)}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            i.status === 'PAID'
                              ? 'success'
                              : i.status === 'OVERDUE'
                                ? 'danger'
                                : 'warning'
                          }
                          size="sm"
                          dot
                        >
                          {i.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'gdpr' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              GDPR Compliance Dossier & Data Protection
            </CardTitle>
            <CardDescription className="text-xs">
              Statutory archiving, retention schedules and Right of Access data
              exports (Art. 15, 17 & 20)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-600" /> Statutory
                Retention vs Right to Erasure
              </h4>
              <p className="text-slate-600">
                SchoolOS separates operational personal data from legally
                mandated academic transcripts. Graduation transcripts are
                retained permanently under statutory education code;
                non-essential identifiers can be purged upon verified guardian
                request.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                leadingIcon={<Download className="h-4 w-4" />}
                onClick={() =>
                  success('Portability Dossier', {
                    message:
                      'GDPR machine-readable JSON archive ready for download.',
                  })
                }
              >
                Export JSON Archive (Art. 20)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
