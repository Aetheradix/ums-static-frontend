import { ArrowRight } from 'lucide-react';

export default function VCAndRecruiters() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-3 sm:pb-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: From the Vice Chancellor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col relative overflow-hidden">
          {/* Watermark logo */}
          <div className="absolute -right-6 -bottom-6 w-48 h-48 opacity-[0.04] pointer-events-none select-none z-0">
            <img
              src="/DAVV_Logo.png"
              alt="DAVV Logo Watermark"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="relative z-10 grow flex flex-col justify-between">
            <h3 className="font-display font-black text-[#002147] text-lg md:text-xl mb-6 leading-none">
              From the Vice Chancellor
            </h3>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-center grow justify-center py-2">
              {/* VC portrait avatar */}
              <div className="w-36 h-48 sm:w-48 sm:h-64 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-md z-0 mx-auto sm:mx-0">
                <img
                  src="/davv-cms/img1.png"
                  alt="Vice Chancellor Prof. Rakesh Singh"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* VC Message blurb */}
              <div className="flex-1 text-center sm:text-left space-y-4">
                <p className="text-slate-650 text-sm sm:text-[15px] md:text-base leading-relaxed italic font-medium">
                  "At DAVV, our mission is to empower students through quality
                  education, research and ethical values. We are dedicated to
                  building a knowledge society and a better tomorrow."
                </p>
                <div>
                  <h4 className="text-blue text-[14px] sm:text-[15px] font-black tracking-tight leading-snug">
                    Prof. Rakesh Singh
                  </h4>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">
                    Vice-Chancellor
                  </p>
                </div>
                <div className="pt-2 flex justify-center sm:justify-start">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#002147] hover:bg-blue text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-sm group"
                  >
                    <span>Read Message</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Top Recruiters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-black text-[#002147] text-lg md:text-xl leading-none">
                Top Recruiters
              </h3>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue hover:text-[#002147] transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Grid of Recruiter Logos */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 items-center justify-items-center py-2">
              {[
                { name: 'TCS', logo: '/davv-cms/recruiter/TCS.png' },
                { name: 'Infosys', logo: '/davv-cms/recruiter/INFOSYS.png' },
                { name: 'Wipro', logo: '/davv-cms/recruiter/WIPRO.png' },
                { name: 'ICICI', logo: '/davv-cms/recruiter/ICICI.png' },
                { name: 'HCL', logo: '/davv-cms/recruiter/HCL.png' },
                { name: 'Axis', logo: '/davv-cms/recruiter/Axis.png' },
              ].map((rec, idx) => (
                <div
                  key={idx}
                  className="w-full h-16 sm:h-20 flex items-center justify-center p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:scale-105 hover:bg-slate-50 transition-all shadow-3xs"
                >
                  <img
                    src={rec.logo}
                    alt={`${rec.name} Logo`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Bottom Right: & many more... */}
            <div className="text-right mt-3 pr-2">
              <span className="text-slate-400 text-xs font-semibold tracking-wide italic">
                & many more...
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
