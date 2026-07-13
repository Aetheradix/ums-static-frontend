import { useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
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
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Latest Announcements (Takes 2 columns of grid) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-black text-[#002147] text-xl md:text-2xl leading-none">
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
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-100 pb-5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-full border transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-[#002147] border-[#002147] text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((ann, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 px-2 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Tag badge */}
                      <span
                        className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md text-center shrink-0 min-w-[90px] ${ann.tagColor}`}
                      >
                        {ann.tag}
                      </span>
                      {/* Title */}
                      <a
                        href="#"
                        className="text-navy text-sm font-bold hover:text-blue transition-colors leading-snug line-clamp-2"
                      >
                        {ann.title}
                      </a>
                    </div>
                    {/* Date */}
                    <span className="text-slate-400 text-xs font-semibold shrink-0 pl-14 sm:pl-0">
                      {ann.date}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm font-medium">
                  No announcements found in this category.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Important Links Sidebar (Takes 1 column) */}
        <div className="bg-[#002147] text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-display font-black text-white text-xl md:text-2xl mb-6 tracking-wide">
              Important Links
            </h3>

            <div className="divide-y divide-white/10">
              {IMPORTANT_LINKS.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="flex items-center justify-between py-3.5 group hover:text-amber-400 transition-colors"
                >
                  <span className="text-sm font-bold tracking-wide">
                    {link.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
