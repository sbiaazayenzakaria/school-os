import React from 'react';
import { ShieldAlert, Download } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  useToast,
} from '@/shared/components/ui';

export const GDPRPage: React.FC = () => {
  const { success, warning } = useToast();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          GDPR Compliance & Legal Hold Center
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Data Subject Access Requests (DSAR), statutory archiving, two-step
          deletion workflows & tombstone logs
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-bold text-amber-900 uppercase">
            Active Legal Holds in Institution
          </h4>
          <p className="text-amber-800 mt-0.5">
            1 pupil record is currently protected under an active statutory
            Legal Hold (Antoine Laurent). All automated deletion routines and
            Right to be Forgotten purgers are suspended for this entity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Two-Step Auditable Deletion Engine
            </CardTitle>
            <CardDescription className="text-xs">
              Prevents unauthorized permanent erasure through DPO verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600">
            <p>
              When a verified guardian invokes the Right to Erasure (Art. 17),
              SchoolOS scrubs all non-statutory PII while retaining graduation
              diplomas and tax records in a read-only encrypted partition.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                warning('DPO Verification Required', {
                  message:
                    'Deletion request flagged for Data Protection Officer approval.',
                })
              }
            >
              Simulate Erasure Request
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Cryptographic Tombstone Audit Log
            </CardTitle>
            <CardDescription className="text-xs">
              Immutable security record of all purged data entities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600">
            <p>
              Every deletion leaves an immutable tombstone record logging the
              timestamp, approving officer, and statutory justification without
              persisting deleted PII.
            </p>
            <Button
              variant="outline"
              size="sm"
              leadingIcon={<Download className="h-3.5 w-3.5" />}
              onClick={() =>
                success('Audit Exported', {
                  message: 'Immutable tombstone log downloaded.',
                })
              }
            >
              Export Tombstone Log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
