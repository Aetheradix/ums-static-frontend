import { useEffect, useState } from 'react';
import { GLANCE_STATS } from '../../constants/data';
import { useLanguage } from '../../../../shared/context/useLanguage';

function Counter({ value }: { value: string }) {
  const [count, setCount] = useState(0);

  // Extract the numeric portion and suffix
  const match = value.match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : '';
  const isDecimal = match ? match[1].includes('.') : false;

  useEffect(() => {
    // Determine a reasonable start value
    let start = 0;
    if (target > 1000) {
      start = target - 150; // for years like 1964, start from 1814
    } else if (target > 100) {
      start = 0;
    }

    const duration = 1500; // 1.5s animation duration
    const startTime = performance.now();
    let frameId: number;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutQuad)
      const ease = progress * (2 - progress);
      const current = start + (target - start) * ease;

      setCount(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [target]);

  const formattedCount = isDecimal ? count.toFixed(1) : Math.floor(count);

  return (
    <span>
      {formattedCount}
      {suffix}
    </span>
  );
}

export default function StatsBanner() {
  const { t } = useLanguage();

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-3 sm:pb-8 select-none">
      <div className="flex flex-col items-center mb-6">
        <h3 className="font-display font-black text-[#002147] dark:text-white text-xl md:text-2xl tracking-wide mb-2">
          {t('DAVV at a Glance')}
        </h3>
        <div className="w-12 h-1 bg-[#F2A900] rounded-full" />
      </div>

      <div className="bg-[#002147] dark:bg-slate-950/85 text-white rounded-2xl p-5 sm:p-8 md:p-10 shadow-lg relative overflow-hidden transition-colors duration-300">
        {/* Subtle decorative background blur shapes */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center">
          {/* Stats Grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-4 lg:divide-x lg:divide-white/10">
            {GLANCE_STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center text-center px-2 sm:px-4 space-y-2 lg:first:pl-0"
                >
                  {/* Icon */}
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 text-white flex items-center justify-center shadow-xs border border-white/5">
                    <Icon className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[1.5]" />
                  </div>

                  {/* Value */}
                  <div className="font-display font-black text-[#F2A900] text-xl sm:text-3xl md:text-4xl tracking-tight">
                    <Counter value={stat.value} />
                  </div>

                  {/* Label */}
                  <div className="text-white/80 text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide uppercase leading-tight">
                    {t(stat.label)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
