import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import type { Institution } from '../constants/davvData';
import { INSTITUTION_TYPE_LABEL, campusOf } from '../constants/davvData';
import { davvUrls } from '../constants/davvUrls';

const TYPE_BADGE: Record<string, string> = {
  utd: 'bg-davv-light dark:bg-davv-darkest/50 text-davv dark:text-emerald-400',
  constituent:
    'bg-davv-saffron-light dark:bg-amber-950/40 text-davv-saffron dark:text-orange-400',
  affiliated:
    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
};

export default function InstitutionCard({
  institution,
}: {
  institution: Institution;
}) {
  const navigate = useNavigate();
  const campus = campusOf(institution.campusSlug);

  return (
    <button
      onClick={() =>
        navigate(davvUrls.institution(institution.type, institution.slug))
      }
      className="group text-left bg-white dark:bg-slate-900 border border-border/60 dark:border-slate-800 rounded-2xl p-5 hover:border-davv/40 hover:shadow-lg dark:hover:shadow-slate-950 transition-all duration-300 flex flex-col gap-3 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <span className="grid place-items-center w-12 h-12 rounded-xl bg-davv text-white font-display font-bold text-xs shadow-sm">
          {institution.shortName}
        </span>
        <ArrowUpRight className="w-4 h-4 text-muted dark:text-slate-500 group-hover:text-davv dark:group-hover:text-emerald-400 transition-colors" />
      </div>
      <div>
        <h3 className="font-display font-bold text-navy dark:text-slate-100 text-[15px] leading-snug group-hover:text-davv dark:group-hover:text-emerald-400 transition-colors">
          {institution.name}
        </h3>
        {institution.faculty && (
          <p className="text-muted dark:text-slate-400 text-[12.5px] mt-0.5">
            {institution.faculty}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 mt-auto pt-1">
        <span
          className={clsx(
            'text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md',
            TYPE_BADGE[institution.type]
          )}
        >
          {INSTITUTION_TYPE_LABEL[institution.type]}
        </span>
        {campus && (
          <span className="text-[11.5px] text-muted dark:text-slate-450">
            {campus.name}
          </span>
        )}
      </div>
    </button>
  );
}
