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
  InstitutionType,
  Institution,
  Campus,
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

  const TYPE_BADGE_STYLE: Record<string, string> = {
    utd: 'bg-[#F2A900]/10 text-[#F2A900] border-[#F2A900]/20',
    constituent: 'bg-blue/10 text-blue border-blue/20',
    affiliated: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <CMSLayout>
      <style>{`
        .portal-hero-section {
          padding-top: 30px !important;
          padding-bottom: 30px !important;
        }
        @media (min-width: 768px) {
          .portal-hero-section {
            padding-top: 50px !important;
            padding-bottom: 55px !important;
          }
        }
      `}</style>

      {/* 1. Hero Section with Premium 2-Column Layout */}
      <section className="portal-hero-section relative overflow-hidden bg-[#001833] text-white select-none">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(242,169,0,0.08)_0%,transparent_70%)] pointer-events-none z-0" />
        <div className="absolute -bottom-20 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none z-0" />

        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[30px_30px] z-0" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Title, search and info */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Top pill badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold tracking-wider text-yellow-400 backdrop-blur-xs">
                <Compass className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" />
                <span>Devi Ahilya Vishwavidyalaya, Indore</span>
              </div>

              {/* Page title */}
              <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight uppercase">
                Centralized <br />
                <span className="text-[#F2A900]">Access Portal</span>
              </h1>

              {/* Description */}
              <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-xl">
                A single secure point of entry to sign in to your UTD department
                portal, administrative campus, or affiliated college dashboard.
              </p>

              {/* Search Bar Container */}
              <div className="w-full max-w-xl bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/15 shadow-2xl transition-all duration-300 focus-within:border-yellow-400/40">
                <div className="flex items-center gap-3 bg-white text-navy rounded-xl px-4 py-3 shadow-inner">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search your UTD, college or center..."
                    className="w-full bg-transparent outline-none font-sans font-semibold text-sm sm:text-base placeholder-slate-400 text-slate-800"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="text-xs font-bold text-slate-400 hover:text-navy cursor-pointer transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Statistics Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3">
                <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 shadow-2xs backdrop-blur-xs hover:bg-white/10 hover:border-yellow-400/20 transition-all duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 mr-2 shrink-0" />
                  <span className="text-white text-[11px] font-black uppercase tracking-wider">
                    33 UTDs
                  </span>
                </div>
                <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 shadow-2xs backdrop-blur-xs hover:bg-white/10 hover:border-yellow-400/20 transition-all duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 mr-2 shrink-0" />
                  <span className="text-white text-[11px] font-black uppercase tracking-wider">
                    Constituent Centers
                  </span>
                </div>
                <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 shadow-2xs backdrop-blur-xs hover:bg-white/10 hover:border-yellow-400/20 transition-all duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 mr-2 shrink-0" />
                  <span className="text-white text-[11px] font-black uppercase tracking-wider">
                    290+ Affiliated Colleges
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Orbit Graphics */}
            <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer orbital rings */}
                <div className="absolute inset-0 rounded-full border border-white/5 animate-pulse-slow" />
                <div className="absolute inset-8 rounded-full border border-yellow-400/10 animate-spin-slow" />
                <div className="absolute inset-16 rounded-full border border-blue/10" />

                {/* Central Glassmorphic Shield */}
                <div className="relative w-44 h-44 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center p-4">
                  <img
                    src="/DAVV_Logo.png"
                    alt="DAVV Logo"
                    className="w-24 h-24 object-contain"
                  />
                  <div className="mt-1 text-center">
                    <span className="block text-[10px] font-black tracking-widest text-yellow-400 uppercase">
                      Portal Node
                    </span>
                    <span className="block text-[8px] text-white/40 uppercase font-semibold">
                      SECURE ENTRY
                    </span>
                  </div>
                </div>

                {/* Satellite mini-badges */}
                <div className="absolute top-2 right-4 w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center justify-center shadow-md animate-bounce">
                  <GraduationCap className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="absolute bottom-8 left-2 w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5 text-blue" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Directory & Filter Grid */}
      <section className="bg-slate-50 min-h-[500px] pt-12 pb-24 select-none">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb & Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <nav className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>CMS Directory</span>
                <span>/</span>
                <span className="text-[#002147]">Access Portal</span>
              </nav>
              <h2 className="font-display font-black text-xl sm:text-3xl text-[#002147] uppercase tracking-wide flex items-center gap-2">
                University Directory Nodes
              </h2>
            </div>
            <div className="text-xs font-black text-[#002147] bg-[#F2A900]/10 border border-[#F2A900]/20 rounded-lg px-3 py-2 uppercase tracking-wide">
              Showing {results.length} active node
              {results.length === 1 ? '' : 's'}
            </div>
          </div>

          {/* Filtering Section - Segmented Control Styling */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs mb-10 flex flex-col gap-5">
            {/* Category selection */}
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-3">
                Select Portal Category
              </span>
              <div className="flex flex-wrap gap-2">
                {TYPES.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setType(t.key)}
                    className={clsx(
                      'text-xs font-black px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-200',
                      type === t.key
                        ? 'bg-[#002147] text-white border-[#002147] shadow-sm shadow-[#002147]/10'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-navy'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campus selection */}
            <div className="border-t border-slate-100 pt-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-3">
                Select Campus Location
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCampus('all')}
                  className={clsx(
                    'text-xs font-black px-3.5 py-2 rounded-xl border cursor-pointer transition-all duration-200',
                    campus === 'all'
                      ? 'bg-[#F2A900] text-[#001833] border-[#F2A900] shadow-sm'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
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
                      'text-xs font-black px-3.5 py-2 rounded-xl border cursor-pointer transition-all duration-200',
                      campus === c.slug
                        ? 'bg-[#F2A900] text-[#001833] border-[#F2A900] shadow-sm'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    )}
                  >
                    {c.name.replace(' Parisar', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Cards Grid - Sleek Hover Borders & Watermarks */}
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
                    className="group relative text-left bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-[#F2A900]/40 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between min-h-[200px] cursor-pointer shadow-3xs overflow-hidden"
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
                        <span className="grid place-items-center px-3.5 py-1.5 rounded-lg bg-[#001833] text-[#F2A900] font-display font-black text-sm tracking-wide shadow-sm">
                          {i.shortName}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#F2A900]/10 group-hover:text-[#F2A900] transition-colors duration-300 shadow-3xs">
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>

                      {/* Info details */}
                      <div>
                        <h3 className="font-display font-black text-[#002147] text-[16px] leading-snug group-hover:text-blue transition-colors">
                          {i.name}
                        </h3>
                        {i.faculty && (
                          <p className="text-slate-400 text-xs mt-1.5 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-[#F2A900]" />
                            <span>{i.faculty}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-slate-100 text-[11px] w-full relative z-10">
                      <span
                        className={clsx(
                          'text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border',
                          TYPE_BADGE_STYLE[i.type]
                        )}
                      >
                        {TYPE_LABEL[i.type]}
                      </span>
                      {camp && (
                        <span className="text-slate-500 font-bold flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{camp.name.replace(' Parisar', '')}</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-200/60 shadow-3xs">
              <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-display font-black text-[#002147] text-xl uppercase tracking-wide mb-1">
                No matching departments found
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto px-4">
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
