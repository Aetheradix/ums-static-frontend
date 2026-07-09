import { ProgressBar } from 'shared/new-components';

interface CreditMeterProps {
  earned: number;
  required: number;
  label?: string;
  tone?: 'success' | 'info' | 'warning' | 'danger';
}

export function CreditMeter({
  earned,
  required,
  label = 'Credits earned',
  tone,
}: CreditMeterProps) {
  const pct =
    required === 0 ? 0 : Math.min(100, Math.round((earned / required) * 100));

  const colorMap = {
    success: 'bg-emerald-600',
    info: 'bg-blue-600',
    warning: 'bg-amber-50 dark:bg-amber-950/400',
    danger: 'bg-red-50 dark:bg-red-950/400',
  };

  const resolvedTone =
    tone ?? (pct >= 66 ? 'success' : pct >= 33 ? 'info' : 'warning');
  const colorClass = colorMap[resolvedTone];

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-heading font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
          {earned}
          <span className="text-slate-400"> / {required}</span>
        </span>
      </div>
      <ProgressBar value={pct} colorClass={colorClass} />
    </div>
  );
}
