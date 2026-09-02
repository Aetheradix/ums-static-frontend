import type { ReactNode } from 'react';

type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const NOTE_TONES: Record<Tone, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200',
  success:
    'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200',
  warning:
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
  danger:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200',
  neutral:
    'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200',
};

const NOTE_ICONS: Record<Tone, string> = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  danger: 'error',
  neutral: 'lightbulb',
};

/** A tinted strip that explains what a screen expects, or flags a condition. */
export function SectionNote({
  tone = 'info',
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${NOTE_TONES[tone]}`}
    >
      <span className="material-symbols-outlined mt-0.5 shrink-0 text-[20px]">
        {NOTE_ICONS[tone]}
      </span>
      <div className="min-w-0">
        {title && <p className="font-bold">{title}</p>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/** Label-over-value block used for credentials, room details and summaries. */
export function KeyValueTile({
  label,
  value,
  mono = false,
  tone = 'neutral',
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  tone?: Tone;
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${NOTE_TONES[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className={`mt-1 text-base font-bold ${mono ? 'font-mono' : ''}`}>
        {value === '' || value === null || value === undefined ? '—' : value}
      </p>
    </div>
  );
}

/** Facility pill with its Material Symbols glyph. */
export function FacilityChip({ icon, name }: { icon: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
      <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-blue-300">
        {icon}
      </span>
      {name}
    </span>
  );
}

/**
 * Horizontal capacity bar — beds allotted against beds configured.
 * The width is genuinely dynamic, so it stays an inline style.
 */
export function OccupancyBar({
  allotted,
  total,
}: {
  allotted: number;
  total: number;
}) {
  const pct =
    total > 0 ? Math.min(Math.round((allotted / total) * 100), 100) : 0;
  const tone =
    pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div className="flex min-w-[140px] flex-col gap-1">
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
        <span>
          {allotted} / {total} beds
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-500 ${tone}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Empty-state block for grids and panels that have nothing to show yet. */
export function EmptyState({
  icon = 'inbox',
  title,
  hint,
}: {
  icon?: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <span className="material-symbols-outlined text-[40px] text-slate-300 dark:text-slate-600">
        {icon}
      </span>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
        {title}
      </p>
      {hint && (
        <p className="max-w-md text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}
