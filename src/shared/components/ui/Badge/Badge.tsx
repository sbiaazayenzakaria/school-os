import React from 'react';
import { cn } from '@/shared/utils/cn';

export type BadgeVariant =
  'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand' | 'protected';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> =
  {
    success: {
      container: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    warning: {
      container: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    },
    danger: {
      container: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
    },
    info: {
      container: 'bg-sky-50 text-sky-700 border-sky-200',
      dot: 'bg-sky-500',
    },
    neutral: {
      container: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
    },
    brand: {
      container: 'bg-brand-50 text-brand-700 border-brand-200',
      dot: 'bg-brand-500',
    },
    protected: {
      container: 'bg-violet-50 text-violet-700 border-violet-200',
      dot: 'bg-violet-500',
    },
  };

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  className,
  children,
  ...props
}) => {
  const currentVariant = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border leading-none transition-colors select-none',
        currentVariant.container,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full shrink-0',
            currentVariant.dot
          )}
          aria-hidden="true"
        />
      )}
      {icon && (
        <span
          className="inline-flex shrink-0 h-3.5 w-3.5 items-center justify-center"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};

Badge.displayName = 'Badge';
