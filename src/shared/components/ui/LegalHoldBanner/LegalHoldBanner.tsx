import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface LegalHoldBannerProps {
  reason?: string;
}

export const LegalHoldBanner: React.FC<LegalHoldBannerProps> = ({
  reason = 'Active Legal Hold placed by Legal Counsel/DPO. Automated retention purging and deletion workflows are suspended.',
}) => {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3.5 text-amber-900 shadow-sm">
      <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
          GDPR Legal Hold Active (Statutory Suspension)
        </h4>
        <p className="text-xs text-amber-700 mt-0.5">{reason}</p>
      </div>
    </div>
  );
};
