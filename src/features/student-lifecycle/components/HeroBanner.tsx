import type { ReactNode } from 'react';

interface HeroBannerProps {
  className?: string;
  children: ReactNode;
}

export function HeroBanner({ className = '', children }: HeroBannerProps) {
  return (
    <section
      className={`relative overflow-hidden text-white rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 bg-linear-to-r from-slate-900 via-indigo-950 to-blue-900 ${className}`}
    >
      {/* Decorative subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
