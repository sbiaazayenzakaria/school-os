import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/providers';
import {
  getAssessmentsByCampus,
  getClassesByCampus,
  getSubjectsByCampus,
} from '@/data/mockData';
import { Assessment, AssessmentType } from '@/shared/types';
import { formatDate } from '@/shared/utils/formatters';
import { Plus, FileSpreadsheet, Award } from 'lucide-react';
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
  useToast,
} from '@/shared/components/ui';

export const AssessmentsPage: React.FC = () => {
  const { activeCampus } = useTenant();
  const navigate = useNavigate();
  const { success } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [maxScore, setMaxScore] = useState('20');
  const [weight, setWeight] = useState('0.3');
  const [asmtType, setAsmtType] = useState<AssessmentType>('TEST');

  const campusId = activeCampus?.id ?? 'campus-mm';
  const assessments = useMemo(
    () => getAssessmentsByCampus(campusId),
    [campusId]
  );
  const classes = useMemo(() => getClassesByCampus(campusId), [campusId]);
  const subjects = useMemo(() => getSubjectsByCampus(campusId), [campusId]);

  const handleCreate = () => {
    if (!title) return;
    setIsModalOpen(false);
    success('Assessment Scheduled', {
      message: `"${title}" has been scheduled in the academic calendar.`,
    });
  };

  const columns: Column<Assessment>[] = [
    {
      key: 'title',
      header: 'Evaluation / Exam Title',
      render: a => (
        <div>
          <span className="font-semibold text-xs text-slate-900 block">
            {a.title}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Weight: {(a.weight * 100).toFixed(0)}% • Max Score: {a.maxScore}
          </span>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject & Class',
      render: a => {
        const s = subjects.find(sub => sub.id === a.subjectId);
        const c = classes.find(cl => cl.id === a.classId);
        return (
          <div className="text-xs">
            <span className="font-medium text-slate-800 block">
              {s?.name ?? 'General'}
            </span>
            <span className="text-[11px] text-slate-500">{c?.name}</span>
          </div>
        );
      },
    },
    {
      key: 'type',
      header: 'Assessment Type',
      render: a => (
        <Badge
          variant={
            a.type === 'FINAL' || a.type === 'TEST' ? 'brand' : 'neutral'
          }
          size="sm"
        >
          {a.type}
        </Badge>
      ),
    },
    {
      key: 'scale',
      header: 'Grading Scale',
      render: a => (
        <Badge variant="info" size="sm">
          {a.gradingSystem}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Exam Date',
      render: a => (
        <span className="text-xs text-slate-600">{formatDate(a.date)}</span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: () => (
        <Button
          variant="outline"
          size="sm"
          leadingIcon={<FileSpreadsheet className="h-3.5 w-3.5" />}
          onClick={() => navigate('/assessments/gradebook')}
        >
          Enter Grades
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Examinations & Assessments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Polymorphic grading scales, weighted continuous evaluations &
            terminal exam calendars
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leadingIcon={<Award className="h-4 w-4" />}
            onClick={() => navigate('/assessments/report-cards')}
          >
            Report Cards
          </Button>
          <Button
            variant="primary"
            size="sm"
            leadingIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Schedule Assessment
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={assessments}
            keyExtractor={a => a.id}
          />
        </CardContent>
      </Card>

      {/* Schedule Assessment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Assessment / Examination"
        description="Configure evaluation title, weighting, and grading scale parameters"
      >
        <div className="space-y-3">
          <Input
            label="Evaluation Title"
            placeholder="e.g. Contrôle de Mathématiques – Fractions"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Assessment Type"
              value={asmtType}
              onChange={e => setAsmtType(e.target.value as AssessmentType)}
              options={[
                { value: 'TEST', label: 'Unit Test / Contrôle' },
                { value: 'QUIZ', label: 'Quiz / Interrogation' },
                { value: 'HOMEWORK', label: 'Homework / Devoir' },
                { value: 'ORAL', label: 'Oral Presentation' },
                { value: 'FINAL', label: 'Final Exam' },
              ]}
            />
            <Input
              label="Evaluation Date"
              type="date"
              defaultValue="2026-11-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Max Score"
              type="number"
              value={maxScore}
              onChange={e => setMaxScore(e.target.value)}
            />
            <Input
              label="Coefficient / Weight (0.1 - 1.0)"
              type="number"
              step="0.05"
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
          </div>

          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Save Assessment
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
};
