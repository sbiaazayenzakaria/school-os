import { createContext } from 'react';
import { ToastType } from './Toast';

export interface ToastOptions {
  message?: string;
  duration?: number;
}

export interface ToastContextValue {
  showToast: (type: ToastType, title: string, options?: ToastOptions) => void;
  success: (title: string, options?: ToastOptions) => void;
  error: (title: string, options?: ToastOptions) => void;
  warning: (title: string, options?: ToastOptions) => void;
  info: (title: string, options?: ToastOptions) => void;
  dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
