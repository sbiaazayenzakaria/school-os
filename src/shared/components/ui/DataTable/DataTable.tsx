import React from 'react';
import { AlertCircle, Inbox } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Skeleton } from '../Skeleton';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  isLoading?: boolean;
  loadingRowCount?: number;
  emptyState?: {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
  };
  error?: string | null;
  className?: string;
  onRowClick?: (item: T) => void;
  caption?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  loadingRowCount = 4,
  emptyState,
  error,
  className,
  onRowClick,
  caption,
}: DataTableProps<T>) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    'px-4 py-3.5 select-none',
                    col.align ? alignClass[col.align] : 'text-left',
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {/* Error State */}
            {error && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center">
                  <div className="mx-auto flex flex-col items-center max-w-sm">
                    <div className="rounded-full bg-rose-50 p-2 text-rose-600 mb-2">
                      <AlertCircle className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-semibold text-rose-900">
                      Failed to load table records
                    </p>
                    <p className="mt-1 text-xs text-rose-700">{error}</p>
                  </div>
                </td>
              </tr>
            )}

            {/* Loading State */}
            {!error &&
              isLoading &&
              Array.from({ length: loadingRowCount }).map((_, rIdx) => (
                <tr key={`loading-row-${rIdx}`} className="animate-pulse">
                  {columns.map(col => (
                    <td key={`loading-col-${col.key}`} className="px-4 py-3.5">
                      <Skeleton className="h-4 w-full max-w-[80%]" />
                    </td>
                  ))}
                </tr>
              ))}

            {/* Empty State */}
            {!error && !isLoading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="mx-auto flex flex-col items-center max-w-sm">
                    <div className="rounded-full bg-slate-100 p-3 text-slate-400 mb-3">
                      {emptyState?.icon || (
                        <Inbox className="h-6 w-6" aria-hidden="true" />
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {emptyState?.title || 'No records found'}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      {emptyState?.description ||
                        'There are no items to display at this time.'}
                    </p>
                    {emptyState?.action && (
                      <div className="mt-4">{emptyState.action}</div>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {/* Data Rows */}
            {!error &&
              !isLoading &&
              data.map((item, index) => {
                const rowKey = keyExtractor(item, index);
                const isClickable = !!onRowClick;

                return (
                  <tr
                    key={rowKey}
                    onClick={isClickable ? () => onRowClick(item) : undefined}
                    className={cn(
                      'transition-colors',
                      isClickable
                        ? 'cursor-pointer hover:bg-slate-50/80 active:bg-slate-100'
                        : 'hover:bg-slate-50/50'
                    )}
                  >
                    {columns.map(col => {
                      const value = (item as Record<string, unknown>)[col.key];

                      return (
                        <td
                          key={`${rowKey}-${col.key}`}
                          className={cn(
                            'px-4 py-3.5 text-slate-700 align-middle',
                            col.align ? alignClass[col.align] : 'text-left',
                            col.className
                          )}
                        >
                          {col.render
                            ? col.render(item, index)
                            : (value as React.ReactNode)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DataTable.displayName = 'DataTable';
