import { GLANCE_STATS } from '../../constants/data';

export default function StatsBanner() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 select-none">
      <div className="bg-[#002147] text-white rounded-2xl p-8 md:p-10 shadow-lg relative overflow-hidden">
        {/* Subtle decorative background blur shapes */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center">
          <h3 className="font-display font-black text-white text-xl md:text-2xl uppercase tracking-wider mb-10">
            DAVV at a Glance
          </h3>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 lg:divide-x lg:divide-white/10">
            {GLANCE_STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center text-center px-4 space-y-3 lg:first:pl-0"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center shadow-xs border border-white/5">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>

                  {/* Value */}
                  <div className="font-display font-black text-[#F2A900] text-3xl md:text-4xl tracking-tight">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-white/80 text-xs md:text-sm font-semibold tracking-wide uppercase">
                    {stat.label}
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
