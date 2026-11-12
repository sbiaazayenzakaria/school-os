import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/providers';
import {
  STUDENTS,
  getYearGroupsByCampus,
  getClassesByCampus,
} from '@/data/mockData';
import { Student, StudentStatus } from '@/shared/types';
import { formatDate } from '@/shared/utils/formatters';
import { Plus, FileDown, Shield, Eye } from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  Modal,
  ModalFooter,
  DataTable,
  Column,
  SensitivityBadge,
  useToast,
} from '@/shared/components/ui';

export const StudentsPage: React.FC = () => {
  const { activeCampus } = useTenant();
  const navigate = useNavigate();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [yearGroupFilter, setYearGroupFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Student form state
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newDob, setNewDob] = useState('2015-05-12');
  const [newGender, setNewGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>(
    'FEMALE'
  );
  const [newNationality, setNewNationality] = useState('French');

  const campusStudents = useMemo(() => {
    if (!activeCampus) return [];
    return STUDENTS.filter(s => s.campusId === activeCampus.id);
  }, [activeCampus]);

  const yearGroups = useMemo(() => {
    if (!activeCampus) return [];
    return getYearGroupsByCampus(activeCampus.id);
  }, [activeCampus]);

  const classes = useMemo(() => {
    if (!activeCampus) return [];
    return getClassesByCampus(activeCampus.id);
  }, [activeCampus]);

  const filteredStudents = useMemo(() => {
    return campusStudents.filter(s => {
      const matchesSearch = `${s.firstName} ${s.lastName} ${s.studentNumber}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
      const matchesYear =
        yearGroupFilter === 'ALL' || s.yearGroupId === yearGroupFilter;
      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [campusStudents, searchQuery, statusFilter, yearGroupFilter]);

  const handleCreateStudent = () => {
    if (!newFirstName || !newLastName) return;
    setIsAddModalOpen(false);
    success('Student Enrolled', {
      message: `${newFirstName} ${newLastName} successfully admitted to ${activeCampus?.name}.`,
    });
  };

  const columns: Column<Student>[] = [
    {
      key: 'studentNumber',
      header: 'Identifier',
      className: 'font-mono text-xs text-slate-500',
    },
    {
      key: 'name',
      header: 'Pupil Dossier',
      render: s => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center font-bold text-xs shrink-0">
            {s.firstName[0]}
            {s.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 text-xs">
                {s.firstName} {s.lastName}
              </span>
              {s.hasSEN && <SensitivityBadge type="SEN" size="sm" />}
              {s.hasMedicalAlert && (
                <SensitivityBadge type="MEDICAL" size="sm" />
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              DOB: {formatDate(s.dateOfBirth)} • {s.nationality}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'yearGroup',
      header: 'Class / Cohort',
      render: s => {
        const yg = yearGroups.find(y => y.id === s.yearGroupId);
        const cl = classes.find(c => c.id === s.classId);
        return (
          <div className="text-xs">
            <span className="font-medium text-slate-800">
              {cl?.name ?? 'Assigned'}
            </span>
            <span className="text-slate-400 block text-[11px]">{yg?.name}</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Enrollment State',
      render: s => {
        const variantMap: Record<
          StudentStatus,
          'success' | 'warning' | 'neutral' | 'danger'
        > = {
          ACTIVE: 'success',
          ENROLLED: 'success',
          ADMITTED: 'warning',
          APPLICANT: 'warning',
          ON_LEAVE: 'warning',
          TRANSFERRED: 'neutral',
          GRADUATED: 'neutral',
          ARCHIVED: 'neutral',
          WITHDRAWN: 'danger',
        };
        return (
          <Badge variant={variantMap[s.status] || 'neutral'} size="sm" dot>
            {s.status}
          </Badge>
        );
      },
    },
    {
      key: 'guardians',
      header: 'Guardians',
      render: s => (
        <span className="text-xs text-slate-600">
          {s.guardians.length > 0 ? (
            <span className="inline-flex items-center gap-1">
              {s.guardians[0].firstName} {s.guardians[0].lastName}
              {s.guardians[0].hasLegalParentalResponsibility && (
                <span
                  className="text-[10px] text-brand-600 font-semibold"
                  title="Legal Custody Verified"
                >
                  (Custody)
                </span>
              )}
            </span>
          ) : (
            'None listed'
          )}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: s => (
        <Button
          variant="ghost"
          size="sm"
          leadingIcon={<Eye className="h-3.5 w-3.5" />}
          onClick={e => {
            e.stopPropagation();
            navigate(`/students/${s.id}`);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Students & Pupil Records
            </h1>
            <Badge variant="brand" size="sm">
              {campusStudents.length} Active Dossiers
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive lifecycle state machine, demographic profiles &
            custodial rights
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leadingIcon={<FileDown className="h-4 w-4" />}
            onClick={() =>
              success('Dossier Export', {
                message: 'Campus student registry exported as CSV/PDF archive.',
              })
            }
          >
            Export Dossiers
          </Button>
          <Button
            variant="primary"
            size="sm"
            leadingIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Student
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search by name, ID number..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="w-40">
              <Select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'ENROLLED', label: 'Enrolled' },
                  { value: 'ON_LEAVE', label: 'On Leave' },
                  { value: 'ARCHIVED', label: 'Archived' },
                ]}
              />
            </div>

            <div className="w-48">
              <Select
                value={yearGroupFilter}
                onChange={e => setYearGroupFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Year Groups' },
                  ...yearGroups.map(yg => ({ value: yg.id, label: yg.name })),
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Data Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={filteredStudents}
            keyExtractor={s => s.id}
            onRowClick={s => navigate(`/students/${s.id}`)}
          />
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Admit / Register New Student"
        description="Creates an official pupil record in the active campus registry"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="e.g. Marie"
              value={newFirstName}
              onChange={e => setNewFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              placeholder="e.g. Curie"
              value={newLastName}
              onChange={e => setNewLastName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date of Birth"
              type="date"
              value={newDob}
              onChange={e => setNewDob(e.target.value)}
              required
            />
            <Select
              label="Gender"
              value={newGender}
              onChange={e =>
                setNewGender(e.target.value as 'MALE' | 'FEMALE' | 'OTHER')
              }
              options={[
                { value: 'FEMALE', label: 'Female' },
                { value: 'MALE', label: 'Male' },
                { value: 'OTHER', label: 'Other / Non-binary' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nationality"
              value={newNationality}
              onChange={e => setNewNationality(e.target.value)}
            />
            <Select
              label="Year Group Cohort"
              options={yearGroups.map(yg => ({ value: yg.id, label: yg.name }))}
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-brand-600" /> GDPR Notice:
            </p>
            Student identity data is processed under legitimate institutional
            educational mandates.
          </div>

          <ModalFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateStudent}>
              Admit Pupil
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
};
