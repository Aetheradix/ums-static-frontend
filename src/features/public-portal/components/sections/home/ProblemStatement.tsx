import { PROBLEMS } from '../../../constants/data';
import SectionTitle from '../../ui/SectionTitle';
import {
  FileSpreadsheet,
  TrendingDown,
  ShieldAlert,
  Spline,
  ArrowRight,
  XCircle,
} from 'lucide-react';

// Map PROBLEMS to icons
const ICONS = [FileSpreadsheet, TrendingDown, ShieldAlert, Spline];

// Curated multicolor styles for each card
const CARD_STYLES = [
  {
    gradient:
      'from-orange-100/40 to-amber-100/20 hover:from-orange-100/60 hover:to-amber-100/40 border-orange-300 hover:border-orange-500 shadow-orange-500/5',
    iconBg: 'from-orange-100/80 to-orange-50/40 border-orange-200/50',
    iconColor: 'text-orange-600',
    iconHoverBg:
      'group-hover:from-orange-500 group-hover:to-orange-600 group-hover:text-white',
    hoverLinkColor: 'text-orange-600',
    hoverGlowDot: 'bg-orange-500',
  },
  {
    gradient:
      'from-blue-100/40 to-cyan-100/20 hover:from-blue-100/60 hover:to-cyan-100/40 border-blue-300 hover:border-blue-500 shadow-blue-500/5',
    iconBg: 'from-blue-100/80 to-blue-50/40 border-blue-200/50',
    iconColor: 'text-blue-600',
    iconHoverBg:
      'group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white',
    hoverLinkColor: 'text-blue-600',
    hoverGlowDot: 'bg-blue-500',
  },
  {
    gradient:
      'from-rose-100/40 to-red-100/20 hover:from-rose-100/60 hover:to-red-100/40 border-rose-300 hover:border-rose-500 shadow-rose-500/5',
    iconBg: 'from-rose-100/80 to-rose-50/40 border-rose-200/50',
    iconColor: 'text-rose-600',
    iconHoverBg:
      'group-hover:from-rose-500 group-hover:to-rose-600 group-hover:text-white',
    hoverLinkColor: 'text-rose-600',
    hoverGlowDot: 'bg-rose-500',
  },
  {
    gradient:
      'from-purple-100/40 to-indigo-100/20 hover:from-purple-100/60 hover:to-indigo-100/40 border-purple-300 hover:border-purple-500 shadow-purple-500/5',
    iconBg: 'from-purple-100/80 to-purple-50/40 border-purple-200/50',
    iconColor: 'text-purple-600',
    iconHoverBg:
      'group-hover:from-purple-500 group-hover:to-purple-600 group-hover:text-white',
    hoverLinkColor: 'text-purple-600',
    hoverGlowDot: 'bg-purple-500',
  },
];

export default function ProblemStatement() {
  return (
    <section
      id="problems"
      className="py-12 md:py-20 bg-white relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute -top-40 right-0 w-80 h-80 bg-blue-light/25 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute -bottom-40 left-0 w-80 h-80 bg-blue-light/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side: Title & Context (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-center reveal-left">
            <SectionTitle
              badge="The Challenge"
              title="Why Universities Need OCTAGON"
              center={false}
              subtitle="Manual processes and fragmented systems are holding academic institutions back. We provide the unified solution."
              className="!mb-6"
            />

            {/* Compact Pain Points */}
            <div className="mt-2 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                Legacy Admin Friction
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Loss of physical records',
                  'High administrative costs',
                  'Delayed approvals',
                  'Security vulnerabilities',
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60 text-[11.5px] font-medium text-slate-700 shadow-sm"
                  >
                    <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Grid Area (7 columns) - 2x2 grid of the 4 problem cards */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-2.5 sm:gap-4">
            {PROBLEMS.map((problem, idx) => {
              const IconComponent = ICONS[idx] || FileSpreadsheet;
              const style = CARD_STYLES[idx] || CARD_STYLES[0];
              return (
                <div
                  key={idx}
                  className={`group relative p-3 sm:p-4 bg-gradient-to-br rounded-xl sm:rounded-2xl border transition-all duration-500 flex flex-col justify-between reveal-right shadow-sm hover:shadow-md hover:-translate-y-0.5 delay-${idx + 1} ${style.gradient} overflow-hidden`}
                >
                  {/* Subtle Glowing Corner Dot */}
                  <div
                    className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${style.hoverGlowDot} opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500`}
                  />

                  {/* Large Watermark Icon in bottom-right, visible on hover */}
                  <div
                    className={`absolute bottom-3 right-3 ${style.iconColor} opacity-0 group-hover:opacity-[0.06] group-hover:scale-[3.5] group-hover:-rotate-12 transition-all duration-700 pointer-events-none transform origin-bottom-right z-0`}
                  >
                    <IconComponent className="w-8 h-8" />
                  </div>

                  <div className="relative z-10">
                    {/* Icon container */}
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-xl bg-gradient-to-br ${style.iconBg} border border-transparent flex items-center justify-center mb-1.5 sm:mb-2.5 group-hover:scale-105 ${style.iconHoverBg} transition-all duration-200`}
                    >
                      <IconComponent
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${style.iconColor} group-hover:text-white transition-all duration-200`}
                      />
                    </div>

                    <h3 className="font-display text-[11px] sm:text-[13px] font-bold text-navy mb-0.5 sm:mb-1">
                      {problem.title}
                    </h3>
                    <p className="text-muted leading-relaxed text-[9.5px] sm:text-[11px] pr-0.5">
                      {problem.desc}
                    </p>
                  </div>

                  <div
                    className={`mt-2 pt-1.5 border-t border-slate-900/5 hidden sm:flex items-center justify-between text-[9px] font-bold ${style.hoverLinkColor} opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500 relative z-10`}
                  >
                    <span>Learn how we solve this</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
