import { clsx } from 'clsx';

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export default function SectionTitle({
  badge,
  title,
  subtitle,
  center = false,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={clsx(
        'mb-6 md:mb-12 max-w-4xl',
        center ? 'text-center mx-auto' : 'text-left',
        className
      )}
    >
      {badge && (
        <span className="inline-block px-3 py-1 bg-blue-light text-blue text-[10px] font-black uppercase tracking-[0.2em] rounded-md mb-3 md:mb-4 border border-blue/10">
          {badge}
        </span>
      )}
      <h2 className="font-display text-[22px] sm:text-3xl md:text-4xl font-bold text-navy leading-tight mb-2 md:mb-4">
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            'text-muted text-[13.5px] sm:text-base leading-relaxed max-w-2xl',
            center && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
