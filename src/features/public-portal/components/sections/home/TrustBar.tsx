import { useEffect, useState, useRef } from 'react';

interface CounterProps {
  value: string;
}

function StatCounter({ value }: CounterProps) {
  // Parse numeric parts upfront — used for both initial state and animation
  const match = value.match(/^([0-9.]+)(.*)$/);
  const numStr = match?.[1];
  const suffix = match?.[2] ?? '';
  const targetVal = numStr ? parseFloat(numStr) : NaN;
  const isFloat = numStr?.includes('.') ?? false;
  const decimals = isFloat ? (numStr!.split('.')[1]?.length ?? 0) : 0;
  const isAnimatable = match !== null && !isNaN(targetVal);

  const initialDisplay = isAnimatable ? (0).toFixed(decimals) + suffix : value;

  const [displayValue, setDisplayValue] = useState(initialDisplay);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isAnimatable) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          const duration = 2000; // 2 seconds
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeProgress * targetVal;

            setDisplayValue(currentVal.toFixed(decimals) + suffix);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(value); // Ensure exact final value is set at the end
            }
          };

          requestAnimationFrame(animate);
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, hasAnimated, isAnimatable, targetVal, decimals, suffix]);

  return <span ref={elementRef}>{displayValue}</span>;
}

export default function TrustBar() {
  const stats = [
    {
      value: '43+',
      label: 'Enterprise Modules',
      bgClass: 'bg-blue/15 text-blue-400',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      value: '100+',
      label: 'Automated Workflows',
      bgClass: 'bg-emerald-500/15 text-emerald-400',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <circle cx="12" cy="5" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <path d="M12 7.5v5M10.5 14l-3 2.5M13.5 14l3 2.5" />
          <circle cx="12" cy="14.5" r="2" />
        </svg>
      ),
    },
    {
      value: '500K+',
      label: 'Active Users',
      bgClass: 'bg-amber-500/15 text-amber-400',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      value: '50+',
      label: 'Institutions',
      bgClass: 'bg-red-500/15 text-red-400',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M3 22V8.5L12 3l9 5.5V22" />
          <path d="M9 22v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
          <path d="M8 10h8" />
          <path d="M8 14h8" />
        </svg>
      ),
    },
    {
      value: '99.9%',
      label: 'System Uptime',
      bgClass: 'bg-purple-500/15 text-purple-400',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      value: '24/7',
      label: 'Support',
      bgClass: 'bg-indigo-500/15 text-indigo-400',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full bg-navy border-y border-white/10 py-6 md:py-8 -mt-4 md:-mt-8 relative z-20 reveal overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)]">
      {/* Subtle background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-blue/15 via-transparent to-transparent blur-[60px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4">
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-4 justify-items-center items-center divide-white/5 lg:divide-x">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 w-full max-w-[210px] px-2 lg:px-4 group hover:-translate-y-0.5 transition-transform duration-300 ease-out cursor-default"
            >
              {/* Icon Circle */}
              <div
                className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${item.bgClass}`}
              >
                {item.icon}
              </div>

              {/* Text Content */}
              <div className="flex flex-col min-w-0">
                <span className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-none">
                  <StatCounter value={item.value} />
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1 leading-snug group-hover:text-white transition-colors duration-300">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
