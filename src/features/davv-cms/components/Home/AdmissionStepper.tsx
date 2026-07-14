import { ArrowRight, ChevronRight } from 'lucide-react';
import { ADMISSION_STEPS } from '../../constants/data';
import { useLanguage } from '../../../../shared/context/useLanguage';

export default function AdmissionStepper() {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-8 shadow-2xs dark:shadow-slate-900/50 h-full flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-10 border-b border-slate-100 dark:border-slate-700 pb-5">
          <h3 className="font-display font-black text-[#002147] dark:text-white text-lg md:text-xl leading-none">
            {t('Admissions 2026-27')}
          </h3>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue hover:text-[#002147] transition-colors"
          >
            <span>{t('View Details')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Stepper Roadmap Container */}
        <div className="relative flex flex-col md:flex-row items-start justify-between gap-5 md:gap-4 md:px-4">
          {/* Connecting line (Desktop only) */}
          <div className="absolute top-[22px] left-[6%] right-[6%] h-[2px] bg-slate-200 dark:bg-slate-700 z-0 hidden md:block" />

          {/* Connectors & Arrows map */}
          {ADMISSION_STEPS.map((step, idx) => {
            const isLast = idx === ADMISSION_STEPS.length - 1;
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col md:items-center relative z-10 w-full group"
              >
                {/* Horizontal flow line and chevron indicator for desktop */}
                {!isLast && (
                  <div className="absolute top-[10px] left-[55%] w-[90%] h-[24px] hidden md:flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-2xs">
                      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue transition-colors" />
                    </div>
                  </div>
                )}

                {/* Step Circle & Connector */}
                <div className="flex items-center md:flex-col gap-3 md:gap-0 w-full relative">
                  {/* Step Number Circle */}
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#002147] text-white flex items-center justify-center font-display font-black text-xs sm:text-sm md:mb-4 shrink-0 shadow-md group-hover:bg-blue group-hover:scale-105 transition-all">
                    {step.step}
                  </div>

                  {/* Vertical connecting line for mobile */}
                  {!isLast && (
                    <div className="absolute left-[15px] sm:left-[21px] top-[32px] sm:top-[44px] bottom-[-24px] w-[2px] bg-slate-200 dark:bg-slate-700 md:hidden z-0" />
                  )}

                  {/* Content (Text details) */}
                  <div className="flex flex-col md:items-center text-left md:text-center space-y-0.5">
                    <h4 className="font-display font-black text-navy dark:text-slate-100 text-xs sm:text-sm md:text-base leading-snug group-hover:text-blue transition-colors">
                      {t(step.title)}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs md:text-[13px] leading-relaxed max-w-[200px] md:mx-auto">
                      {t(step.description)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tagline & Live Status */}
      <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium tracking-tight">
            {t('Admissions for Academic Session 2026-27 are currently active.')}
          </span>
        </div>
        <div className="text-slate-400 dark:text-slate-500 font-display italic">
          "{t('Empowering Minds, Shaping Futures since 1964.')}"
        </div>
      </div>
    </div>
  );
}
