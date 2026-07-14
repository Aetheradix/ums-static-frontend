import { useState } from 'react';
import { clsx } from 'clsx';
import { NOTICES, NOTICE_CATEGORIES } from '../constants/davvData';
import type { Notice } from '../constants/davvData';

const CATEGORY_STYLE: Record<string, string> = {
  Exams:
    'bg-davv-light dark:bg-davv-darkest/50 text-davv dark:text-emerald-450',
  Results:
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  Admissions:
    'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
  Scholarships:
    'bg-davv-saffron-light dark:bg-amber-950/40 text-davv-saffron dark:text-orange-400',
  Tenders: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  Recruitment:
    'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450',
  General: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
};

export default function NoticeBoard() {
  const [active, setActive] = useState<string>('All');
  const filtered =
    active === 'All'
      ? NOTICES
      : NOTICES.filter((n: Notice) => n.category === active);

  return (
    <div className="bg-white dark:bg-slate-900 border border-border/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-wrap gap-1.5 mb-4">
        {NOTICE_CATEGORIES.map((cat: string) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={clsx(
              'text-[11.5px] font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer',
              active === cat
                ? 'bg-davv text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {cat}
          </button>
        ))}
      </div>
      <ul className="divide-y divide-border/50 dark:divide-slate-800">
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
              <p className="text-[13.5px] text-navy dark:text-slate-200 leading-snug">
                {n.title}
              </p>
              <p className="text-[11.5px] text-muted dark:text-slate-400 mt-0.5">
                {n.date} · {n.audience}
              </p>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-6 text-center text-muted dark:text-slate-500 text-sm font-medium">
            No notices in this category.
          </li>
        )}
      </ul>
    </div>
  );
}
