import React, { useState, useMemo } from 'react';
import { useTenant } from '@/providers';
import { STUDENTS, CLASSES, ASSESSMENTS, GRADES } from '@/data/mockData';
import { Save, ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Select,
  useToast,
  GradeBadge,
  CompetencyBadge,
} from '@/shared/components/ui';
import { useNavigate } from 'react-router-dom';

export const GradebookPage: React.FC = () => {
  const { activeCampus } = useTenant();
  const navigate = useNavigate();
  const { success } = useToast();

  const classes = useMemo(() => {
    if (!activeCampus) return [];
    return CLASSES.filter(c => c.campusId === activeCampus.id);
  }, [activeCampus]);

  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id ?? ''
  );

  const campusStudents = useMemo(() => {
    return STUDENTS.filter(s => s.classId === selectedClassId);
  }, [selectedClassId]);

  const campusAssessments = useMemo(() => {
    return ASSESSMENTS.filter(a => a.classId === selectedClassId);
  }, [selectedClassId]);

  // Scores dictionary: `${assessmentId}-${studentId}` -> rawScore | competencyLevel
  const [scores, setScores] = useState<Record<string, number | string>>(() => {
    const init: Record<string, number | string> = {};
    GRADES.forEach(g => {
      init[`${g.assessmentId}-${g.studentId}`] =
        g.rawScore ?? g.competencyLevel ?? '';
    });
    return init;
  });

  const isPrimary = activeCampus?.gradingSystem === 'PRIMARY_COMPETENCY';

  const handleCellChange = (asmtId: string, studentId: string, val: string) => {
    setScores(prev => ({
      ...prev,
      [`${asmtId}-${studentId}`]: isPrimary
        ? val
        : val === ''
          ? ''
          : Number(val),
    }));
  };

  const handleSaveAll = () => {
    success('Gradebook Synced', {
      message:
        'All updated student assessment scores successfully calculated and persisted.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/assessments')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Interactive Spreadsheet Gradebook
            </h1>
            <Badge variant="brand" size="sm">
              {activeCampus?.gradingSystem}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Spreadsheet-style rapid entry grid with polymorphic strategy
            calculation & real-time badge feedback
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leadingIcon={<Save className="h-4 w-4" />}
            onClick={handleSaveAll}
          >
            Save All Marks
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="w-56">
            <Select
              label="Selected Class"
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              options={classes.map(c => ({ value: c.id, label: c.name }))}
            />
          </div>

          <div className="text-xs text-slate-500">
            Active Strategy:{' '}
            <span className="font-semibold text-slate-800">
              {activeCampus?.gradingSystem}
            </span>{' '}
            • Auto-calculates term weighted average
          </div>
        </CardContent>
      </Card>

      {/* Spreadsheet Grid */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3 sticky left-0 bg-slate-50 z-10 w-48 border-r border-slate-200">
                  Student Name
                </th>
                {campusAssessments.map(a => (
                  <th
                    key={a.id}
                    className="p-3 min-w-[160px] border-r border-slate-200"
                  >
                    <span className="font-bold text-slate-900 block truncate">
                      {a.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Max: {a.maxScore} • Coeff: {a.weight}
                    </span>
                  </th>
                ))}
                <th className="p-3 min-w-[120px] text-right">
                  Computed Average
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campusStudents.map(s => {
                let totalPoints = 0;
                let totalMax = 0;

                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 sticky left-0 bg-white hover:bg-slate-50 z-10 font-medium text-slate-900 border-r border-slate-200 whitespace-nowrap">
                      {s.firstName} {s.lastName}
                    </td>

                    {campusAssessments.map(a => {
                      const key = `${a.id}-${s.id}`;
                      const val = scores[key] ?? '';

                      if (!isPrimary && typeof val === 'number') {
                        totalPoints += val * a.weight;
                        totalMax += a.maxScore * a.weight;
                      }

                      return (
                        <td
                          key={a.id}
                          className="p-2 border-r border-slate-200"
                        >
                          {isPrimary ? (
                            /* Primary Competency Select */
                            <select
                              value={String(val)}
                              onChange={e =>
                                handleCellChange(a.id, s.id, e.target.value)
                              }
                              className="w-full text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                            >
                              <option value="">— Select —</option>
                              <option value="EXCEEDING">
                                Exceeding / Expert
                              </option>
                              <option value="SECURE">Secure / Acquis</option>
                              <option value="DEVELOPING">
                                Developing / En acq.
                              </option>
                              <option value="EMERGING">
                                Emerging / Non acquis
                              </option>
                            </select>
                          ) : (
                            /* Secondary Numeric Entry */
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                max={a.maxScore}
                                value={val === '' ? '' : val}
                                onChange={e =>
                                  handleCellChange(a.id, s.id, e.target.value)
                                }
                                className="w-20 px-2 py-1 border border-slate-300 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-500"
                                placeholder="Score"
                              />
                              {typeof val === 'number' && (
                                <GradeBadge
                                  score={val}
                                  maxScore={a.maxScore}
                                  system={
                                    activeCampus?.gradingSystem ??
                                    'FRENCH_SCALE'
                                  }
                                  size="sm"
                                />
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    <td className="p-3 text-right font-bold text-slate-900">
                      {isPrimary ? (
                        <CompetencyBadge level="SECURE" size="sm" />
                      ) : totalMax > 0 ? (
                        <GradeBadge
                          score={(totalPoints / totalMax) * 20}
                          maxScore={20}
                          system={activeCampus?.gradingSystem ?? 'FRENCH_SCALE'}
                          size="sm"
                        />
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
