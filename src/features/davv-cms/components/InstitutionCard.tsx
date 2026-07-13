import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import type { Institution } from '../constants/davvData';
import { INSTITUTION_TYPE_LABEL, campusOf } from '../constants/davvData';
import { davvUrls } from '../constants/davvUrls';

const TYPE_BADGE: Record<string, string> = {
  utd: 'bg-davv-light text-davv',
  constituent: 'bg-davv-saffron-light text-davv-saffron',
  affiliated: 'bg-slate-100 text-slate-600',
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
      className="group text-left bg-white border border-border/60 rounded-2xl p-5 hover:border-davv/40 hover:shadow-lg transition-all duration-300 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <span className="grid place-items-center w-12 h-12 rounded-xl bg-davv text-white font-display font-bold text-xs">
          {institution.shortName}
        </span>
        <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-davv transition-colors" />
      </div>
      <div>
        <h3 className="font-display font-bold text-navy text-[15px] leading-snug">
          {institution.name}
        </h3>
        {institution.faculty && (
          <p className="text-muted text-[12.5px] mt-0.5">
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
          <span className="text-[11.5px] text-muted">{campus.name}</span>
        )}
      </div>
    </button>
  );
}
