import React, { useState, useMemo } from 'react';
import { useTenant } from '@/providers';
import { STUDENTS, CLASSES, SUBJECTS } from '@/data/mockData';
import { formatDate } from '@/shared/utils/formatters';
import { Printer, Download } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  CompetencyBadge,
  GradeBadge,
  useToast,
} from '@/shared/components/ui';

export const ReportCardsPage: React.FC = () => {
  const { activeCampus, activeOrganization } = useTenant();
  const { success } = useToast();

  const students = useMemo(() => {
    if (!activeCampus) return [];
    return STUDENTS.filter(s => s.campusId === activeCampus.id);
  }, [activeCampus]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id ?? ''
  );

  const student = students.find(s => s.id === selectedStudentId) ?? students[0];
  const schoolClass = CLASSES.find(c => c.id === student?.classId);
  const subjects = useMemo(() => {
    if (!activeCampus) return [];
    return SUBJECTS.filter(s => s.campusId === activeCampus.id);
  }, [activeCampus]);

  const isPrimary = activeCampus?.gradingSystem === 'PRIMARY_COMPETENCY';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Official Report Cards & Terminal Bulletins
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pixel-perfect print/PDF export formatted for German (Zeugnis) and
            French (Bulletin Scolaire) standards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leadingIcon={<Printer className="h-4 w-4" />}
            onClick={() => window.print()}
          >
            Print Bulletin
          </Button>
          <Button
            variant="primary"
            size="sm"
            leadingIcon={<Download className="h-4 w-4" />}
            onClick={() =>
              success('PDF Export Generated', {
                message: `Official signed PDF bulletin generated for ${student?.firstName} ${student?.lastName}.`,
              })
            }
          >
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left student selector */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Cohort Pupils</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {students.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStudentId(s.id)}
                className={`w-full text-left p-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  s.id === selectedStudentId
                    ? 'bg-brand-50 text-brand-700 border border-brand-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>
                  {s.firstName} {s.lastName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {s.studentNumber}
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Right: Pixel-perfect preview card */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm print:border-none print:shadow-none space-y-6">
            {/* Institution Letterhead */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  {activeOrganization?.name}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {activeCampus?.name}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {activeCampus?.address}, {activeCampus?.city}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest block">
                  {isPrimary
                    ? 'LIVRET SCOLAIRE UNIQUE (LSU)'
                    : activeCampus?.gradingSystem === 'GERMAN_SCALE'
                      ? 'HALBJAHRESZEUGNIS'
                      : 'BULLETIN DU TRIMESTRE'}
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  Année 2026/2027
                </span>
              </div>
            </div>

            {/* Student metadata banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Pupil Name
                </span>
                <span className="font-bold text-slate-900">
                  {student?.firstName} {student?.lastName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Date of Birth
                </span>
                <span className="font-semibold text-slate-800">
                  {student ? formatDate(student.dateOfBirth) : ''}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Class
                </span>
                <span className="font-semibold text-slate-800">
                  {schoolClass?.name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Attendance
                </span>
                <span className="font-bold text-emerald-600">
                  97.5% Present
                </span>
              </div>
            </div>

            {/* Subject evaluations table */}
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 text-slate-800 uppercase font-bold tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3 border-r border-slate-200">
                    Matière / Discipline
                  </th>
                  <th className="p-3 border-r border-slate-200 w-36 text-center">
                    {isPrimary ? 'Niveau d’acquisition' : 'Moyenne / Note'}
                  </th>
                  <th className="p-3">Observations de l’équipe pédagogique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {subjects.map(subj => (
                  <tr key={subj.id}>
                    <td className="p-3 font-semibold text-slate-900 border-r border-slate-200">
                      {subj.name}
                    </td>
                    <td className="p-3 text-center border-r border-slate-200">
                      {isPrimary ? (
                        <CompetencyBadge level="SECURE" size="sm" />
                      ) : activeCampus?.gradingSystem === 'GERMAN_SCALE' ? (
                        <GradeBadge
                          score={1.8}
                          maxScore={6}
                          system="GERMAN_SCALE"
                          size="sm"
                        />
                      ) : (
                        <GradeBadge
                          score={15.5}
                          maxScore={20}
                          system="FRENCH_SCALE"
                          size="sm"
                        />
                      )}
                    </td>
                    <td className="p-3 text-slate-600">
                      Excellent investissement. Résultats très satisfaisants et
                      participation active aux cours.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* General Appreciations & Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="font-bold text-slate-900 block">
                  Avis du conseil de classe / Homeroom Remarks:
                </span>
                <p className="text-slate-700 italic">
                  « Trimestre très encourageant. Félicitations pour l'attitude
                  exemplaire et les progrès continus. »
                </p>
                <div className="pt-2 font-bold text-brand-700">
                  Mention: Félicitations
                </div>
              </div>

              <div className="flex flex-col justify-between border border-dashed border-slate-300 rounded-lg p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Signature de la direction / Visa du Chef d'établissement
                </span>
                <div className="text-right pt-8 font-mono text-[11px] text-slate-500">
                  Cachet officiel de l’établissement
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
