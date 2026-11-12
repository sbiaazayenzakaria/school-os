import React from 'react';
import { Badge, BadgeSize, BadgeVariant } from '../Badge';
import { GradingSystemType } from '@/shared/types';

interface GradeBadgeProps {
  score?: number;
  maxScore?: number;
  system: GradingSystemType;
  size?: BadgeSize;
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({
  score,
  maxScore = 20,
  system,
  size = 'md',
}) => {
  if (score === undefined || score === null) {
    return (
      <Badge variant="neutral" size={size}>
        N/A
      </Badge>
    );
  }

  if (system === 'FRENCH_SCALE') {
    // 0 - 20
    const val = score;
    let variant: BadgeVariant = 'danger';
    let label = `${val.toFixed(1)}/20`;

    if (val >= 16) {
      variant = 'success';
      label += ' (Très Bien)';
    } else if (val >= 14) {
      variant = 'info';
      label += ' (Bien)';
    } else if (val >= 10) {
      variant = 'warning';
      label += ' (Passable)';
    } else {
      variant = 'danger';
      label += ' (Ajourné)';
    }

    return (
      <Badge variant={variant} size={size} dot>
        {label}
      </Badge>
    );
  }

  if (system === 'GERMAN_SCALE') {
    // 1.0 (best) to 6.0 (failing), <= 4.0 passing
    const val = score;
    let variant: BadgeVariant = 'danger';
    if (val <= 1.5) variant = 'success';
    else if (val <= 2.5) variant = 'info';
    else if (val <= 4.0) variant = 'warning';
    else variant = 'danger';

    return (
      <Badge variant={variant} size={size} dot>
        Note: {val.toFixed(1)}
      </Badge>
    );
  }

  // Percentage or general scale
  const pct = maxScore > 0 ? (score / maxScore) * 100 : score;
  let variant: BadgeVariant = 'danger';
  if (pct >= 75) variant = 'success';
  else if (pct >= 50) variant = 'warning';
  else variant = 'danger';

  return (
    <Badge variant={variant} size={size} dot>
      {score}/{maxScore} ({pct.toFixed(0)}%)
    </Badge>
  );
};
