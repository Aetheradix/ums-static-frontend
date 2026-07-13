import { ArrowRight } from 'lucide-react';

export default function VCAndRecruiters() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: From the Vice Chancellor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-display font-black text-[#002147] text-lg md:text-xl mb-6 leading-none">
              From the Vice Chancellor
            </h3>

            <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
              {/* VC round avatar */}
              <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border border-slate-100 shadow-sm z-0 mx-auto sm:mx-0">
                <img
                  src="/vc_profile.png"
                  alt="Vice Chancellor Prof. Rakesh Singh"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* VC Message blurb */}
              <div className="flex-1 text-center sm:text-left space-y-3">
                <p className="text-slate-600 text-xs md:text-[13px] leading-relaxed italic">
                  "At DAVV, our mission is to empower students through quality
                  education, research and ethical values. We are dedicated to
                  building a knowledge society and a better tomorrow."
                </p>
                <div>
                  <h4 className="text-blue text-[13px] font-black tracking-tight leading-snug">
                    Prof. Rakesh Singh
                  </h4>
                  <p className="text-slate-400 text-xs font-semibold">
                    Vice-Chancellor
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#002147] hover:bg-blue text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm group"
            >
              <span>Read Message</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
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

            {/* Grid of Recruiter Logos (3x2 Layout) */}
            <div className="grid grid-cols-3 gap-6 md:gap-8 items-center justify-items-center py-4">
              {/* TCS */}
              <div className="font-sans font-black text-lg md:text-xl tracking-tighter text-[#E83C6C]">
                tcs<span className="text-[#364964] font-medium text-xs">™</span>
              </div>

              {/* Infosys */}
              <div className="font-display font-bold text-base md:text-lg tracking-tight text-[#007CC3]">
                Infosys<span className="text-[10px] align-super">®</span>
              </div>

              {/* Wipro */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-linear-to-r from-red-500 via-yellow-400 to-blue" />
                <span className="font-sans font-bold text-slate-800 text-sm md:text-base tracking-wide">
                  wipro
                </span>
              </div>

              {/* ICICI Bank */}
              <div className="font-sans font-black text-xs md:text-sm text-[#F05A28]">
                i<span className="text-[#842E1B]">CICI Bank</span>
              </div>

              {/* HCL */}
              <div className="font-display font-black text-base md:text-lg tracking-wider text-[#00529B]">
                HCL
              </div>

              {/* Axis Bank */}
              <div className="flex items-center gap-1">
                <span className="font-sans font-black text-[#861A49] text-xs md:text-sm tracking-widest uppercase">
                  Axis Bank
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
