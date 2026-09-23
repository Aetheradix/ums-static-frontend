import type { ReactNode } from 'react';

interface EmptyStateProps {
  /** PrimeReact icon suffix, e.g. "inbox", "file", "search". */
  icon?: string;
  title: string;
  message?: string;
  /** Optional action (e.g. a "Create" button). */
  action?: ReactNode;
  className?: string;
}

/**
 * Consistent empty-state block for raw tables / lists in the civil module that
 * don't get GridPanel's built-in empty rendering. Icon + title + optional
 * message and action.
 */
export default function EmptyState({
  icon = 'inbox',
  title,
  message,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`.trim()}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 text-gray-400 mb-3">
        <i className={`pi pi-${icon} text-2xl`} />
      </div>
      <h4 className="text-sm font-bold text-gray-800">{title}</h4>
      {message && (
        <p className="text-xs text-gray-500 mt-1 max-w-sm">{message}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
