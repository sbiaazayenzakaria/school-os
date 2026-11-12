import React, { useState, useMemo } from 'react';
import { useTenant } from '@/providers';
import { APPLICATIONS } from '@/data/mockData';
import { Application, ApplicationStatus } from '@/shared/types';
import { formatDate } from '@/shared/utils/formatters';
import { Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Modal,
  ModalFooter,
  DataTable,
  Column,
  useToast,
} from '@/shared/components/ui';

const PIPELINE_STAGES: {
  status: ApplicationStatus;
  label: string;
  color: string;
}[] = [
  { status: 'INQUIRY', label: 'Inquiry', color: 'bg-slate-100 text-slate-700' },
  { status: 'APPLIED', label: 'Applied', color: 'bg-sky-50 text-sky-700' },
  { status: 'REVIEW', label: 'Review', color: 'bg-indigo-50 text-indigo-700' },
  {
    status: 'INTERVIEW',
    label: 'Interview',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    status: 'OFFERED',
    label: 'Offered',
    color: 'bg-purple-50 text-purple-700',
  },
  {
    status: 'ACCEPTED',
    label: 'Accepted',
    color: 'bg-emerald-50 text-emerald-700',
  },
];

export const AdmissionsPage: React.FC = () => {
  const { activeOrganization } = useTenant();
  const { success } = useToast();

  const [activeView, setActiveView] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Application
  const [candFirst, setCandFirst] = useState('');
  const [candLast, setCandLast] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');

  const orgApps = useMemo(() => {
    return APPLICATIONS.filter(
      a => a.organizationId === (activeOrganization?.id ?? 'org-ecole-paris')
    );
  }, [activeOrganization]);

  const filteredApps = useMemo(() => {
    return orgApps.filter(a => {
      const q = searchQuery.toLowerCase();
      return (
        `${a.applicantFirstName} ${a.applicantLastName}`
          .toLowerCase()
          .includes(q) ||
        a.applicationNumber.toLowerCase().includes(q) ||
        a.primaryGuardianName.toLowerCase().includes(q)
      );
    });
  }, [orgApps, searchQuery]);

  const handleCreate = () => {
    if (!candFirst || !candLast) return;
    setIsModalOpen(false);
    success('Application Received', {
      message: `Applicant ${candFirst} ${candLast} added to Admissions pipeline.`,
    });
  };

  const columns: Column<Application>[] = [
    {
      key: 'number',
      header: 'Reference',
      className: 'font-mono text-xs text-slate-500',
      render: a => a.applicationNumber,
    },
    {
      key: 'candidate',
      header: 'Applicant',
      render: a => (
        <div>
          <span className="font-semibold text-xs text-slate-900 block">
            {a.applicantFirstName} {a.applicantLastName}
          </span>
          <span className="text-[11px] text-slate-400">
            DOB: {formatDate(a.dateOfBirth)}
          </span>
        </div>
      ),
    },
    {
      key: 'guardian',
      header: 'Primary Guardian',
      render: a => (
        <div className="text-xs">
          <span className="font-medium text-slate-800 block">
            {a.primaryGuardianName}
          </span>
          <span className="text-[11px] text-slate-500">
            {a.primaryGuardianEmail}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Pipeline Stage',
      render: a => (
        <Badge variant="brand" size="sm" dot>
          {a.status}
        </Badge>
      ),
    },
    {
      key: 'appliedAt',
      header: 'Applied Date',
      align: 'right',
      render: a => (
        <span className="text-xs text-slate-600">
          {formatDate(a.appliedAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Admissions Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track inquiries, manage review stages, schedule interviews & convert
            accepted pupils
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveView('board')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeView === 'board'
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-600'
              }`}
            >
              Pipeline Board
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeView === 'list'
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-600'
              }`}
            >
              Table View
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            leadingIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            New Application
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-3">
          <Input
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {activeView === 'board' ? (
        /* Kanban Pipeline Board */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PIPELINE_STAGES.map(stage => {
            const items = filteredApps.filter(a => a.status === stage.status);
            return (
              <div
                key={stage.status}
                className="bg-slate-100/70 rounded-xl p-2.5 border border-slate-200"
              >
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {stage.label}
                  </span>
                  <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {items.map(app => (
                    <Card
                      key={app.id}
                      className="p-3 hover:shadow-sm transition-shadow cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="font-semibold text-xs text-slate-900 block truncate">
                          {app.applicantFirstName} {app.applicantLastName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {app.applicationNumber}
                        </span>
                        <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-500">
                          {app.primaryGuardianName}
                        </div>
                      </div>
                    </Card>
                  ))}

                  {items.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-slate-400">
                      No candidates
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={filteredApps}
              keyExtractor={a => a.id}
            />
          </CardContent>
        </Card>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Candidate Application"
        description="Creates a prospective pupil dossier in the admissions pipeline"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Candidate First Name"
              value={candFirst}
              onChange={e => setCandFirst(e.target.value)}
              required
            />
            <Input
              label="Candidate Last Name"
              value={candLast}
              onChange={e => setCandLast(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Guardian Name"
              value={guardianName}
              onChange={e => setGuardianName(e.target.value)}
              required
            />
            <Input
              label="Guardian Email"
              type="email"
              value={guardianEmail}
              onChange={e => setGuardianEmail(e.target.value)}
              required
            />
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Submit Application
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
};
