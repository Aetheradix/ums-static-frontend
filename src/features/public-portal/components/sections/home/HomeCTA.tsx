import Button from '../../ui/Button';

export default function HomeCTA() {
  return (
    <section className="md:py-12 py-5 px-4 overflow-hidden">
      <div className="max-w-[1400px] mx-auto reveal-scale">
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30 px-5 py-7 sm:px-8 sm:py-8 md:px-12 md:py-9 overflow-hidden shadow-sm border border-slate-200/60">
          {/* Subtle Grid Dot Background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #0F172A 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Ambient Corner Blur Glows */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-500/[0.04] rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-500/[0.04] rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
            {/* Text Information Column */}
            <div className="max-w-2xl">
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-navy mb-2 leading-tight">
                Ready to Transform Your University?
              </h2>
              <p className="text-muted text-xs sm:text-[13px] leading-relaxed max-w-xl mx-auto md:mx-0">
                Join universities across India choosing OCTAGON for their
                digital future. Experience the next generation of academic
                governance.
              </p>
            </div>

            {/* Action Buttons Column */}
            <div className="flex flex-row justify-center md:justify-end gap-2 sm:gap-3 w-full md:w-auto shrink-0">
              <Button
                href="/contact"
                size="sm"
                variant="primary"
                className="flex-1 sm:flex-initial px-2 sm:px-6 font-black text-[7px] sm:text-xs h-8 sm:h-9 justify-center whitespace-nowrap"
              >
                Request a Demo
              </Button>
              <Button
                href="/solutions"
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-initial px-2 sm:px-6 font-black text-[7px] sm:text-xs h-8 sm:h-9 justify-center whitespace-nowrap"
              >
                View All Modules
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
