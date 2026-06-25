import { COMPARISON_ROWS } from '../../../constants/data';
import SectionTitle from '../../ui/SectionTitle';
import { clsx } from 'clsx';
import {
  Check,
  Sparkles,
  Settings,
  Scale,
  BarChart3,
  Cpu,
  Link,
  MessageSquare,
  Smartphone,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
} from 'lucide-react';

// Map each capability to a professional Lucide icon
const FEATURE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  'UI / UX Experience': Sparkles,
  'System Configuration': Settings,
  'Governance Modules': Scale,
  'Analytics Dashboard': BarChart3,
  'AI-Powered Attendance': Cpu,
  'Blockchain Credentials': Link,
  'WhatsApp Integration': MessageSquare,
  'Mobile Application': Smartphone,
  'IVRS Integration': Phone,
  'Legal Case Management': Briefcase,
  'APAAR / ABC': GraduationCap,
  'NEP 2020 Compliance': Award,
};

// Premium colors for capability icons to make them pop
const FEATURE_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  'UI / UX Experience': {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    text: 'text-purple-600',
  },
  'System Configuration': {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-600',
  },
  'Governance Modules': {
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    text: 'text-indigo-600',
  },
  'Analytics Dashboard': {
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    text: 'text-cyan-600',
  },
  'AI-Powered Attendance': {
    bg: 'bg-red-50',
    border: 'border-red-100',
    text: 'text-red-600',
  },
  'Blockchain Credentials': {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-600',
  },
  'WhatsApp Integration': {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-600',
  },
  'Mobile Application': {
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    text: 'text-rose-600',
  },
  'IVRS Integration': {
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    text: 'text-orange-600',
  },
  'Legal Case Management': {
    bg: 'bg-slate-100/60',
    border: 'border-slate-200/60',
    text: 'text-slate-600',
  },
  'APAAR / ABC': {
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    text: 'text-sky-600',
  },
  'NEP 2020 Compliance': {
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    text: 'text-teal-600',
  },
};

