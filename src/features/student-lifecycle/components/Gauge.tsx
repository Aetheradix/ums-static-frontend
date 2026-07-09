import type { ReactNode } from 'react';

const STROKE = {
  success: 'stroke-emerald-600',
  warning: 'stroke-amber-500',
  danger: 'stroke-red-500',
  info: 'stroke-blue-600',
  neutral: 'stroke-slate-300',
  gold: 'stroke-amber-400',
};

interface GaugeProps {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: keyof typeof STROKE;
  label?: ReactNode;
  sublabel?: ReactNode;
  className?: string;
}

export function Gauge({
  value,
  max = 100,
  size = 104,
  thickness = 9,
  tone = 'info',
  label,
  sublabel,
  className = '',
}: GaugeProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className={`relative inline-grid place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          className="stroke-slate-100 dark:stroke-slate-800"
          strokeWidth={thickness}
        />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          className={STROKE[tone]}
          strokeWidth={thickness}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        {label && (
          <div className="font-heading text-lg leading-none font-bold text-slate-800 dark:text-slate-200">
            {label}
          </div>
        )}
        {sublabel && (
          <div className="mt-1 text-[10px] tracking-wide text-slate-400 uppercase">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}
