import { ArrowUpRight } from 'lucide-react';
import type { DavvService } from '../constants/davvData';

export default function ServiceTile({ service }: { service: DavvService }) {
  const Icon = service.icon;
  return (
    <button className="group text-left bg-white dark:bg-slate-900 border border-border/60 dark:border-slate-800 rounded-2xl p-4 hover:border-davv/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-3 cursor-pointer">
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-davv-light dark:bg-davv-darkest/50 text-davv dark:text-emerald-450 shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-display font-bold text-navy dark:text-slate-100 text-[14px] leading-tight group-hover:text-davv dark:group-hover:text-emerald-400 transition-colors">
          {service.label}
          {service.external && (
            <ArrowUpRight className="w-3 h-3 text-muted dark:text-slate-400 shrink-0" />
          )}
        </span>
        <span className="block text-muted dark:text-slate-450 text-[12px] mt-0.5 leading-snug">
          {service.description}
        </span>
      </span>
    </button>
  );
}
