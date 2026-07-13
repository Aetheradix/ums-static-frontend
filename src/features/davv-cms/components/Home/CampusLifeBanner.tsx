import { Play } from 'lucide-react';

export default function CampusLifeBanner() {
  const handlePlayVideo = () => {
    // Action trigger for video tour playback
    console.log('Play campus tour video triggered');
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 select-none">
      <div className="relative w-full h-[220px] sm:h-[260px] md:h-[280px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 z-0 group">
        {/* Background Campus Image */}
        <img
          src="/DAVV_Uni.jpg"
          alt="DAVV Campus Pathway"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
        />

        {/* Navy Blue Gradient Overlay fading to right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#002147] via-[#002147]/80 to-transparent z-10" />

        {/* Content Wrapper */}
        <div className="absolute inset-0 flex items-center z-20 px-6 sm:px-12 md:px-16">
          <div className="max-w-md md:max-w-xl text-left flex flex-col items-start gap-4">
            <div className="space-y-1 md:space-y-2">
              <h3 className="font-display font-black text-white text-xl sm:text-2xl md:text-3xl leading-tight">
                Campus Life @ DAVV
              </h3>
              <p className="text-white/85 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                A vibrant campus that inspires learning, creativity and holistic
                development.
              </p>
            </div>

            {/* Play Button Action Trigger */}
            <button
              onClick={handlePlayVideo}
              className="flex items-center gap-3.5 group/btn cursor-pointer"
            >
              {/* Circular play icon */}
              <div className="w-10 h-10 rounded-full bg-white text-[#002147] flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform">
                <Play className="w-4.5 h-4.5 fill-current stroke-0 ml-0.5" />
              </div>
              {/* Dark pill label */}
              <div className="px-5 py-2.5 rounded-full bg-black/40 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-white/10 group-hover/btn:bg-black/60 transition-colors">
                Watch Campus Video
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
