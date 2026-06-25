import { ABOUT_CONTENT } from '../../../constants/data';
import { BookOpen } from 'lucide-react';

export default function CompanyStory() {
  return (
    <section className="py-12 md:py-20 bg-white border-b border-border overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="reveal-left">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="w-7 h-7 md:w-8 md:h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded shrink-0">
                <BookOpen
                  className="w-3.5 h-3.5 md:w-4 md:h-4"
                  strokeWidth={2.5}
                />
              </span>
              <h2 className="font-display text-xl md:text-2xl font-bold text-navy uppercase tracking-wide">
                Our Story
              </h2>
            </div>
            <div className="space-y-4 text-muted text-xs md:text-sm leading-relaxed">
              <p>{ABOUT_CONTENT.story}</p>
              <p>
                Founded by a team of education enthusiasts and technology
                veterans, OCTAGON was born out of a simple observation:
                universities were struggling with fragmented, outdated systems
                that hindered growth rather than enabling it.
              </p>
              <p>
                From our India-based headquarters, we've set out to create a
                unified ecosystem that addresses the unique challenges of the
                Indian higher education landscape — from NEP 2020 compliance to
                seamless academic governance.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="reveal-right mt-4 lg:mt-0">
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {[
                { label: 'Est.', value: '2024', sub: 'Year Founded' },
                {
                  label: 'Location',
                  value: 'India',
                  sub: 'Pan-India Operations',
                },
                {
                  label: 'Modules',
                  value: '43+',
                  sub: 'Across all departments',
                },
                {
                  label: 'Quality',
                  value: 'STQC',
                  sub: 'Government Certified',
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-surface border border-border p-3 md:p-5 rounded-lg"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted mb-1">
                    {stat.label}
                  </div>
                  <div className="font-display text-lg md:text-2xl font-black text-navy mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-[9px] md:text-[11px] text-muted font-medium leading-tight">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Made in India Badge */}
            <div className="mt-4 border border-border bg-white px-4 py-3 md:px-5 md:py-4 flex items-center gap-3 md:gap-4 rounded-lg">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded shrink-0 text-xs md:text-sm font-black">
                IN
              </div>
              <div>
                <div className="font-bold text-navy text-xs md:text-sm">
                  100% Made in India
                </div>
                <div className="text-muted text-[10px] md:text-[11px]">
                  Designed, developed, and deployed in India.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
