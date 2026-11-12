import React, { forwardRef, useId } from 'react';
import { cn } from '@/shared/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leadingIcon,
      trailingIcon,
      id: customId,
      disabled,
      required,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const describedBy =
      [error ? errorId : null, helperText ? helperId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            {label}
            {required && (
              <span className="ml-1 text-rose-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative rounded-md shadow-sm">
          {leadingIcon && (
            <div
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
              aria-hidden="true"
            >
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            className={cn(
              'block w-full rounded-md border text-sm transition-colors',
              'placeholder:text-slate-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
              leadingIcon ? 'pl-9' : 'pl-3',
              trailingIcon ? 'pr-9' : 'pr-3',
              'py-2',
              error
                ? 'border-rose-300 text-rose-900 focus-visible:border-rose-500 focus-visible:ring-rose-500'
                : 'border-slate-300 text-slate-900 focus-visible:border-brand-500 focus-visible:ring-brand-500',
              className
            )}
            {...props}
          />

          {trailingIcon && (
            <div
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400"
              aria-hidden="true"
            >
              {trailingIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="mt-1 text-xs text-rose-600 font-medium"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="mt-1 text-xs text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
