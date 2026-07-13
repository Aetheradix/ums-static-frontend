import { SERVICES_CARDS } from '../../constants/data';

export default function ImportantServices() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 select-none">
      <div className="text-left mb-6">
        <h3 className="font-display font-black text-[#002147] text-xl md:text-2xl tracking-wide">
          Important Services
        </h3>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {SERVICES_CARDS.map((service, idx) => {
          const Icon = service.icon;
          return (
            <a
              key={idx}
              href="#"
              className="group bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Colored Circular Icon Container */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-2xs group-hover:scale-110 transition-transform duration-300 ${service.colorClass}`}
              >
                <Icon className="w-5 h-5 stroke-[1.5]" />
              </div>

              {/* Title */}
              <span className="text-[13px] font-bold text-navy group-hover:text-blue mt-4.5 transition-colors tracking-tight leading-snug">
                {service.label}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
