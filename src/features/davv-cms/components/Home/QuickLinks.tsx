import { QUICK_LINKS } from '../../constants/data';
import { useLanguage } from '../../../../shared/context/useLanguage';

const HOVER_GRADIENTS = [
  'linear-gradient(180deg, rgba(37,99,235,0) 0%, rgba(37,99,235,0.3) 100%)',
  'linear-gradient(180deg, rgba(16,185,129,0) 0%, rgba(16,185,129,0.3) 100%)',
  'linear-gradient(180deg, rgba(147,51,234,0) 0%, rgba(147,51,234,0.3) 100%)',
  'linear-gradient(180deg, rgba(217,119,6,0) 0%, rgba(217,119,6,0.3) 100%)',
  'linear-gradient(180deg, rgba(225,29,72,0) 0%, rgba(225,29,72,0.3) 100%)',
  'linear-gradient(180deg, rgba(6,182,212,0) 0%, rgba(6,182,212,0.3) 100%)',
  'linear-gradient(180deg, rgba(249,115,22,0) 0%, rgba(249,115,22,0.3) 100%)',
  'linear-gradient(180deg, rgba(236,72,153,0) 0%, rgba(236,72,153,0.3) 100%)',
];

export default function QuickLinks() {
  const { t } = useLanguage();

  return (
    <section className="max-w-[1400px] mx-auto px-0 sm:px-6 pt-0 pb-2 md:pb-3 select-none">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs dark:shadow-slate-900/50 overflow-hidden">
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 divide-x divide-y divide-slate-100 dark:divide-slate-700 sm:divide-y-0">
          {QUICK_LINKS.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                className="group relative flex flex-col items-center justify-center text-center p-3 sm:p-8 transition-all duration-300 overflow-hidden"
              >
                {/* Multicolor gradient overlay — slides up from bottom on hover */}
                <div
                  className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none"
                  style={{ background: HOVER_GRADIENTS[index] }}
                />

                {/* Outlined Icon with scale effect — multicolor */}
                <div
                  className={`relative w-8 h-8 sm:w-12 sm:h-12 rounded-xl ${link.colorClass} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xs`}
                >
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.5]" />
                </div>

                {/* Title */}
                <span className="relative text-[10px] sm:text-[13px] font-black text-navy dark:text-slate-100 group-hover:text-blue dark:group-hover:text-blue mt-1.5 sm:mt-4.5 transition-colors tracking-tight">
                  {t(link.label)}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
