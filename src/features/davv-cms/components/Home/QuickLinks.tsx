import { QUICK_LINKS } from '../../constants/data';

export default function QuickLinks() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-16 select-none">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 divide-x divide-y divide-slate-100 sm:divide-y-0">
          {QUICK_LINKS.map(link => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                className="group flex flex-col items-center justify-center text-center p-6 sm:p-8 hover:bg-slate-50 transition-all duration-300 relative"
              >
                {/* Outlined Icon with scale effect */}
                <div className="w-12 h-12 rounded-xl bg-blue/5 text-[#002147] flex items-center justify-center group-hover:scale-110 group-hover:text-blue transition-all duration-300 shadow-2xs">
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>

                {/* Title */}
                <span className="text-[13px] font-bold text-navy group-hover:text-blue mt-4.5 transition-colors tracking-tight">
                  {link.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
