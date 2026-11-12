import React from 'react';
import { FileText, Upload, Download, Lock } from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  useToast,
} from '@/shared/components/ui';

export const DocumentsPage: React.FC = () => {
  const { success } = useToast();

  const documents = [
    {
      id: 'doc-1',
      title: 'Règlement Intérieur 2026/2027',
      category: 'Institutional Policy',
      size: '2.4 MB',
      updated: '2026-09-01',
    },
    {
      id: 'doc-2',
      title: 'Plan d’Urgence & Sécurité Incendie (PPMS)',
      category: 'Safety Protocol',
      size: '1.8 MB',
      updated: '2026-09-10',
    },
    {
      id: 'doc-3',
      title: 'Formulaire d’Autorisation Parentale (Sorties)',
      category: 'Parental Consent',
      size: '540 KB',
      updated: '2026-10-02',
    },
    {
      id: 'doc-4',
      title: 'Protocole d’Accueil Individualisé (PAI Médical)',
      category: 'Medical Confidential',
      size: '820 KB',
      updated: '2026-10-15',
      protected: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Document Repository & Pupil Dossiers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Scoped institutional policies, medical consents, transfer
            certificates & retention archives
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leadingIcon={<Upload className="h-4 w-4" />}
          onClick={() =>
            success('Document Upload', {
              message: 'Encrypted document archive updated.',
            })
          }
        >
          Upload Document
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3">Document Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">File Size</th>
                <th className="p-3">Last Modified</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map(d => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-brand-600 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          {d.title}
                        </span>
                        {d.protected && (
                          <span className="text-[10px] text-violet-700 font-semibold flex items-center gap-1 mt-0.5">
                            <Lock className="h-3 w-3" /> GDPR Art. 9 Restricted
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="neutral" size="sm">
                      {d.category}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono text-slate-500">{d.size}</td>
                  <td className="p-3 text-slate-600">{d.updated}</td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      leadingIcon={<Download className="h-3.5 w-3.5" />}
                      onClick={() =>
                        success('Download Ready', {
                          message: `${d.title} downloaded securely.`,
                        })
                      }
                    >
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
