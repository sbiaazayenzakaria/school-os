import React, { useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Toast, ToastItem, ToastType } from './Toast';
import { ToastContext, ToastOptions } from './ToastContext';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, options?: ToastOptions) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const duration = options?.duration ?? 4000;

      const newToast: ToastItem = {
        id,
        type,
        title,
        message: options?.message,
        duration,
      };

      setToasts(prev => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const success = useCallback(
    (title: string, options?: ToastOptions) =>
      showToast('success', title, options),
    [showToast]
  );

  const error = useCallback(
    (title: string, options?: ToastOptions) =>
      showToast('error', title, options),
    [showToast]
  );

  const warning = useCallback(
    (title: string, options?: ToastOptions) =>
      showToast('warning', title, options),
    [showToast]
  );

  const info = useCallback(
    (title: string, options?: ToastOptions) =>
      showToast('info', title, options),
    [showToast]
  );

  const contextValue = useMemo(
    () => ({
      showToast,
      success,
      error,
      warning,
      info,
      dismissToast,
    }),
    [showToast, success, error, warning, info, dismissToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-live="polite"
            aria-atomic="false"
            className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-sm gap-2 pointer-events-none"
          >
            {toasts.map(toast => (
              <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';
