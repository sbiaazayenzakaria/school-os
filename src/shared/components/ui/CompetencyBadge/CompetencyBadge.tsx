import React from 'react';
import { Badge, BadgeSize } from '../Badge';
import { CompetencyLevel } from '@/shared/types';

interface CompetencyBadgeProps {
  level: CompetencyLevel;
  size?: BadgeSize;
}

const LEVEL_CONFIG: Record<
  CompetencyLevel,
  { label: string; variant: 'success' | 'info' | 'warning' | 'danger' }
> = {
  EXCEEDING: { label: 'Exceeding / Expert', variant: 'success' },
  SECURE: { label: 'Secure / Acquis', variant: 'info' },
  DEVELOPING: { label: 'Developing / En acquisition', variant: 'warning' },
  EMERGING: { label: 'Emerging / Non acquis', variant: 'danger' },
};

export const CompetencyBadge: React.FC<CompetencyBadgeProps> = ({
  level,
  size = 'md',
}) => {
  const config = LEVEL_CONFIG[level] || { label: level, variant: 'neutral' };
  return (
    <Badge variant={config.variant} size={size} dot>
      {config.label}
    </Badge>
  );
};
