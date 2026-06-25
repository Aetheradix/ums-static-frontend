export default function RealTimeInsights() {
  return (
    <section
      id="insights"
      className="relative w-full py-6 md:py-20 bg-gradient-to-r from-blue-50/30 via-slate-50/10 to-white overflow-hidden border-y border-slate-100 flex items-center"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-4/5 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Heading, Description, and CTA Button */}
          <div className="lg:col-span-3 xl:col-span-4 text-left reveal-left flex flex-col justify-center">
            <h2 className="font-display text-xl sm:text-3xl font-black text-navy leading-[1.25] mb-3">
              <span className="block">Data-Driven Decisions.</span>
              <span className="block">
                Real-Time <span className="text-emerald-500">Insights.</span>
              </span>
            </h2>
            <p className="text-muted text-[13.5px] sm:text-base leading-relaxed mb-5 max-w-sm">
              Powerful dashboards and advanced analytics for data-backed
              university management.
            </p>
            <a
              href="/analytics"
              className="inline-flex items-center gap-1.5 sm:gap-2.5 px-4 py-2.5 sm:px-6 sm:py-3.5 bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-display font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-fit"
            >
              View Dashboards
              <span className="font-sans text-xs sm:text-sm">&rarr;</span>
            </a>
          </div>

          {/* Right Column: Dashboards Mockup Cards Row */}
          <div className="lg:col-span-9 xl:col-span-8 reveal-right">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-4 w-full">
              {/* Card 1: Enrollment Overview */}
              <div className="bg-white rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-[0_4px_16px_rgba(15,23,42,0.03)] flex flex-col justify-between min-h-[180px] sm:min-h-[220px]">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1 sm:mb-2 block text-left">
                  Enrollment Overview
                </span>
                <div className="flex flex-col items-center justify-center flex-grow">
                  {/* Donut Chart SVG */}
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="4.2"
                      />
                      {/* UG: 59% */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="4.2"
                        strokeDasharray="59 41"
                        strokeDashoffset="0"
                      />
                      {/* PG: 29% */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="4.2"
                        strokeDasharray="29 71"
                        strokeDashoffset="-59"
                      />
                      {/* PhD: 8% */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="4.2"
                        strokeDasharray="8 92"
                        strokeDashoffset="-88"
                      />
                      {/* Others: 4% */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="4.2"
                        strokeDasharray="4 96"
                        strokeDashoffset="-96"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="font-display font-black text-xs sm:text-sm text-navy leading-none">
                        24,568
                      </span>
                      <span className="text-[5.5px] sm:text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        Total Students
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legends at the Bottom */}
                <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1.5 mt-3 pt-2 sm:mt-4 sm:pt-3 border-t border-slate-100 w-full text-[8.5px] sm:text-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                      <span className="font-bold text-slate-500">UG</span>
                    </div>
                    <span className="font-black text-navy ml-1">14,568</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4f46e5]" />
                      <span className="font-bold text-slate-500">PG</span>
                    </div>
                    <span className="font-black text-navy ml-1">7,265</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                      <span className="font-bold text-slate-500">PhD</span>
                    </div>
                    <span className="font-black text-navy ml-1">1,920</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                      <span className="font-bold text-slate-500">Others</span>
                    </div>
                    <span className="font-black text-navy ml-1">815</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Fee Collection */}
              <div className="bg-white rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-[0_4px_16px_rgba(15,23,42,0.03)] flex flex-col justify-between min-h-[180px] sm:min-h-[220px]">
                <div className="text-left">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 block">
                    Fee Collection
                  </span>
                  <div className="flex flex-wrap items-baseline gap-1 mt-1">
                    <span className="font-display font-black text-sm sm:text-lg text-navy">
                      ₹ 12.45 Cr
                    </span>
                    <span className="bg-emerald-50 text-emerald-600 rounded px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black tracking-wide flex items-center gap-0.5">
                      +15.6%
                    </span>
                  </div>
                </div>

                {/* Line Chart SVG */}
                <div className="w-full h-14 sm:h-24 mt-2">
                  <svg className="w-full h-full" viewBox="0 0 200 80">
                    <defs>
                      <linearGradient
                        id="feeAreaGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3b82f6"
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor="#3b82f6"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <line
                      x1="0"
                      y1="20"
                      x2="200"
                      y2="20"
                      stroke="#f8fafc"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="50"
                      x2="200"
                      y2="50"
                      stroke="#f8fafc"
                      strokeWidth="1"
                    />
                    <path
                      d="M 10,70 L 10,65 L 45,55 L 80,45 L 115,25 L 150,42 L 190,15 L 190,70 Z"
                      fill="url(#feeAreaGrad)"
                    />
                    <path
                      d="M 10,65 L 45,55 L 80,45 L 115,25 L 150,42 L 190,15"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="10"
                      cy="65"
                      r="3"
                      fill="#3b82f6"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <circle
                      cx="45"
                      cy="55"
                      r="3"
                      fill="#3b82f6"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <circle
                      cx="80"
                      cy="45"
                      r="3"
                      fill="#3b82f6"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <circle
                      cx="115"
                      cy="25"
                      r="3"
                      fill="#3b82f6"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <circle
                      cx="150"
                      cy="42"
                      r="3"
                      fill="#3b82f6"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <circle
                      cx="190"
                      cy="15"
                      r="3"
                      fill="#3b82f6"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />

                    <text
                      x="10"
                      y="78"
                      fill="#94a3b8"
                      fontSize="8"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Jan
                    </text>
                    <text
                      x="45"
                      y="78"
                      fill="#94a3b8"
                      fontSize="8"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Feb
                    </text>
                    <text
                      x="80"
                      y="78"
                      fill="#94a3b8"
                      fontSize="8"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Mar
                    </text>
                    <text
                      x="115"
                      y="78"
                      fill="#94a3b8"
                      fontSize="8"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Apr
                    </text>
                    <text
                      x="150"
                      y="78"
                      fill="#94a3b8"
                      fontSize="8"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      May
                    </text>
                    <text
                      x="190"
                      y="78"
                      fill="#94a3b8"
                      fontSize="8"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Jun
                    </text>
                  </svg>
                </div>
              </div>

              {/* Card 3: Exam Performance */}
              <div className="bg-white rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-[0_4px_16px_rgba(15,23,42,0.03)] flex flex-col justify-between min-h-[180px] sm:min-h-[220px]">
                <div className="text-left">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 block">
                    Exam Performance
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold block mt-0.5">
                    Pass Percentage
                  </span>
                  <div className="flex flex-wrap items-baseline gap-1 mt-1">
                    <span className="font-display font-black text-sm sm:text-lg text-navy">
                      92.45%
                    </span>
                    <span className="bg-emerald-50 text-emerald-600 rounded px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black tracking-wide flex items-center gap-0.5">
                      +4.5%
                    </span>
                  </div>
                </div>

                {/* Bar Chart SVG */}
                <div className="w-full h-12 sm:h-20 mt-3">
                  <svg className="w-full h-full" viewBox="0 0 200 60">
                    <line
                      x1="0"
                      y1="15"
                      x2="200"
                      y2="15"
                      stroke="#f8fafc"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="35"
                      x2="200"
                      y2="35"
                      stroke="#f8fafc"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="55"
                      x2="200"
                      y2="55"
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />

                    <rect
                      x="15"
                      y="42"
                      width="12"
                      height="13"
                      rx="2"
                      fill="#3b82f6"
                    />
                    <rect
                      x="42"
                      y="32"
                      width="12"
                      height="23"
                      rx="2"
                      fill="#3b82f6"
                    />
                    <rect
                      x="69"
                      y="22"
                      width="12"
                      height="33"
                      rx="2"
                      fill="#3b82f6"
                    />
                    <rect
                      x="96"
                      y="28"
                      width="12"
                      height="27"
                      rx="2"
                      fill="#3b82f6"
                    />
                    <rect
                      x="123"
                      y="16"
                      width="12"
                      height="39"
                      rx="2"
                      fill="#3b82f6"
                    />
                    <rect
                      x="150"
                      y="8"
                      width="12"
                      height="47"
                      rx="2"
                      fill="#3b82f6"
                    />
                    <rect
                      x="177"
                      y="5"
                      width="12"
                      height="50"
                      rx="2"
                      fill="#3b82f6"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 4: Top Programs */}
              <div className="bg-white rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-[0_4px_16px_rgba(15,23,42,0.03)] flex flex-col justify-between min-h-[180px] sm:min-h-[220px]">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 mb-2 sm:mb-4 block text-left">
                  Top Programs
                </span>
                <div className="flex flex-col gap-2 sm:gap-3 flex-grow justify-center">
                  {/* B.Tech */}
                  <div className="flex items-center justify-between gap-1 sm:gap-3 text-[8px] sm:text-[11px]">
                    <span className="font-bold text-slate-500 w-7 sm:w-12 text-left">
                      B.Tech
                    </span>
                    <div className="flex-grow bg-slate-100 h-1 sm:h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2563eb] h-full rounded-full"
                        style={{ width: '85%' }}
                      />
                    </div>
                    <span className="font-black text-navy w-7 sm:w-10 text-right">
                      8,425
                    </span>
                  </div>

                  {/* B.Sc */}
                  <div className="flex items-center justify-between gap-1 sm:gap-3 text-[8px] sm:text-[11px]">
                    <span className="font-bold text-slate-500 w-7 sm:w-12 text-left">
                      B.Sc
                    </span>
                    <div className="flex-grow bg-slate-100 h-1 sm:h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2563eb] h-full rounded-full"
                        style={{ width: '65%' }}
                      />
                    </div>
                    <span className="font-black text-navy w-7 sm:w-10 text-right">
                      6,245
                    </span>
                  </div>

                  {/* MBA */}
                  <div className="flex items-center justify-between gap-1 sm:gap-3 text-[8px] sm:text-[11px]">
                    <span className="font-bold text-slate-500 w-7 sm:w-12 text-left">
                      MBA
                    </span>
                    <div className="flex-grow bg-slate-100 h-1 sm:h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2563eb] h-full rounded-full"
                        style={{ width: '45%' }}
                      />
                    </div>
                    <span className="font-black text-navy w-7 sm:w-10 text-right">
                      3,654
                    </span>
                  </div>

                  {/* M.Tech */}
                  <div className="flex items-center justify-between gap-1 sm:gap-3 text-[8px] sm:text-[11px]">
                    <span className="font-bold text-slate-500 w-7 sm:w-12 text-left">
                      M.Tech
                    </span>
                    <div className="flex-grow bg-slate-100 h-1 sm:h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2563eb] h-full rounded-full"
                        style={{ width: '30%' }}
                      />
                    </div>
                    <span className="font-black text-navy w-7 sm:w-10 text-right">
                      2,568
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
