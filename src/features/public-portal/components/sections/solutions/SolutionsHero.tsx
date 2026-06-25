export default function SolutionsHero() {
  return (
    <section className="relative bg-blue-50 pt-28 md:pt-40 pb-8 md:pb-16 overflow-hidden border-b border-border">
      {/* Geometric Pattern SVG */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none text-navy">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="octagons"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#octagons)" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 relative z-10 text-center">
        <nav className="mb-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted">
          <span>Home</span>
          <span className="mx-3 opacity-50">/</span>
          <span className="text-navy">Solutions</span>
        </nav>

        <h1 className="font-display text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-black text-navy mb-4 leading-tight">
          Complete University <br className="hidden md:inline" /> ERP Solutions
        </h1>

        <p className="text-muted text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-6 md:mb-8 px-2">
          43+ sub-modules across 5 core modules — every workflow, every
          department, one platform.
        </p>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          <StatPill label="43+ Sub-Modules" />
          <StatPill label="5 Modules" />
          <StatPill label="1 Platform" />
        </div>
      </div>
    </section>
  );
}

function StatPill({ label }: { label: string }) {
  return (
    <div className="px-3 py-1 md:px-4 md:py-1.5 rounded-md border border-border bg-surface text-navy font-bold text-[10px] md:text-[11px] uppercase tracking-wider shadow-sm">
      {label}
    </div>
  );
}
