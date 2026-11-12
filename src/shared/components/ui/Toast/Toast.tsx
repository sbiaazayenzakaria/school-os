import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const toastStyles: Record<
  ToastType,
  {
    container: string;
    iconColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  success: {
    container: 'border-emerald-200 bg-white text-slate-900',
    iconColor: 'text-emerald-600',
    icon: CheckCircle2,
  },
  error: {
    container: 'border-rose-200 bg-white text-slate-900',
    iconColor: 'text-rose-600',
    icon: AlertCircle,
  },
  warning: {
    container: 'border-amber-200 bg-white text-slate-900',
    iconColor: 'text-amber-600',
    icon: AlertTriangle,
  },
  info: {
    container: 'border-sky-200 bg-white text-slate-900',
    iconColor: 'text-sky-600',
    icon: Info,
  },
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, type, title, message } = toast;
  const config = toastStyles[type];
  const Icon = config.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg transition-all',
        'animate-in slide-in-from-bottom-5 fade-in duration-200',
        config.container
      )}
    >
      <Icon
        className={cn('h-5 w-5 shrink-0 mt-0.5', config.iconColor)}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        <h5 className="text-sm font-semibold text-slate-900">{title}</h5>
        {message && (
          <p className="mt-1 text-xs text-slate-500 leading-normal">
            {message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

Toast.displayName = 'Toast';
