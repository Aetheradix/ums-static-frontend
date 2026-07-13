import { useState } from 'react';
import { ArrowRight, ChevronRight, Link2 } from 'lucide-react';
import { ANNOUNCEMENTS, IMPORTANT_LINKS } from '../../constants/data';

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

  const filteredAnnouncements =
    activeCategory === 'All'
      ? ANNOUNCEMENTS
      : ANNOUNCEMENTS.filter(ann => ann.category === activeCategory);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-3 sm:pb-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Latest Announcements (Takes 2 columns of grid) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col">
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-black text-[#002147] text-lg md:text-xl leading-none">
                Latest Announcements
              </h3>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue hover:text-[#002147] transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3 border-b border-slate-100 pb-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-full border transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-[#002147] border-[#002147] text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Announcements List */}
            <div className="max-h-[260px] overflow-y-auto pr-1.5 space-y-1.5">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((ann, idx) => (
                  <div
                    key={idx}
                    className="py-1.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 px-1.5 rounded-xl transition-all"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      {/* Tag badge */}
                      <span
                        className={`px-1.5 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded-md text-center shrink-0 min-w-[68px] sm:min-w-[85px] ${ann.tagColor}`}
                      >
                        {ann.tag}
                      </span>
                      {/* Title and Date Inline */}
                      <span className="text-navy text-xs sm:text-sm font-bold leading-snug">
                        <a
                          href="#"
                          className="hover:text-blue transition-colors mr-2"
                        >
                          {ann.title}
                        </a>
                        <span className="text-slate-400 text-[10px] sm:text-[11px] font-semibold whitespace-nowrap">
                          ({ann.date})
                        </span>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm font-medium">
                  No announcements found in this category.
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
                Important Links
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
                    {link.label}
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
