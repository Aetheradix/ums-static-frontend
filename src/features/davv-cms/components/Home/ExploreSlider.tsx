import { EXPLORE_CARDS } from '../../constants/data';

export default function ExploreSlider() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 select-none">
      <div className="text-center mb-8">
        <h3 className="font-display font-black text-[#002147] text-xl md:text-2xl tracking-wide">
          Explore DAVV
        </h3>
      </div>

      {/* Grid container representing the cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {EXPLORE_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-1 relative"
            >
              {/* Image Container */}
              <div className="relative h-32 md:h-36 overflow-hidden z-0">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>

              {/* Outlined Icon overlay hanging half outside bottom edge of image */}
              <div className="absolute top-[108px] md:top-[124px] left-4 z-20 w-10 h-10 rounded-xl bg-[#002147] group-hover:bg-blue text-white flex items-center justify-center shadow-md border border-white/20 transition-colors">
                <Icon className="w-5 h-5" />
              </div>

              {/* Title Content */}
              <div className="p-5 pt-8 bg-white flex-1 flex items-center z-10">
                <h4 className="font-display font-black text-navy text-[13px] md:text-sm tracking-tight leading-snug group-hover:text-blue transition-colors">
                  {card.title}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
