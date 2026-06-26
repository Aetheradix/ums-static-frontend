import clsx from 'clsx';
import React from 'react';

export interface AlertPanelProps {
  severity?: 'success' | 'info' | 'warn' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function AlertPanel({
  severity = 'info',
  title,
  children,
  className,
}: AlertPanelProps) {
  const styles = {
    success: {
      border: 'border-green-200 dark:border-green-900',
      iconBg: 'bg-green-100 dark:bg-green-900/40',
      iconText: 'text-green-600 dark:text-green-400',
      icon: 'check_circle',
      titleText: 'text-green-800 dark:text-green-300',
      bodyText: 'text-slate-700 dark:text-slate-300',
    },
    info: {
      border: 'border-blue-200 dark:border-blue-900',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconText: 'text-blue-600 dark:text-blue-400',
      icon: 'info',
      titleText: 'text-blue-800 dark:text-blue-300',
      bodyText: 'text-slate-700 dark:text-slate-300',
    },
    warn: {
      border: 'border-orange-200 dark:border-orange-900',
      iconBg: 'bg-orange-100 dark:bg-orange-900/40',
      iconText: 'text-orange-600 dark:text-orange-400',
      icon: 'warning',
      titleText: 'text-orange-800 dark:text-orange-300',
      bodyText: 'text-slate-700 dark:text-slate-300',
    },
    error: {
      border: 'border-red-200 dark:border-red-900',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconText: 'text-red-600 dark:text-red-400',
      icon: 'error',
      titleText: 'text-red-800 dark:text-red-300',
      bodyText: 'text-slate-700 dark:text-slate-300',
    },
  }[severity];

  return (
    <div
      className={clsx(
        'bg-white dark:bg-slate-900 shadow-sm rounded-xl p-4 flex items-start gap-4 border',
        styles.border,
        className
      )}
    >
      <div
        className={clsx(
          'p-2.5 rounded-lg flex items-center justify-center shrink-0',
          styles.iconBg
        )}
      >
        <span className={clsx('material-symbols-outlined', styles.iconText)}>
          {styles.icon}
        </span>
      </div>
      <div className="flex-1 mt-0.5">
        {title && (
          <h4
            className={clsx('font-semibold text-[15px] mb-1', styles.titleText)}
          >
            {title}
          </h4>
        )}
        <div className={clsx('text-[14px] leading-relaxed', styles.bodyText)}>
          {children}
        </div>
      </div>
    </div>
  );
}
