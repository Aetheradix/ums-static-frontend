import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { clsx } from 'clsx';
import DavvLayout from '../layout/DavvLayout';
import SectionTitle from '../../public-portal/components/ui/SectionTitle';
import InstitutionCard from '../components/InstitutionCard';
import { INSTITUTIONS, CAMPUSES, DAVV } from '../data';
import type { InstitutionType } from '../data';

type TypeFilter = 'all' | InstitutionType;

const TYPES: { key: TypeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'utd', label: 'UTDs' },
  { key: 'constituent', label: 'Constituent' },
  { key: 'affiliated', label: 'Affiliated' },
];

function normalizeType(value: string | null): TypeFilter {
  return value === 'utd' || value === 'constituent' || value === 'affiliated'
    ? value
    : 'all';
}

export default function Directory() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [type, setType] = useState<TypeFilter>(
    normalizeType(params.get('type'))
  );
  const [campus, setCampus] = useState<string>(params.get('campus') ?? 'all');

  useEffect(() => {
    document.title = `Campuses & Institutions — ${DAVV.shortName}`;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INSTITUTIONS.filter(i => {
      if (type !== 'all' && i.type !== type) return false;
      if (campus !== 'all' && i.campusSlug !== campus) return false;
      if (
        q &&
        !`${i.name} ${i.shortName} ${i.faculty ?? ''}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [query, type, campus]);

  const updateType = (t: TypeFilter) => {
    setType(t);
    const next = new URLSearchParams(params);
    if (t === 'all') next.delete('type');
    else next.set('type', t);
    setParams(next, { replace: true });
  };

  const chip = (activeState: boolean) =>
    clsx(
      'text-[12.5px] font-semibold px-3 py-1.5 rounded-full transition-colors',
      activeState
        ? 'bg-davv text-white'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    );

  return (
    <DavvLayout>
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <nav className="text-xs text-muted mb-4">
          Octagon · DAVV ·{' '}
          <span className="text-navy font-semibold">Directory</span>
        </nav>
        <SectionTitle
          title="Campuses &amp; Institutions"
          subtitle="Search or browse by type and campus, then choose your institution to sign in."
        />

        {/* search */}
        <div className="flex items-center gap-2 bg-white border border-border rounded-2xl p-2 shadow-sm mb-5 max-w-2xl focus-within:border-davv/50 transition-colors">
          <Search className="w-5 h-5 text-muted ml-2 shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search institutions (e.g. “IET”, “Law”)…"
            className="flex-1 bg-transparent outline-none text-navy text-sm px-1 py-2"
            autoFocus
          />
        </div>

        {/* filters */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-8">
          <div className="flex flex-wrap items-center gap-1.5">
            {TYPES.map(t => (
              <button
                key={t.key}
                onClick={() => updateType(t.key)}
                className={chip(type === t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setCampus('all')}
              className={chip(campus === 'all')}
            >
              All campuses
            </button>
            {CAMPUSES.filter(c =>
              INSTITUTIONS.some(i => i.campusSlug === c.slug)
            ).map(c => (
              <button
                key={c.slug}
                onClick={() => setCampus(c.slug)}
                className={chip(campus === c.slug)}
              >
                {c.name.replace(' Parisar', '')}
              </button>
            ))}
          </div>
        </div>

        <p className="text-muted text-[13px] mb-4">
          {results.length} institution{results.length === 1 ? '' : 's'}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(i => (
            <InstitutionCard key={`${i.type}-${i.slug}`} institution={i} />
          ))}
        </div>
        {results.length === 0 && (
          <div className="text-center py-16 text-muted">
            No institutions match your search.
          </div>
        )}
      </section>
    </DavvLayout>
  );
}
