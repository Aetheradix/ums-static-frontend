import { ABOUT_CONTENT } from '../../../constants/data';
import { Target, Eye, Cpu, Handshake, Zap } from 'lucide-react';

const VALUE_ICONS = [Target, Handshake, Zap];

const VALUE_COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
];

export default function MissionVision() {
  return (
    <section className="py-12 md:py-20 bg-surface overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 md:mb-20">
          {/* Mission */}
          <div className="bg-white border border-border border-l-4 border-l-blue p-5 md:p-6 rounded-lg reveal-left">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <span className="w-7 h-7 md:w-8 md:h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded shrink-0">
                <Target
                  className="w-3.5 h-3.5 md:w-4 md:h-4"
                  strokeWidth={2.5}
                />
              </span>
              <h3 className="font-display text-base md:text-lg font-bold text-navy uppercase tracking-wide">
                Our Mission
              </h3>
            </div>
            <p className="text-muted text-xs md:text-sm leading-relaxed">
              {ABOUT_CONTENT.mission}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white border border-border border-l-4 border-l-emerald-500 p-5 md:p-6 rounded-lg reveal-right">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <span className="w-7 h-7 md:w-8 md:h-8 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded shrink-0">
                <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
              </span>
              <h3 className="font-display text-base md:text-lg font-bold text-navy uppercase tracking-wide">
                Our Vision
              </h3>
            </div>
            <p className="text-muted text-xs md:text-sm leading-relaxed">
              {ABOUT_CONTENT.vision}
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-6 md:mb-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-navy mb-1">
            Core Values
          </h2>
          <p className="text-muted text-xs md:text-sm">
            The principles that guide everything we build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ABOUT_CONTENT.values.map((value, idx) => {
            const IconComp = VALUE_ICONS[idx] || Cpu;
            const color = VALUE_COLORS[idx % VALUE_COLORS.length];
            return (
              <div
                key={idx}
                className="bg-white border border-border p-5 md:p-6 rounded-lg reveal-scale"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <span
                  className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded mb-3 md:mb-4 shrink-0 ${color.bg} ${color.text}`}
                >
                  <IconComp
                    className="w-3.5 h-3.5 md:w-4 md:h-4"
                    strokeWidth={2.5}
                  />
                </span>
                <h4 className="font-display text-sm md:text-base font-bold text-navy mb-1.5 md:mb-2 uppercase tracking-wide">
                  {value.title}
                </h4>
                <p className="text-muted text-xs md:text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
