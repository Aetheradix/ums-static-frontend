import { ArrowRight, MapPin } from 'lucide-react';
import { useLanguage } from '../../../../shared/context/useLanguage';
import { NEWS_UPDATES, UPCOMING_EVENTS } from '../../constants/data';

export default function NewsAndEvents() {
  const { t } = useLanguage();

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-6 select-none">
      <div className="flex flex-col items-center mb-8">
        <h3 className="font-display font-black text-white text-xl md:text-2xl tracking-wide mb-2">
          {t('News & Events')}
        </h3>
        <div className="w-12 h-1 bg-[#F2A900] rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1: News & Updates */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-slate-900/50 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-black text-[#002147] dark:text-white text-lg md:text-xl leading-none">
                {t('News & Updates')}
              </h3>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue hover:text-[#002147] transition-colors"
              >
                <span>{t('View All')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-5 max-h-[280px] overflow-y-auto pr-2">
              {NEWS_UPDATES.map((news, idx) => (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-600 z-0">
                    <img
                      src={news.image}
                      alt={t(news.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex flex-col justify-between py-0.5">
                    <h4 className="text-navy dark:text-slate-100 text-xs md:text-[13px] font-bold leading-snug group-hover:text-blue transition-colors line-clamp-2">
                      {t(news.title)}
                    </h4>
                    <span className="text-slate-400 dark:text-slate-500 text-[11px] font-semibold">
                      {t(news.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Upcoming Events */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-slate-900/50 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-black text-[#002147] dark:text-white text-lg md:text-xl leading-none">
                {t('Upcoming Events')}
              </h3>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue hover:text-[#002147] transition-colors"
              >
                <span>{t('View All')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
              {UPCOMING_EVENTS.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  {/* Calendar Date Card */}
                  <div className="w-12 h-14 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-700/50 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-2xs group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800/40 transition-colors">
                    <span className="font-display font-black text-indigo-700 dark:text-indigo-300 text-base leading-none">
                      {event.day}
                    </span>
                    <span className="text-indigo-600/80 dark:text-indigo-400/80 text-[10px] font-bold uppercase tracking-wider leading-none mt-1">
                      {t(event.month)}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="flex flex-col justify-between py-0.5 space-y-1">
                    <h4 className="text-navy dark:text-slate-100 text-xs md:text-[13px] font-bold leading-snug group-hover:text-blue transition-colors line-clamp-1">
                      {t(event.title)}
                    </h4>
                    <span className="text-slate-400 dark:text-slate-500 text-[11px] font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                      {t(event.location)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
