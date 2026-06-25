import { ADVANCED_FEATURES } from '../../../constants/data';
import SectionTitle from '../../ui/SectionTitle';
import { Bot, ShieldCheck, Smartphone, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';

// Mapped Lucide icons for the 4 advanced features
const ICONS = [Bot, ShieldCheck, Smartphone, TrendingUp];

// Distinct solid fill themes for the 4 cards
const CARD_THEMES = [
  {
    bg: 'bg-amber-50/60 border-amber-200/70 hover:bg-amber-100/50 hover:border-amber-300 shadow-sm hover:shadow-md',
    iconBg: 'bg-amber-500 text-white shadow-sm shadow-amber-500/15',
    tagBg: 'bg-amber-500/10 text-amber-700 border border-amber-500/10',
  },
  {
    bg: 'bg-indigo-50/60 border-indigo-200/70 hover:bg-indigo-100/50 hover:border-indigo-300 shadow-sm hover:shadow-md',
    iconBg: 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/15',
    tagBg: 'bg-indigo-500/10 text-indigo-700 border border-indigo-500/10',
  },
  {
    bg: 'bg-emerald-50/60 border-emerald-200/70 hover:bg-emerald-100/50 hover:border-emerald-300 shadow-sm hover:shadow-md',
    iconBg: 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/15',
    tagBg: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/10',
  },
  {
    bg: 'bg-blue-50/60 border-blue-200/70 hover:bg-blue-100/50 hover:border-blue-300 shadow-sm hover:shadow-md',
    iconBg: 'bg-blue-500 text-white shadow-sm shadow-blue-500/15',
    tagBg: 'bg-blue-500/10 text-blue-700 border border-blue-500/10',
  },
];

export default function FeaturesHighlight() {
  return (
    <section id="features" className="md:py-16 py-5 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4">
        <SectionTitle
          badge="Future-Ready Technology"
          title="Built for What's Next"
          subtitle="Advanced capabilities like AI, Blockchain, and real-time BI come standard."
          center={true}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-6 sm:mt-10">
          {ADVANCED_FEATURES.map((feature, idx) => {
            const IconComponent = ICONS[idx] || Bot;
            const theme = CARD_THEMES[idx] || CARD_THEMES[0];
            return (
              <div
                key={idx}
                className={clsx(
                  'group flex flex-col rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border transition-all duration-500 text-left h-full',
                  theme.bg,
                  idx % 2 === 0 ? 'reveal-left' : 'reveal-right'
                )}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                {/* Icon wrapper */}
                <div
                  className={clsx(
                    'w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500',
                    theme.iconBg
                  )}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Tag / Tech Label */}
                <span
                  className={clsx(
                    'inline-block self-start px-1.5 py-0.5 sm:px-2 text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider rounded mb-2 sm:mb-3',
                    theme.tagBg
                  )}
                >
                  {feature.tag}
                </span>

                {/* Title */}
                <h3 className="font-display text-[12.5px] sm:text-[15px] font-bold text-navy mb-1 sm:mb-2 leading-snug">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted leading-relaxed text-[10.5px] sm:text-[12px] flex-1">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
