import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import { PILLARS } from '../../../constants/data';
import SectionTitle from '../../ui/SectionTitle';
import { clsx } from 'clsx';
import {
  GraduationCap,
  Scale,
  Coins,
  Users,
  BarChart3,
  FlaskConical,
  Building2,
  Handshake,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Map solution IDs to beautiful Lucide vector icons
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  academics: GraduationCap,
  governance: Scale,
  finance: Coins,
  hr: Users,
  analytics: BarChart3,
  research: FlaskConical,
  estate: Building2,
  alumni: Handshake,
};

// Premium visual theme configurations for each color profile
const CARD_THEMES: Record<
  string,
  {
    borderHover: string;
    glowShadow: string;
    iconBg: string;
    iconBgHover: string;
    iconColor: string;
    iconColorHover: string;
    numberColor: string;
    tagColor: string;
    accentGradient: string;
  }
> = {
  blue: {
    borderHover: 'hover:border-blue-400',
    glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(59,130,246,0.2)]',
    iconBg: 'bg-blue-50/70 border-blue-100/60',
    iconBgHover: 'group-hover:bg-blue-500',
    iconColor: 'text-blue-600',
    iconColorHover: 'group-hover:text-white',
    numberColor: 'text-blue-500/5 group-hover:text-blue-500/10',
    tagColor: 'text-blue-600',
    accentGradient: 'from-blue-500 to-blue-600',
  },
  indigo: {
    borderHover: 'hover:border-indigo-400',
    glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(99,102,241,0.2)]',
    iconBg: 'bg-indigo-50/70 border-indigo-100/60',
    iconBgHover: 'group-hover:bg-indigo-500',
    iconColor: 'text-indigo-600',
    iconColorHover: 'group-hover:text-white',
    numberColor: 'text-indigo-500/5 group-hover:text-indigo-500/10',
    tagColor: 'text-indigo-600',
    accentGradient: 'from-indigo-500 to-indigo-600',
  },
  emerald: {
    borderHover: 'hover:border-emerald-400',
    glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.2)]',
    iconBg: 'bg-emerald-50/70 border-emerald-100/60',
    iconBgHover: 'group-hover:bg-emerald-500',
    iconColor: 'text-emerald-600',
    iconColorHover: 'group-hover:text-white',
    numberColor: 'text-emerald-500/5 group-hover:text-emerald-500/10',
    tagColor: 'text-emerald-600',
    accentGradient: 'from-emerald-500 to-emerald-600',
  },
  orange: {
    borderHover: 'hover:border-orange-400',
    glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(249,115,22,0.2)]',
    iconBg: 'bg-orange-50/70 border-orange-100/60',
    iconBgHover: 'group-hover:bg-orange-500',
    iconColor: 'text-orange-600',
    iconColorHover: 'group-hover:text-white',
    numberColor: 'text-orange-500/5 group-hover:text-orange-500/10',
    tagColor: 'text-orange-600',
    accentGradient: 'from-orange-500 to-orange-600',
  },
  purple: {
    borderHover: 'hover:border-purple-400',
    glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(168,85,247,0.2)]',
    iconBg: 'bg-purple-50/70 border-purple-100/60',
    iconBgHover: 'group-hover:bg-purple-500',
    iconColor: 'text-purple-600',
    iconColorHover: 'group-hover:text-white',
    numberColor: 'text-purple-500/5 group-hover:text-purple-500/10',
    tagColor: 'text-purple-600',
    accentGradient: 'from-purple-500 to-purple-600',
  },
  cyan: {
    borderHover: 'hover:border-cyan-400',
    glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(6,182,212,0.2)]',
    iconBg: 'bg-cyan-50/70 border-cyan-100/60',
    iconBgHover: 'group-hover:bg-cyan-500',
    iconColor: 'text-cyan-600',
    iconColorHover: 'group-hover:text-white',
    numberColor: 'text-cyan-500/5 group-hover:text-cyan-500/10',
    tagColor: 'text-cyan-600',
    accentGradient: 'from-cyan-500 to-cyan-600',
  },
  rose: {
    borderHover: 'hover:border-rose-400',
    glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(244,63,94,0.2)]',
    iconBg: 'bg-rose-50/70 border-rose-100/60',
    iconBgHover: 'group-hover:bg-rose-500',
    iconColor: 'text-rose-600',
    iconColorHover: 'group-hover:text-white',
    numberColor: 'text-rose-500/5 group-hover:text-rose-500/10',
    tagColor: 'text-rose-600',
    accentGradient: 'from-rose-500 to-rose-600',
  },
  amber: {
    borderHover: 'hover:border-amber-400',
    glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(245,158,11,0.2)]',
    iconBg: 'bg-amber-50/70 border-amber-100/60',
    iconBgHover: 'group-hover:bg-amber-500',
    iconColor: 'text-amber-600',
    iconColorHover: 'group-hover:text-white',
    numberColor: 'text-amber-500/5 group-hover:text-amber-500/10',
    tagColor: 'text-amber-600',
    accentGradient: 'from-amber-500 to-amber-600',
  },
};

