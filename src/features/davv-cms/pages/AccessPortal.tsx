import { clsx } from 'clsx';
import {
  ArrowUpRight,
  Building,
  CheckCircle2,
  Compass,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  Campus,
  Institution,
  InstitutionType,
} from '../constants/davvData';
import { CAMPUSES, DAVV, INSTITUTIONS } from '../constants/davvData';
import { davvUrls } from '../constants/davvUrls';
import CMSLayout from '../layouts/CMSLayout';

type TypeFilter = 'all' | InstitutionType;

const TYPES: { key: TypeFilter; label: string }[] = [
  { key: 'all', label: 'All Portals' },
  { key: 'utd', label: 'University Departments (UTDs)' },
  { key: 'constituent', label: 'Constituent Centers' },
  { key: 'affiliated', label: 'Affiliated Colleges' },
];

export default function AccessPortal() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<TypeFilter>('all');
  const [campus, setCampus] = useState<string>('all');

  useEffect(() => {
    document.title = `Centralized Access Portal | ${DAVV.shortName}`;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INSTITUTIONS.filter((i: Institution) => {
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

  const campusOf = (slug?: string) => {
    if (!slug) return null;
    return CAMPUSES.find((c: Campus) => c.slug === slug);
  };

  const TYPE_LABEL: Record<string, string> = {
    utd: 'UTD Department',
    constituent: 'Constituent Center',
    affiliated: 'Affiliated College',
  };

  const TYPE_COLOR_SCHEME: Record<
    string,
    {
      bg: string;
      text: string;
      border: string;
      accent: string;
      hoverText: string;
      arrowHover: string;
    }
  > = {
    utd: {
      bg: 'bg-primary/5 dark:bg-white/5',
      text: 'text-primary dark:text-white group-hover:bg-primary group-hover:text-white group-hover:border-primary',
      border: 'border-primary/10 dark:border-white/10',
      accent:
        'hover:border-primary dark:hover:border-primary hover:-translate-y-0.5',
      hoverText: 'group-hover:text-primary dark:group-hover:text-white',
      arrowHover:
        'group-hover:bg-primary group-hover:text-white group-hover:border-primary',
    },
    constituent: {
      bg: 'bg-primary/10 dark:bg-white/10',
      text: 'text-primary dark:text-white group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30',
      border: 'border-primary/20 dark:border-white/20',
      accent:
        'hover:border-primary/60 dark:hover:border-primary/80 hover:-translate-y-0.5',
      hoverText: 'group-hover:text-primary dark:group-hover:text-white',
      arrowHover:
        'group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30',
    },
    affiliated: {
      bg: 'bg-slate-50 dark:bg-slate-800',
      text: 'text-slate-550 dark:text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-800 group-hover:border-slate-350 dark:group-hover:bg-slate-750 dark:group-hover:text-white dark:group-hover:border-slate-650',
      border: 'border-slate-100 dark:border-slate-700',
      accent:
        'hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-0.5',
      hoverText: 'group-hover:text-slate-800 dark:group-hover:text-white',
      arrowHover:
        'group-hover:bg-slate-200 group-hover:text-slate-855 group-hover:border-slate-300',
    },
  };

  return (
    <CMSLayout>
      <style>{`
        .portal-hero-section {
          padding-top: 24px !important;
          padding-bottom: 20px !important;
        }
        @media (min-width: 768px) {
          .portal-hero-section {
            padding-top: 36px !important;
            padding-bottom: 36px !important;
          }
        }
      `}</style>

      {/* 1. Hero Section with Premium 2-Column Layout */}
      <section className="portal-hero-section relative overflow-hidden bg-primary text-white select-none">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(242,169,0,0.08)_0%,transparent_70%)] pointer-events-none z-0" />
        <div className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none z-0" />

        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[30px_30px] z-0" />

        {/* DAVV University image overlay — on the right, transparent from left side */}
        <img
          src="/DAVV_Uni.jpg"
          alt=""
          className="absolute top-0 right-0 h-full w-3/5 z-5 pointer-events-none object-cover object-right"
          style={{
            opacity: 0.25,
            maskImage: 'linear-gradient(to left, black 30%, transparent)',
            WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent)',
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 z-10">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Title, search and info */}
            <div className="lg:col-span-7 text-left space-y-4">
              {/* Top pill badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-semibold tracking-wider text-yellow-400 backdrop-blur-xs">
                <Compass className="w-3 h-3 text-yellow-400 animate-spin-slow" />
                <span>Devi Ahilya Vishwavidyalaya, Indore</span>
              </div>

              {/* Page title */}
              <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight uppercase">
                Centralized <br />
                <span className="text-[#F2A900]">Access Portal</span>
              </h1>

              {/* Description */}
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-xl">
                A single secure point of entry to sign in to your UTD department
                portal, administrative campus, or affiliated college dashboard.
              </p>

              {/* Search Bar Container */}
              <div className="w-full max-w-xl bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-2xl transition-all duration-300 focus-within:border-primary/40">
                <div className="flex items-center gap-3 bg-white text-[#001833] rounded-xl px-3 py-2.5 shadow-inner">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search your UTD, college or center..."
                    className="w-full bg-transparent outline-none font-sans font-semibold text-xs sm:text-sm placeholder-slate-400 text-slate-800"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="text-xs font-bold text-slate-400 hover:text-primary cursor-pointer transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Statistics Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-2.5 py-1 shadow-2xs backdrop-blur-xs hover:bg-white/10 hover:border-yellow-400/20 transition-all duration-300">
                  <CheckCircle2 className="w-3 h-3 text-yellow-400 mr-1.5 shrink-0" />
                  <span className="text-white text-[10px] font-black uppercase tracking-wider">
                    33 UTDs
                  </span>
                </div>
                <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-2.5 py-1 shadow-2xs backdrop-blur-xs hover:bg-white/10 hover:border-yellow-400/20 transition-all duration-300">
                  <CheckCircle2 className="w-3 h-3 text-yellow-400 mr-1.5 shrink-0" />
                  <span className="text-white text-[10px] font-black uppercase tracking-wider">
                    Constituent Centers
                  </span>
                </div>
                <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-2.5 py-1 shadow-2xs backdrop-blur-xs hover:bg-white/10 hover:border-yellow-400/20 transition-all duration-300">
                  <CheckCircle2 className="w-3 h-3 text-yellow-400 mr-1.5 shrink-0" />
                  <span className="text-white text-[10px] font-black uppercase tracking-wider">
                    290+ Affiliated Colleges
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Orbit Graphics */}
            <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
              <div className="relative w-52 h-52 flex items-center justify-center">
                {/* Outer orbital rings */}
                <div className="absolute inset-0 rounded-full border border-white/5 animate-pulse-slow" />
                <div className="absolute inset-6 rounded-full border border-yellow-400/10 animate-spin-slow" />
                <div className="absolute inset-12 rounded-full border border-blue/10" />

                {/* Central Glassmorphic Shield */}
                <div className="relative w-36 h-36 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center p-3">
                  <img
                    src="/DAVV_Logo.png"
                    alt="DAVV Logo"
                    className="w-20 h-20 object-contain"
                  />
                  <div className="mt-1 text-center">
                    <span className="block text-[9px] font-black tracking-widest text-yellow-400 uppercase">
                      Portal
                    </span>
                    <span className="block text-[7px] text-white/40 uppercase font-semibold">
                      SECURE ENTRY
                    </span>
                  </div>
                </div>

                {/* Satellite mini-badges */}
                <div className="absolute top-1 right-3 w-8 h-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center justify-center shadow-md animate-bounce">
                  <GraduationCap className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="absolute bottom-6 left-1 w-8 h-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-4 h-4 text-blue" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Directory & Filter Grid */}
      <section className="bg-slate-50 dark:bg-slate-950 min-h-[500px] pt-12 pb-24 select-none transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb & Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <nav className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>CMS Directory</span>
                <span>/</span>
                <span className="text-[#002147] dark:text-white">
                  Access Portal
                </span>
              </nav>
              <h2 className="font-display font-black text-xl sm:text-3xl text-[#002147] dark:text-white uppercase tracking-wide flex items-center gap-2">
                University Directory
              </h2>
            </div>
            <div className="text-xs font-black text-primary dark:text-white bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 uppercase tracking-wide">
              Showing {results.length} active node
              {results.length === 1 ? '' : 's'}
            </div>
          </div>

          {/* Filtering Toolbar — Single Row */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category selection */}
            <div className="flex flex-wrap items-center gap-1.5">
              {TYPES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={clsx(
                    'text-xs font-black px-3.5 py-2 rounded-xl border cursor-pointer transition-all duration-205',
                    type === t.key
                      ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-650 dark:text-slate-350 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 hover:text-primary dark:hover:text-white'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Divider line for desktop */}
            <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-800 self-stretch" />

            {/* Campus selection */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setCampus('all')}
                className={clsx(
                  'text-xs font-black px-3.5 py-2 rounded-xl border cursor-pointer transition-all duration-205',
                  campus === 'all'
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                )}
              >
                All Campuses
              </button>
              {CAMPUSES.filter((c: Campus) =>
                INSTITUTIONS.some((i: Institution) => i.campusSlug === c.slug)
              ).map((c: Campus) => (
                <button
                  key={c.slug}
                  onClick={() => setCampus(c.slug)}
                  className={clsx(
                    'text-xs font-black px-3.5 py-2 rounded-xl border cursor-pointer transition-all duration-205',
                    campus === c.slug
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                  )}
                >
                  {c.name.replace(' Parisar', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((i: Institution) => {
                const camp = campusOf(i.campusSlug);
                return (
                  <button
                    key={`${i.type}-${i.slug}`}
                    onClick={() =>
                      navigate(davvUrls.institution(i.type, i.slug))
                    }
                    className={clsx(
                      'group relative text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-[220px] cursor-pointer shadow-3xs overflow-hidden',
                      TYPE_COLOR_SCHEME[i.type].accent
                    )}
                  >
                    {/* Watermark logo background */}
                    <div className="absolute -bottom-6 -right-6 w-28 h-28 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-500 pointer-events-none select-none z-0">
                      <img
                        src="/DAVV_Logo.png"
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-4 w-full relative z-10">
                      {/* Top Row abbreviation box + circular button */}
                      <div className="flex items-start justify-between w-full">
                        <span
                          className={clsx(
                            'grid place-items-center px-3.5 py-1.5 rounded-lg font-display font-black text-xs sm:text-sm tracking-wide shadow-2xs border',
                            TYPE_COLOR_SCHEME[i.type].bg,
                            TYPE_COLOR_SCHEME[i.type].text,
                            TYPE_COLOR_SCHEME[i.type].border
                          )}
                        >
                          {i.shortName}
                        </span>
                        <div
                          className={clsx(
                            'w-8 h-8 rounded-full flex items-center justify-center border shadow-3xs transition-all duration-300 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-750 bg-slate-50 dark:bg-slate-800',
                            TYPE_COLOR_SCHEME[i.type].arrowHover
                          )}
                        >
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>

                      {/* Info details */}
                      <div>
                        <h3
                          className={clsx(
                            'font-display font-black text-slate-800 dark:text-white text-[15px] sm:text-[16px] leading-snug transition-colors duration-200',
                            TYPE_COLOR_SCHEME[i.type].hoverText
                          )}
                        >
                          {i.name}
                        </h3>
                        {i.faculty && (
                          <p className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs mt-2 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <span>{i.faculty}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] w-full relative z-10">
                      <span
                        className={clsx(
                          'text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border',
                          TYPE_COLOR_SCHEME[i.type].bg,
                          TYPE_COLOR_SCHEME[i.type].text,
                          TYPE_COLOR_SCHEME[i.type].border
                        )}
                      >
                        {TYPE_LABEL[i.type]}
                      </span>
                      {camp && (
                        <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>{camp.name.replace(' Parisar', '')}</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-3xs">
              <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-display font-black text-[#002147] dark:text-white text-xl uppercase tracking-wide mb-1">
                No matching departments found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto px-4">
                We couldn't find any institutions matching "{query}" on the
                selected campus. Try adjusting your search query or switching
                filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </CMSLayout>
  );
}
