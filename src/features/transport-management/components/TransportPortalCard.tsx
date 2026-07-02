import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../shared/components/Icon/Icon';

interface TransportPortalCardProps {
  title: string;
  description: string;
  icon: string;
  path: string;
  badge?: string;
}

export default function TransportPortalCard({
  title,
  description,
  icon,
  path,
  badge,
}: TransportPortalCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-all duration-500 hover:shadow-[0_24px_50px_-16px_rgba(245,158,11,0.35)] hover:-translate-y-2 hover:border-amber-300/70 dark:hover:border-amber-600/50"
    >
      {/* Top amber accent stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-500 group-hover:h-2" />

      {/* Content */}
      <div className="p-7">
        {/* Icon + Badge row */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/25 group-hover:scale-110 group-hover:shadow-amber-500/40 transition-all duration-500">
            <Icon name={icon} className="text-3xl" />
          </div>
          {badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              {badge}
            </span>
          )}
        </div>

        {/* Text */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-6">
          {description}
        </p>

        {/* CTA row */}
        <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 text-sm font-semibold">
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
            Open Portal
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/30 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 ml-auto">
            <Icon name="arrow_forward" className="text-base" />
          </span>
        </div>
      </div>
    </div>
  );
}
