import { ArrowRight, ChevronRight } from 'lucide-react';
import { ADMISSION_STEPS } from '../../constants/data';

export default function AdmissionStepper() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 select-none">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-5">
          <h3 className="font-display font-black text-[#002147] text-lg md:text-xl leading-none">
            Admissions 2024-25
          </h3>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue hover:text-[#002147] transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Stepper Roadmap Container */}
        <div className="relative flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4 md:px-4">
          {/* Connecting line (Desktop only) */}
          <div className="absolute top-[22px] left-[6%] right-[6%] h-[2px] bg-slate-200 z-0 hidden md:block" />

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
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-2xs">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue transition-colors" />
                    </div>
                  </div>
                )}

                {/* Step Circle & Connector */}
                <div className="flex items-center md:flex-col gap-4 md:gap-0 w-full">
                  {/* Step Number Circle */}
                  <div className="w-11 h-11 rounded-full bg-[#002147] text-white flex items-center justify-center font-display font-black text-sm md:mb-4 shrink-0 shadow-md group-hover:bg-blue group-hover:scale-105 transition-all">
                    {step.step}
                  </div>

                  {/* Vertical connecting line for mobile */}
                  {!isLast && (
                    <div className="absolute left-[21px] top-[44px] bottom-[-32px] w-[2px] bg-slate-200 md:hidden z-0" />
                  )}

                  {/* Content (Text details) */}
                  <div className="flex flex-col md:items-center text-left md:text-center space-y-1">
                    <h4 className="font-display font-black text-navy text-sm md:text-base leading-snug group-hover:text-blue transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-slate-500 text-xs md:text-[13px] leading-relaxed max-w-[200px] md:mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