export default function ComparisonTable() {
  return (
    <section
      id="comparison"
      className="py-6 md:py-20 bg-slate-50/40 relative overflow-hidden reveal"
    >
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 relative z-10">
        <SectionTitle
          badge="Why Choose OCTAGON"
          title="OCTAGON vs Legacy Systems"
          subtitle="Compare key capabilities to see why leading institutions choose our unified digital governance platform."
          center={true}
        />

        <div className="mt-6 md:mt-12 w-full overflow-x-auto no-scrollbar">
          {/* Custom SaaS Table Layout */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-xl shadow-slate-200/50 overflow-hidden w-full md:min-w-[680px]">
            {/* Header Row */}
            <div className="grid grid-cols-12 border-b border-border/60">
              <div className="col-span-5 p-1.5 sm:p-2 md:px-6 md:py-4 flex items-center bg-slate-50/30">
                <span className="text-navy font-extrabold text-[7.5px] sm:text-[9px] md:text-xs uppercase tracking-wider">
                  Key Capabilities
                </span>
              </div>
              <div className="col-span-3 p-1.5 sm:p-2 md:px-6 md:py-4 flex flex-col items-center justify-center border-l border-border/60 bg-slate-50/30">
                <span className="text-muted font-bold text-[6.5px] sm:text-[7.5px] md:text-[9px] uppercase tracking-widest mb-0.5 text-center">
                  Legacy System
                </span>
                <span className="font-display font-black text-navy/40 text-[8px] sm:text-[9px] md:text-sm tracking-wider">
                  SAMARTH
                </span>
              </div>
              <div className="col-span-4 p-1.5 sm:p-2 md:px-6 md:py-4 flex flex-col items-center justify-center bg-gradient-to-b from-navy via-slate-900 to-indigo-950 text-white border-l border-blue-500/20 relative overflow-hidden shadow-lg">
                {/* Glow overlay inside the dark header */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-blue" />
                <span className="inline-block px-1.5 py-0.5 bg-blue text-white text-[5.5px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-wider rounded-full mb-0.5 shadow-[0_2px_5px_rgba(59,130,246,0.3)]">
                  OUR SOLUTION
                </span>
                <span className="font-display font-black text-white text-[8.5px] sm:text-[10px] md:text-base tracking-wider">
                  OCTAGON
                </span>
              </div>
            </div>

            {/* Body Rows */}
            <div className="divide-y divide-border/40">
              {COMPARISON_ROWS.map((row, idx) => {
                const IconComponent = FEATURE_ICONS[row.feature] || Settings;
                const colors = FEATURE_COLORS[row.feature] || {
                  bg: 'bg-slate-50',
                  border: 'border-slate-100',
                  text: 'text-slate-500',
                };
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-12 transition-colors hover:bg-slate-50/50 group"
                  >
                    {/* Feature Name & Colorful Icon */}
                    <div className="col-span-5 p-1.5 sm:p-2 md:px-6 md:py-3 flex items-center gap-1 sm:gap-1.5 md:gap-3">
                      <div
                        className={clsx(
                          'hidden md:flex w-7 h-7 rounded-lg border items-center justify-center transition-all duration-300 shadow-sm shrink-0',
                          colors.bg,
                          colors.border,
                          colors.text,
                          'group-hover:scale-110'
                        )}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-navy text-[7px] min-[380px]:text-[8px] sm:text-xs md:text-[13.5px] group-hover:text-blue transition-colors duration-300">
                        {row.feature}
                      </span>
                    </div>

                    {/* Competitor Value */}
                    <div className="col-span-3 p-1 sm:p-1.5 md:px-6 md:py-3 flex items-center justify-center text-center border-l border-border/40">
                      {renderValue(row.samarth, false)}
                    </div>

                    {/* Octagon Value (Highly Highlighted Column) */}
                    <div className="col-span-4 p-1 sm:p-1.5 md:px-6 md:py-3 flex items-center justify-center text-center bg-blue-50/20 border-l border-blue-500/10 group-hover:bg-blue-50/35 transition-colors duration-300">
                      {renderValue(row.octagon, true)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderValue(val: string, isOctagon: boolean) {
  // Check if it is a legacy warning status
  const isWarning =
    !isOctagon &&
    (val.includes('Complex') ||
      val.includes('Technical') ||
      val.includes('Limited') ||
      val.includes('Basic'));

  if (val === 'Available' || val === 'Supported') {
    return (
      <div className="flex items-center gap-0.5 sm:gap-1 justify-center">
        <span
          className={clsx(
            'w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[7px] sm:text-[10px] font-bold shrink-0 shadow-sm transition-all duration-300',
            isOctagon
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/25'
              : 'bg-blue/10 text-blue'
          )}
        >
          <Check className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 stroke-[3]" />
        </span>
        <span
          className={clsx(
            'text-[6.5px] sm:text-[7.5px] md:text-[10px] font-extrabold uppercase tracking-wider',
            isOctagon ? 'text-emerald-600' : 'text-blue-700'
          )}
        >
          {val}
        </span>
      </div>
    );
  }

  if (val === 'Not Available') {
    return (
      <div className="flex items-center gap-0.5 sm:gap-1 justify-center">
        <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
          <span className="text-[6.5px] sm:text-[7.5px] md:text-[10px] font-black leading-none">
            ✕
          </span>
        </span>
        <span className="text-[6.5px] sm:text-[7.5px] md:text-[10px] font-bold uppercase tracking-wider text-rose-600">
          Not Available
        </span>
      </div>
    );
  }

  if (isWarning) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-[7px] sm:text-[8px] md:text-[11.5px] font-medium text-amber-700 bg-amber-50 border border-amber-100/80 px-0.5 py-0.25 sm:px-1 sm:py-0.5 md:px-2.5 md:py-0.5 rounded-md shadow-[0_1px_2px_rgba(245,158,11,0.05)]">
          {val}
        </span>
      </div>
    );
  }

  return (
    <span
      className={clsx(
        'text-[7px] min-[380px]:text-[7.5px] sm:text-[8.5px] md:text-[12.5px] leading-relaxed px-0.5 sm:px-1 md:px-2.5 py-0.25 sm:py-0.5 md:py-1 rounded-md',
        isOctagon
          ? 'text-navy font-extrabold bg-blue-100/30 border border-blue-200/20'
          : 'text-slate-500 font-medium'
      )}
    >
      {val}
    </span>
  );
}
