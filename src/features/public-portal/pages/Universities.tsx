import { ArrowRight, Handshake, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

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
    logo: '/DAVV_Logo.png',
  },
  {
    slug: 'rgpv',
    name: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
    shortName: 'RGPV',
    city: 'Bhopal',
    live: false,
    logo: '/RGPV_LOGO.png',
  },
  {
    slug: 'bu',
    name: 'Barkatullah University',
    shortName: 'BU',
    city: 'Bhopal',
    live: false,
    logo: '/BU_LOGO.png',
  },
];

export default function Universities() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'Select University — OCTAGON';
    window.scrollTo(0, 0);
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
    <main className="relative overflow-hidden bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-blue-50 pt-24 md:pt-32 pb-8 md:pb-12 overflow-hidden border-b border-border">
        {/* Geometric Pattern SVG */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none text-navy">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="octagons-universities"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#octagons-universities)"
            />
          </svg>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 grid md:grid-cols-12 gap-8 items-center">
          {/* Left Column - Content */}
          <div className="md:col-span-7 text-left space-y-4 flex flex-col justify-start">
            {/* Breadcrumb & Handshake Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <nav className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted">
                <span>Home</span>
                <span className="mx-3 opacity-50">/</span>
                <span className="text-navy">Universities</span>
              </nav>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:inline" />
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-light/50 border border-blue/10 rounded-md text-blue font-bold text-[9px] uppercase tracking-wider">
                <Handshake className="w-3 h-3" />
                Trusted Partnerships
              </div>
            </div>

            <h1 className="font-display text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-black text-navy leading-tight">
              Our Partner Universities
            </h1>

            <p className="text-muted text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
              Empowering leading institutions across India with intelligent
              governance and automation.
            </p>

            {/* Search bar inside Hero */}
            <div className="max-w-md flex items-center gap-2 bg-white border border-border rounded-2xl p-1.5 shadow-sm focus-within:border-blue/50 focus-within:shadow-md transition-all">
              <Search className="w-5 h-5 text-muted ml-2 shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
                placeholder="Search universities by name or city..."
                className="flex-1 bg-transparent outline-none text-navy text-sm md:text-base px-1 py-1.5"
              />
            </div>
          </div>

          {/* Right Column - Illustration Image with Handshake Overlay */}
          <div className="md:col-span-5 hidden md:block relative h-48 lg:h-56 rounded-3xl border border-border bg-slate-100 shadow-md">
            {/* Floating Handshake Icon (Half outside bottom-left boundary) */}
            <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-white text-blue flex items-center justify-center shadow-lg border-2 border-slate-200 z-20">
              <Handshake className="w-8 h-8" />
            </div>

            <img
              src="/UniversitySection.png"
              alt="Partner Universities"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Featured University - DAVV */}
        {filtered.some(u => u.slug === 'davv') && (
          <div className="mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue mb-4">
              Featured Institution
            </h2>
            <div
              onClick={() => {
                const davv = UNIVERSITIES.find(u => u.slug === 'davv');
                if (davv) open(davv);
              }}
              className="group relative bg-white border border-border/80 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue/40 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col md:flex-row gap-0"
            >
              {/* Background gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-r from-blue-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

              {/* Left Column: Campus Image with Divider and Logo Overlay */}
              <div className="w-full md:w-80 lg:w-[380px] shrink-0 self-stretch relative min-h-[220px] md:min-h-full overflow-hidden flex items-center justify-center z-10 border-b md:border-b-0 md:border-r border-border/80">
                <img
                  src="/DAVV_Uni.jpg"
                  alt="Devi Ahilya Vishwavidyalaya Campus Gate"
                  className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700 z-0"
                />

                {/* DAVV logo overlay (even larger size) */}
                <div className="relative z-20 w-32 h-32 md:w-44 md:h-44 bg-white/50 backdrop-blur-[1px] rounded-2xl p-4.5 flex items-center justify-center border border-white/40 shadow-xl group-hover:scale-105 transition-all duration-300">
                  <img
                    src="/DAVV_Logo.png"
                    alt="DAVV logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Right Column: Content Area */}
              <div className="flex-1 p-6 md:p-10 space-y-4 text-center md:text-left z-20">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md border border-emerald-500/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live & NEP Compliant
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-light/50 text-blue px-2.5 py-1 rounded-md">
                    Indore, MP
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                    ESTD 1964
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-black text-navy text-2xl md:text-3xl leading-tight group-hover:text-blue transition-colors">
                    Devi Ahilya Vishwavidyalaya (DAVV)
                  </h3>
                  <p className="text-muted text-sm md:text-base mt-2 max-w-2xl mx-auto md:mx-0">
                    Experience our premier state university with a fully digital
                    unified campus management system (CMS) powering admissions,
                    examinations, finance, and student administration.
                  </p>
                </div>

                {/* Multicolor small stat cards */}
                <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                  <div className="bg-indigo-50/80 border border-indigo-100 text-indigo-700 rounded-xl px-4 py-2 text-xs flex items-center gap-2 font-bold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    250+ Affiliated Colleges
                  </div>
                  <div className="bg-emerald-50/80 border border-emerald-100 text-emerald-700 rounded-xl px-4 py-2 text-xs flex items-center gap-2 font-bold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    NEP 2020 Framework
                  </div>
                  <div className="bg-amber-50/80 border border-amber-100 text-amber-700 rounded-xl px-4 py-2 text-xs flex items-center gap-2 font-bold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    DigiLocker Integrated
                  </div>
                </div>

                {/* Explore Portal Button for Mobile */}
                <div className="pt-2 md:hidden">
                  <Button
                    href="/davv"
                    size="sm"
                    variant="primary"
                    className="shadow-sm group-hover:shadow-glow transition-all"
                  >
                    Explore Portal
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Right Side Explore Portal Button for Desktop */}
              <div className="shrink-0 hidden md:flex items-center justify-center pr-8 pl-2 z-20">
                <Button
                  href="/davv"
                  size="md"
                  variant="primary"
                  className="shadow-sm group-hover:shadow-glow transition-all whitespace-nowrap"
                >
                  Explore Portal
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Other Universities Section */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted mb-4">
            More Partner Universities
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filtered
              .filter(u => u.slug !== 'davv')
              .map(u => {
                const info =
                  u.slug === 'rgpv'
                    ? {
                        estd: 'ESTD 1998',
                        desc: "Madhya Pradesh's premier state technological university, affiliating hundreds of engineering, pharmacy, and technology colleges.",
                        tags: ['Technical Education', '200+ Colleges'],
                      }
                    : {
                        estd: 'ESTD 1970',
                        desc: 'A leading state university offering multi-disciplinary courses in arts, sciences, commerce, and social sciences to over 100,000 students.',
                        tags: ['Multi-Disciplinary', '100k+ Students'],
                      };

                return (
                  <div
                    key={u.slug}
                    className="group relative bg-white border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row gap-6 items-start cursor-not-allowed"
                  >
                    {/* Top Right "Soon" badge */}
                    <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200/50">
                      Soon
                    </span>

                    <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-2xl p-2.5 flex items-center justify-center border border-border/50 group-hover:scale-105 transition-transform duration-300">
                      {u.logo ? (
                        <img
                          src={u.logo}
                          alt={`${u.shortName} logo`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="grid place-items-center w-full h-full rounded-xl bg-navy text-white font-display font-bold text-sm">
                          {u.shortName}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                          {info.estd}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-blue-light/30 text-blue px-2 py-0.5 rounded-md">
                          {u.city}, MP
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest bg-amber-50/50 text-amber-600 px-2 py-0.5 rounded-md border border-amber-500/10">
                          <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                          Onboarding
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display font-black text-navy text-lg md:text-xl leading-tight">
                          {u.name} ({u.shortName})
                        </h3>
                        <p className="text-muted text-xs md:text-sm mt-1.5 leading-relaxed">
                          {info.desc}
                        </p>
                      </div>

                      <div className="pt-1 flex flex-wrap gap-2">
                        {info.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[9px] font-bold bg-slate-50 text-slate-500 border border-slate-100 px-2.5 py-1 rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted mt-10">
            No universities match “{query}”.
          </p>
        )}
      </div>
    </main>
  );
}