export default function SolutionsPreview() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const totalSlides = PILLARS.length;

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLDivElement>('[data-card]');
    if (cards[index]) {
      const card = cards[index];
      const scrollLeft =
        card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
    setActiveIndex(index);
  }, []);

  const goNext = useCallback(() => {
    scrollToIndex((activeIndex + 1) % totalSlides);
  }, [activeIndex, totalSlides, scrollToIndex]);

  const goPrev = useCallback(() => {
    scrollToIndex((activeIndex - 1 + totalSlides) % totalSlides);
  }, [activeIndex, totalSlides, scrollToIndex]);

  // Auto-play: one card at a time
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      goNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, goNext]);

  // Track scroll position to update active dot
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const cards = container.querySelectorAll<HTMLDivElement>('[data-card]');
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      let closestIdx = 0;
      let closestDist = Infinity;
      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(containerCenter - cardCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });
      setActiveIndex(closestIdx);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="solutions"
      className="py-5 md:py-16 bg-surface relative overflow-hidden"
    >
      {/* Background soft ambient glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/10 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        <SectionTitle
          badge="Our Solutions"
          title="8 Pillars of University Excellence"
          subtitle="A comprehensive, STQC-certified digital governance ecosystem covering every facet of higher education administration."
          center={true}
        />

        {/* Carousel Container */}
        <div
          className="relative md:mt-12 mt-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            className="absolute hidden md:flex -left-4 md:-left-8 lg:-left-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white border border-border/60 shadow-lg items-center justify-center text-navy hover:bg-blue hover:text-white hover:border-blue transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute hidden md:flex -right-4 md:-right-8 lg:-right-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white border border-border/60 shadow-lg items-center justify-center text-navy hover:bg-blue hover:text-white hover:border-blue transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Wrapper to restrict width and hide sliver borders of adjacent cards */}
          <div className="mx-auto w-full md:max-w-[864px] xl:max-w-[1308px] overflow-hidden px-4 md:px-0">
            {/* Scrollable Track */}
            <div
              ref={scrollRef}
              className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth py-4 no-scrollbar"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {PILLARS.map((solution, idx) => {
                const IconComponent = ICON_MAP[solution.id] || GraduationCap;
                const theme = CARD_THEMES[solution.color] || CARD_THEMES.blue;
                const formattedIndex = String(idx + 1).padStart(2, '0');

                return (
                  <div
                    key={solution.id}
                    data-card
                    onClick={() => navigate('/solutions')}
                    className={clsx(
                      'group relative bg-white rounded-2xl p-4 md:p-7 border border-border/60 shadow-sm',
                      'hover:-translate-y-1.5 transition-all duration-500 cursor-pointer flex flex-col',
                      'shrink-0 min-h-[210px] md:min-h-[320px]',
                      'w-[70vw] sm:w-[50vw] md:w-[420px]',
                      theme.borderHover,
                      theme.glowShadow
                    )}
                    style={{
                      scrollSnapAlign: 'center',
                    }}
                  >
                    {/* Large Subtle background number watermark */}
                    <div
                      className={clsx(
                        'absolute top-2 right-3 md:top-3 md:right-5 text-4xl md:text-7xl font-display font-extrabold select-none pointer-events-none transition-all duration-700',
                        theme.numberColor
                      )}
                    >
                      {formattedIndex}
                    </div>

                    {/* Top accent line */}
                    <div
                      className={clsx(
                        'absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                        theme.accentGradient
                      )}
                    />

                    {/* Animated Icon wrapper */}
                    <div
                      className={clsx(
                        'w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-2xl border flex items-center justify-center mb-3 md:mb-5 transition-all duration-500 shadow-sm',
                        theme.iconBg,
                        theme.iconBgHover
                      )}
                    >
                      <IconComponent
                        className={clsx(
                          'w-5 h-5 md:w-6 md:h-6 transition-colors duration-500',
                          theme.iconColor,
                          theme.iconColorHover
                        )}
                      />
                    </div>

                    {/* Title & Tagline */}
                    <div className="mb-2">
                      <span
                        className={clsx(
                          'font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em] block mb-1',
                          theme.tagColor
                        )}
                      >
                        {solution.tagline}
                      </span>
                      <h3 className="font-display text-sm md:text-lg font-bold text-navy leading-snug">
                        {solution.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-muted text-[11px] md:text-[13px] leading-relaxed mb-3 md:mb-5 flex-1 pr-2">
                      {solution.desc}
                    </p>

                    {/* Action Footer */}
                    <div className="mt-auto flex items-center justify-between text-navy font-bold text-[9px] md:text-[10px] uppercase tracking-wider pt-2.5 md:pt-4 border-t border-border/40">
                      <span className="group-hover:text-blue transition-colors duration-300">
                        System Interface
                      </span>
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-muted group-hover:bg-blue group-hover:border-blue group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dot Indicators & Mobile Control Arrows */}
          <div className="flex items-center justify-center gap-4 mt-3">
            {/* Left Control Arrow (Mobile Only) */}
            <button
              onClick={goPrev}
              className="w-7 h-7 rounded-full bg-white border border-border/60 shadow-sm flex items-center justify-center text-navy hover:bg-blue hover:text-white hover:border-blue transition-all duration-300 active:scale-95 md:hidden"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5 md:gap-2">
              {PILLARS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={clsx(
                    'rounded-full transition-all duration-300',
                    activeIndex === idx
                      ? 'w-5 h-1.5 md:w-8 md:h-2.5 bg-blue shadow-md'
                      : 'w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-slate-300 hover:bg-slate-400'
                  )}
                />
              ))}
            </div>

            {/* Right Control Arrow (Mobile Only) */}
            <button
              onClick={goNext}
              className="w-7 h-7 rounded-full bg-white border border-border/60 shadow-sm flex items-center justify-center text-navy hover:bg-blue hover:text-white hover:border-blue transition-all duration-300 active:scale-95 md:hidden"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
