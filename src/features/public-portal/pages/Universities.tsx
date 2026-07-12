import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { ArrowRight, Plus, Search } from 'lucide-react';

interface UniversityEntry {
  slug: string;
  name: string;
  shortName: string;
  city: string;
  live: boolean;
  logo?: string;
}

// The Octagon product portal's directory of onboarded universities. DAVV is live; the
// others are placeholders that demonstrate the multi-tenant model.
const UNIVERSITIES: UniversityEntry[] = [
  {
    slug: 'davv',
    name: 'Devi Ahilya Vishwavidyalaya',
    shortName: 'DAVV',
    city: 'Indore',
    live: true,
    logo: '/images/davv-logo.png',
  },
  {
    slug: 'rgpv',
    name: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
    shortName: 'RGPV',
    city: 'Bhopal',
    live: false,
  },
  {
    slug: 'bu',
    name: 'Barkatullah University',
    shortName: 'BU',
    city: 'Bhopal',
    live: false,
  },
];

export default function Universities() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'Select University — OCTAGON';
  }, []);

  const filtered = UNIVERSITIES.filter(u =>
    `${u.name} ${u.shortName} ${u.city}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  const open = (u: UniversityEntry) => {
    if (u.live) navigate(`/${u.slug}`);
  };

  return (
    <main className="relative overflow-hidden">
      {/* decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-light/40 via-white to-white pointer-events-none" />
      <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-blue/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-40 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative pt-28 md:pt-36 pb-24 min-h-screen">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          {/* hero */}
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="inline-block px-3 py-1 bg-blue-light text-blue text-[10px] font-black uppercase tracking-[0.2em] rounded-md mb-4 border border-blue/10">
              University Login
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-navy leading-tight mb-4">
              Select your university
            </h1>
            <p className="text-muted text-sm md:text-lg">
              Choose your university to enter its portal. More universities
              onboard onto Octagon over time.
            </p>
          </div>

          {/* search */}
          <div className="max-w-xl mx-auto flex items-center gap-2 bg-white border border-border rounded-2xl p-2 shadow-sm mb-10 focus-within:border-blue/50 transition-colors">
            <Search className="w-5 h-5 text-muted ml-2 shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
              placeholder="Search universities…"
              className="flex-1 bg-transparent outline-none text-navy text-sm md:text-base px-1 py-2"
            />
          </div>

          {/* cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(u => (
              <button
                key={u.slug}
                onClick={() => open(u)}
                disabled={!u.live}
                className={clsx(
                  'group relative text-left bg-white border rounded-2xl p-6 transition-all duration-300 flex flex-col gap-4 overflow-hidden',
                  u.live
                    ? 'border-border/60 hover:border-blue/40 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                    : 'border-border/40 opacity-70 cursor-not-allowed'
                )}
              >
                <div className="flex items-start justify-between">
                  {u.logo ? (
                    <img
                      src={u.logo}
                      alt={`${u.shortName} logo`}
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <span className="grid place-items-center w-16 h-16 rounded-2xl bg-navy text-white font-display font-bold">
                      {u.shortName}
                    </span>
                  )}
                  {u.live ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{' '}
                      Live
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                      Soon
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-display font-bold text-navy text-lg leading-tight">
                    {u.shortName}
                  </h3>
                  <p className="text-muted text-[13px] mt-1">{u.name}</p>
                  <p className="text-muted text-[12px] mt-0.5">{u.city}</p>
                </div>
                {u.live && (
                  <span className="inline-flex items-center gap-1.5 text-blue text-[13px] font-semibold">
                    Enter portal
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            ))}

            <div className="border border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center text-muted">
              <Plus className="w-6 h-6 mb-2" />
              <span className="text-[13px] font-semibold">
                Onboard a university
              </span>
              <span className="text-[12px]">
                Bring your institution onto Octagon
              </span>
            </div>
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted mt-10">
              No universities match “{query}”.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
