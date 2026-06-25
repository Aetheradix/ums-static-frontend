import { useRef } from 'react';

export default function OurClients() {
  const logos = [
    '/university-logo/1.png',
    '/university-logo/2.png',
    '/university-logo/3.png',
    '/university-logo/4.png',
    '/university-logo/5.png',
    '/university-logo/6.png',
    '/university-logo/7.png',
    '/university-logo/8.png',
    '/university-logo/9.png',
    '/university-logo/10.png',
  ];

  // Double the list for a seamless loop
  const list = [...logos, ...logos];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? -120 : -240;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 120 : 240;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="our-clients"
      className="w-full relative py-5 md:py-10 bg-cover bg-center overflow-hidden min-h-[180px] md:min-h-[330px] flex items-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]"
      style={{ backgroundImage: "url('/OurClients.png')" }}
    >
      {/* Light gradient overlay to blend corners nicely */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-12 mt-12 sm:mt-16 md:mt-[7rem] relative z-10">
        <div className="w-full md:w-[85%] lg:w-[78%] xl:w-[68%] flex items-center justify-center md:justify-start">
          {/* Glassmorphic Carousel Container */}
          <div className="w-full bg-white/75 backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(15,23,42,0.06)] border border-white/60 p-1.5 sm:p-3 flex items-center gap-1.5 sm:gap-4">
            {/* Left Arrow Button */}
            <button
              onClick={handlePrev}
              className="w-7 h-7 sm:w-11 sm:h-11 rounded-full bg-white shadow-sm border border-slate-100 hover:border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-blue hover:scale-105 active:scale-95 transition-all duration-300 flex-shrink-0 cursor-pointer z-10"
              aria-label="Previous logo page"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5 sm:w-5 sm:h-5"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Scrolling Area Container */}
            <div className="flex-grow overflow-hidden relative select-none mask-gradient">
              <div
                ref={scrollContainerRef}
                className="animate-client-marquee flex gap-3 sm:gap-6 items-center py-1.5 sm:py-2"
                style={{ width: 'max-content' }}
              >
                {list.map((logoUrl, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white shadow-[0_3px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)] hover:scale-105 transition-all duration-300 border border-slate-100/80 flex-shrink-0 flex items-center justify-center relative group p-1.5 sm:p-2.5 overflow-hidden"
                  >
                    <img
                      src={logoUrl}
                      alt={`University logo ${idx + 1}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={handleNext}
              className="w-7 h-7 sm:w-11 sm:h-11 rounded-full bg-white shadow-sm border border-slate-100 hover:border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-blue hover:scale-105 active:scale-95 transition-all duration-300 flex-shrink-0 cursor-pointer z-10"
              aria-label="Next logo page"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5 sm:w-5 sm:h-5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes clientMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-client-marquee {
          animation: clientMarquee 25s linear infinite;
        }
        .animate-client-marquee:hover {
          animation-play-state: paused;
        }
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%);
        }
      `}</style>
    </section>
  );
}
