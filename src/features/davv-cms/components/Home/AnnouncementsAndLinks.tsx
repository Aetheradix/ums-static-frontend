import { ArrowRight, ChevronRight, Link2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ANNOUNCEMENTS, IMPORTANT_LINKS } from '../../constants/data';
import { useLanguage } from '../../../../shared/context/useLanguage';

const CATEGORIES = [
  'All',
  'Admission',
  'Examination',
  'Circular',
  'Tender',
  'Events',
];

export default function AnnouncementsAndLinks() {
  const [activeCategory, setActiveCategory] = useState('All');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollTopRef = useRef(0);
  const timeoutRef = useRef<any>(null);

  const { t } = useLanguage();

  const filteredAnnouncements =
    activeCategory === 'All'
      ? ANNOUNCEMENTS
      : ANNOUNCEMENTS.filter(ann => ann.category === activeCategory);

  // Duplicate announcements to make vertical scrolling seamless
  const duplicatedAnnouncements = useMemo(() => {
    if (filteredAnnouncements.length === 0) return [];
    return [...filteredAnnouncements, ...filteredAnnouncements];
  }, [filteredAnnouncements]);

  // Autoscroll Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container || filteredAnnouncements.length === 0) return;

    let animationFrameId: number;

    const scroll = () => {
      if (!isPaused && container) {
        const halfHeight = container.scrollHeight / 2;

        // Only scroll if content is taller than the container
        if (halfHeight > container.clientHeight) {
          const speed = 0.33; // smooth pixel increment step

          scrollTopRef.current += speed;

          // Reset to top if we scroll past one full height of the list
          if (scrollTopRef.current >= halfHeight) {
            scrollTopRef.current = scrollTopRef.current - halfHeight;
          }

          container.scrollTop = Math.floor(scrollTopRef.current);
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, filteredAnnouncements]);

  // Sync scrollTopRef with native scroll position during manual scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!isPaused) return;
      scrollTopRef.current = container.scrollTop;
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isPaused, filteredAnnouncements]);

  // Reset scroll to top when category changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      scrollTopRef.current = 0;
    }
  }, [activeCategory]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  const handleTouchStart = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-3 sm:pb-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Latest Announcements (Takes 2 columns of grid) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col">
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-black text-[#002147] text-lg md:text-xl leading-none">
                {t('Latest Announcements')}
              </h3>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue hover:text-[#002147] transition-colors"
              >
                <span>{t('View All')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3 border-b border-slate-100 pb-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-full border transition-all duration-300 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#002147] border-[#002147] text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {t(cat)}
                </button>
              ))}
            </div>

            {/* Announcements List */}
            <div
              ref={containerRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="h-[240px] overflow-y-auto pr-1.5 space-y-1.5"
              style={{ scrollBehavior: 'auto' }}
            >
              {duplicatedAnnouncements.length > 0 ? (
                duplicatedAnnouncements.map((ann, idx) => (
                  <div
                    key={idx}
                    className="py-1.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 px-1.5 rounded-xl transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 w-full">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        {/* Tag badge */}
                        <span
                          className={`px-1.5 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded-md text-center shrink-0 min-w-[68px] sm:min-w-[85px] mt-0.5 ${ann.tagColor}`}
                        >
                          {t(ann.tag)}
                        </span>
                        {/* Title */}
                        <a
                          href="#"
                          className="text-navy text-xs sm:text-sm font-bold leading-snug hover:text-blue transition-colors"
                        >
                          {t(ann.title)}
                        </a>
                      </div>

                      {/* Date Badge */}
                      <span className="shrink-0 px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-md bg-slate-100 text-slate-500 border border-slate-200/60 whitespace-nowrap mt-0.5">
                        {t(ann.date)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm font-medium">
                  {t('No announcements found in this category.')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Important Links Sidebar (Takes 1 column) */}
        <div className="bg-[#002147] text-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col">
          <div className="h-full flex flex-col justify-between">
            <div>
              <h3 className="font-display font-black text-yellow-400 text-lg md:text-xl mb-4 tracking-wide">
                {t('Important Links')}
              </h3>
            </div>

            <div className="grow flex flex-col justify-between divide-y divide-white/10">
              {IMPORTANT_LINKS.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="flex items-center justify-between py-2 text-white hover:text-yellow-400 transition-colors group"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide">
                    <Link2 className="w-3.5 h-3.5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                    {t(link.label)}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/50 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
