import { ArrowUpRight } from 'lucide-react';
import type { DavvService } from '../constants/davvData';

export default function ServiceTile({ service }: { service: DavvService }) {
  const Icon = service.icon;
  return (
    <button className="group text-left bg-white border border-border/60 rounded-2xl p-4 hover:border-davv/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-3">
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-davv-light text-davv shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-display font-bold text-navy text-[14px] leading-tight">
          {service.label}
          {service.external && (
            <ArrowUpRight className="w-3 h-3 text-muted shrink-0" />
          )}
        </span>
        <span className="block text-muted text-[12px] mt-0.5 leading-snug">
          {service.description}
        </span>
      </span>
    </button>
  );
}
