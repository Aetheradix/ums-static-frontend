const governanceCards = [
  {
    name: 'RTI Management',
    bgColor: 'bg-white hover:bg-amber-50/90',
    iconBgColor: 'bg-slate-50 group-hover:bg-amber-100/80',
    borderColor: 'border-slate-200/80 hover:border-amber-400',
    textColor: 'text-navy group-hover:text-amber-900',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-[#1D4ED8] group-hover:text-amber-600 group-hover:scale-110 transition-all duration-300"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    name: 'Legal Case Management',
    bgColor: 'bg-white hover:bg-indigo-50/90',
    iconBgColor: 'bg-slate-50 group-hover:bg-indigo-100/80',
    borderColor: 'border-slate-200/80 hover:border-indigo-400',
    textColor: 'text-navy group-hover:text-indigo-900',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-[#1D4ED8] group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300"
      >
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="5" y1="7" x2="19" y2="7" />
        <path d="M5 7c0 4 3 6 3 6s3-2 3-6" />
        <path d="M13 7c0 4 3 6 3 6s3-2 3-6" />
        <path d="M4 22h16" />
      </svg>
    ),
  },
  {
    name: 'File Tracking System',
    bgColor: 'bg-white hover:bg-emerald-50/90',
    iconBgColor: 'bg-slate-50 group-hover:bg-emerald-100/80',
    borderColor: 'border-slate-200/80 hover:border-emerald-400',
    textColor: 'text-navy group-hover:text-emerald-900',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-[#1D4ED8] group-hover:text-emerald-600 group-hover:scale-110 transition-all duration-300"
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="14" r="3" />
        <path d="M12 12v2l1.5 1" />
      </svg>
    ),
  },
  {
    name: 'Inspection Management',
    bgColor: 'bg-white hover:bg-purple-50/90',
    iconBgColor: 'bg-slate-50 group-hover:bg-purple-100/80',
    borderColor: 'border-slate-200/80 hover:border-purple-400',
    textColor: 'text-navy group-hover:text-purple-900',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-[#1D4ED8] group-hover:text-purple-600 group-hover:scale-110 transition-all duration-300"
      >
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    ),
  },
  {
    name: 'Grievance Redressal',
    bgColor: 'bg-white hover:bg-rose-50/90',
    iconBgColor: 'bg-slate-50 group-hover:bg-rose-100/80',
    borderColor: 'border-slate-200/80 hover:border-rose-400',
    textColor: 'text-navy group-hover:text-rose-900',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-[#1D4ED8] group-hover:text-rose-600 group-hover:scale-110 transition-all duration-300"
      >
        <path d="M11 5h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
        <path d="M3 9h4l5-4v14l-5-4H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z" />
        <path d="M19 8.5c1 1.5 1 3.5 0 5" />
        <path d="M22 6.5c2.5 3 2.5 8 0 11" />
      </svg>
    ),
  },
  {
    name: 'Service Desk',
    bgColor: 'bg-white hover:bg-cyan-50/90',
    iconBgColor: 'bg-slate-50 group-hover:bg-cyan-100/80',
    borderColor: 'border-slate-200/80 hover:border-cyan-400',
    textColor: 'text-navy group-hover:text-cyan-900',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-[#1D4ED8] group-hover:text-cyan-600 group-hover:scale-110 transition-all duration-300"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
        <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
        <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
        <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
      </svg>
    ),
  },
];

export default function GovernanceExcellence() {
  return (
    <section
      id="governance"
      className="relative w-full py-4 md:py-20 bg-sky-50 overflow-hidden border-y border-sky-100 flex items-center min-h-[360px]"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-4/5 bg-blue-light/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Left-aligned Faint Building Watermark */}
      <div className="absolute top-0 left-0 bottom-0 w-[28%] lg:w-[26%] xl:w-[37%] hidden md:block select-none pointer-events-none z-0">
        <img
          src="/UniversitySectionLeft.png"
          className="w-full h-full object-cover object-left opacity-[0.2] mix-blend-multiply"
          alt="Governance watermark left"
          loading="lazy"
        />
        {/* Soft sky-blue fade on the right of the left image to blend with center background */}
        <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-sky-50 via-sky-50/10 to-transparent z-10" />
      </div>

      {/* Main Content Area (Spans full width, on desktop occupies left ~70% to leave room for right building) */}
      <div className="max-w-[1400px] mx-auto px-4 relative z-10 w-full">
        <div className="w-full md:w-[66%] lg:w-[78%] xl:w-[70%] flex flex-col items-start text-left">
          {/* Header & Badges Container */}
          <div className="reveal flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full md:mb-10 mb-2">
            <div className="flex flex-col items-start text-left">
              <span className="inline-block px-3 py-1 bg-blue-light text-[#1D4ED8] text-[10px] font-black uppercase tracking-[0.2em] rounded-md mb-3 border border-blue/10">
                OUR STRENGTH
              </span>
              <h2 className="font-display text-xl sm:text-3xl font-black text-navy leading-tight">
                Governance <span className="text-[#1D4ED8]">Excellence</span>
              </h2>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-row items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 w-full">
              <div className="flex items-center gap-1 sm:gap-2 px-1.5 py-1 sm:px-2.5 sm:py-1.5 bg-linear-to-r from-emerald-50 to-teal-50 backdrop-blur-md rounded-md sm:rounded-xl border border-emerald-200/60 shadow-[0_2px_8px_rgba(16,185,129,0.1)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-sm sm:rounded-lg bg-emerald-100 flex items-center justify-center border border-emerald-200/60 shrink-0">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[6.5px] sm:text-[8px] uppercase tracking-wider font-bold text-emerald-600/80 leading-none">
                    Security
                  </span>
                  <span className="text-[7.5px] sm:text-[10px] font-black text-emerald-900 mt-0.5 leading-none">
                    STQC Certified
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 px-1.5 py-1 sm:px-2.5 sm:py-1.5 bg-linear-to-r from-indigo-50 to-violet-50 backdrop-blur-md rounded-md sm:rounded-xl border border-indigo-200/60 shadow-[0_2px_8px_rgba(99,102,241,0.1)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-sm sm:rounded-lg bg-indigo-100 flex items-center justify-center border border-indigo-200/60 shrink-0">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[6.5px] sm:text-[8px] uppercase tracking-wider font-bold text-indigo-600/80 leading-none">
                    Standard
                  </span>
                  <span className="text-[7.5px] sm:text-[10px] font-black text-indigo-900 mt-0.5 leading-none">
                    NEP 2020 Compliant
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 px-1.5 py-1 sm:px-2.5 sm:py-1.5 bg-linear-to-r from-amber-50 to-orange-50 backdrop-blur-md rounded-md sm:rounded-xl border border-amber-200/60 shadow-[0_2px_8px_rgba(245,158,11,0.1)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-sm sm:rounded-lg bg-amber-100 flex items-center justify-center border border-amber-200/60 shrink-0">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[6.5px] sm:text-[8px] uppercase tracking-wider font-bold text-amber-600/80 leading-none">
                    Infrastructure
                  </span>
                  <span className="text-[7.5px] sm:text-[10px] font-black text-amber-900 mt-0.5 leading-none">
                    Cloud Deployable
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Layout: 2-column grid on mobile, horizontal scroll row on desktop */}
          <div className="reveal grid grid-cols-2 gap-2 w-full md:flex md:items-center md:justify-start md:overflow-x-auto md:gap-4 pt-2 pb-4 md:py-2 no-scrollbar">
            {governanceCards.map((card, index) => (
              <div
                key={index}
                className={`group rounded-xl p-2 md:p-4 border transition-all duration-300 flex flex-col items-center justify-center text-center gap-1.5 md:gap-3.5 cursor-pointer w-full h-[88px] md:w-[112px] md:h-[132px] lg:w-[124px] lg:h-[144px] md:shrink-0 shadow-[0_4px_16px_rgba(15,23,42,0.05)] hover:shadow-lg hover:-translate-y-0.5 ${card.bgColor} ${card.borderColor}`}
              >
                <div
                  className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 ${card.iconBgColor}`}
                >
                  <div className="scale-75 md:scale-100 flex items-center justify-center">
                    {card.icon}
                  </div>
                </div>
                <span
                  className={`font-display font-bold text-[8.5px] md:text-[10px] lg:text-xs leading-tight transition-colors duration-300 ${card.textColor}`}
                >
                  {card.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right-aligned Dome Building Image */}
      <div className="absolute top-0 right-0 bottom-0 w-[34%] lg:w-[45%] xl:w-[50%] hidden md:block select-none pointer-events-none z-0">
        {/* Sky-blue fade overlay on the left of the image to blend perfectly with the center background */}
        <div className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-sky-50 via-sky-50/98 to-transparent z-10" />
        <img
          src="/UniversitySection.png"
          className="w-full h-full object-cover object-left mix-blend-multiply"
          alt="Governance Dome"
          loading="lazy"
        />
      </div>
    </section>
  );
}
