import { useState } from 'react';
import { clsx } from 'clsx';
import { NOTICES, NOTICE_CATEGORIES } from '../constants/davvData';
import type { Notice } from '../constants/davvData';

const CATEGORY_STYLE: Record<string, string> = {
  Exams: 'bg-davv-light text-davv',
  Results: 'bg-emerald-50 text-emerald-600',
  Admissions: 'bg-violet-50 text-violet-600',
  Scholarships: 'bg-davv-saffron-light text-davv-saffron',
  Tenders: 'bg-slate-100 text-slate-600',
  Recruitment: 'bg-rose-50 text-rose-600',
  General: 'bg-slate-100 text-slate-600',
};

export default function NoticeBoard() {
  const [active, setActive] = useState<string>('All');
  const filtered =
    active === 'All'
      ? NOTICES
      : NOTICES.filter((n: Notice) => n.category === active);

  return (
    <div className="bg-white border border-border/60 rounded-2xl p-5">
      <div className="flex flex-wrap gap-1.5 mb-4">
        {NOTICE_CATEGORIES.map((cat: string) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={clsx(
              'text-[11.5px] font-semibold px-2.5 py-1 rounded-full transition-colors',
              active === cat
                ? 'bg-davv text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {cat}
          </button>
        ))}
      </div>
      <ul className="divide-y divide-border/50">
        {filtered.map((n: Notice) => (
          <li key={n.id} className="py-3 flex items-start gap-3">
            <span
              className={clsx(
                'text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md shrink-0 mt-0.5',
                CATEGORY_STYLE[n.category]
              )}
            >
              {n.category}
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] text-navy leading-snug">{n.title}</p>
              <p className="text-[11.5px] text-muted mt-0.5">
                {n.date} · {n.audience}
              </p>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-6 text-center text-muted text-sm">
            No notices in this category.
          </li>
        )}
      </ul>
    </div>
  );
}
