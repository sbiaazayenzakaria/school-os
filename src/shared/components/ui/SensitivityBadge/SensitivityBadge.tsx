import React from 'react';
import { Lock } from 'lucide-react';
import { Badge, BadgeSize } from '../Badge';

interface SensitivityBadgeProps {
  type: 'SEN' | 'MEDICAL' | 'CUSTODY';
  size?: BadgeSize;
}

export const SensitivityBadge: React.FC<SensitivityBadgeProps> = ({
  type,
  size = 'sm',
}) => {
  const labels: Record<string, string> = {
    SEN: 'SEN Protected (Art. 9)',
    MEDICAL: 'Medical Alert (Protected)',
    CUSTODY: 'Custody Guard (Art. 8)',
  };

  return (
    <Badge variant="protected" size={size} icon={<Lock className="h-3 w-3" />}>
      {labels[type] || 'GDPR Restricted'}
    </Badge>
  );
};
