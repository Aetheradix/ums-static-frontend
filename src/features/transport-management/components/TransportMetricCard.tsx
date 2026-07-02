import { Icon } from '../../../shared/components/Icon/Icon';

interface TransportMetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  isLive?: boolean;
}

export default function TransportMetricCard({
  title,
  value,
  icon,
  isLive = false,
}: TransportMetricCardProps) {
  return (
    <div className="group relative overflow-hidden flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-amber-300/60 dark:hover:border-amber-600/40 transition-all duration-400">
      {/* Gradient blob on hover */}
      <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-amber-400/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Icon */}
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-500/20 dark:to-amber-600/10 group-hover:scale-105 transition-transform duration-400">
        <Icon
          name={icon}
          className="text-2xl text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">
            {value}
          </span>
          {isLive && (
            <span className="relative flex items-center gap-1">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-semibold text-green-600 dark:text-green-400 ml-2">
                LIVE
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
