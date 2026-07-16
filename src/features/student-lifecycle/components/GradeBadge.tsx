import type { LetterGrade } from '../types';

export function gradeTone(
  grade: LetterGrade
): 'success' | 'info' | 'gold' | 'warning' | 'danger' {
  switch (grade) {
    case 'O':
    case 'A+':
      return 'success';
    case 'A':
    case 'B+':
      return 'info';
    case 'B':
    case 'C':
      return 'gold';
    case 'P':
      return 'warning';
    case 'F':
      return 'danger';
  }
}

const CHIP = {
  success:
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-200',
  danger: 'bg-red-50 dark:bg-red-950/40 text-red-700 border-red-200',
  info: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 border-blue-200',
  neutral:
    'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800',
  gold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

export function GradeBadge({ grade }: { grade: LetterGrade | null }) {
  const tone = grade === null ? 'neutral' : gradeTone(grade);
  return (
    <span
      className={`inline-grid h-6 w-[34px] place-items-center rounded-md border font-mono text-[11px] font-bold tabular-nums ${CHIP[tone]}`}
    >
      {grade ?? '—'}
    </span>
  );
}
