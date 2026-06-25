import { HERO_CONTENT } from '../../../constants/data';
import Button from '../../ui/Button';
import { lazy, Suspense } from 'react';

const HeroCanvas = lazy(() => import('../../../canvas/HeroCanvas'));

export default function Hero() {
  const titleLetters = 'OCTAGON'.split('');

  return (
    <section className="relative min-h-[85vh] flex items-center pt-36 md:pt-40 lg:pt-44 xl:pt-48 pb-12 overflow-hidden bg-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-light/50 via-white to-white opacity-80" />

      {/* Three.js Background */}
      <Suspense fallback={null}>
        <HeroCanvas />
      </Suspense>

      <div className="max-w-[1400px] mx-auto px-4 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="w-full lg:w-[48%] xl:w-[45%] text-left">
            <div className="flex flex-row items-center flex-wrap gap-4 mb-6 reveal">
              {/* Extra Small Animated Letters Effect */}
              <div className="flex flex-row flex-wrap gap-1">
                {titleLetters.map((letter, index) => (
                  <div
                    key={index}
                    className="animate-flip-pop opacity-0"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className="
                      relative flex items-center justify-center overflow-hidden
                      w-5 h-7 sm:w-6 sm:h-8
                      bg-gradient-to-b from-cyan-500 to-blue-600
                      text-white font-black text-xs sm:text-sm
                      rounded shadow-sm
                      border-b-[1.5px] border-blue-800
                    "
                    >
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                      <div
                        className="absolute top-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 pointer-events-none z-10"
                        style={{
                          animation: `recurringGlass 3s infinite`,
                          animationDelay: `${index * 0.1}s`,
                          opacity: 0,
                        }}
                      ></div>
                      <span
                        className="drop-shadow-sm z-20 inline-block relative"
                        style={{
                          animation: `recurringFlip 3s infinite ease-in-out`,
                          animationDelay: `${index * 0.1}s`,
                        }}
                      >
                        {letter}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-light border border-blue/10 rounded">
                <span className="w-1 h-1 rounded-full bg-blue animate-pulse" />
                <span className="text-[7px] sm:text-[8px] font-black text-blue uppercase tracking-widest">
                  {HERO_CONTENT.badge}
                </span>
              </div>
            </div>

            <h1 className="font-display text-[26px] sm:text-3xl md:text-4xl lg:text-[2.35rem] xl:text-[2.75rem] 2xl:text-5xl font-black text-navy leading-[1.15] mb-3 reveal delay-1">
              India's Next-Generation
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue to-accent">
                University ERP
              </span>
            </h1>

            <p className="text-muted text-base md:text-lg lg:text-lg xl:text-xl leading-relaxed max-w-xl mb-6 md:mb-10 reveal delay-1">
              {HERO_CONTENT.sub}
            </p>

            <div className="flex flex-row gap-2.5 sm:gap-4 reveal delay-2">
              <Button
                href="/solutions"
                size="sm"
                className="px-4 py-2.5 sm:px-8 sm:py-3.5 !text-[10px] sm:!text-base shadow-lg shadow-blue/10"
              >
                {HERO_CONTENT.cta1}
              </Button>
              <Button
                href="/contact"
                size="sm"
                variant="outline"
                className="px-4 py-2.5 sm:px-8 sm:py-3.5 !text-[10px] sm:!text-base border-navy text-navy hover:bg-navy hover:text-white"
              >
                {HERO_CONTENT.cta2}
              </Button>
            </div>
          </div>

          {/* Right Content: Hero Image */}
          <div className="w-full lg:w-[52%] xl:w-[55%] h-full flex justify-center lg:justify-end reveal delay-4">
            <div className="relative w-full max-w-[900px] animate-float lg:translate-x-4 xl:translate-x-8 2xl:translate-x-12 lg:scale-100 xl:scale-105 2xl:scale-110 origin-right">
              {/* Main Dashboard Image */}
              <img
                src="/hero.png"
                alt="OCTAGON ERP Dashboard"
                fetchPriority="high"
                className="w-full h-auto object-contain relative z-20 drop-shadow-[0_20px_50px_rgba(59,130,246,0.15)]"
              />

              {/* Decorative blobs for depth behind the image */}
              <div className="absolute top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-[80px] pointer-events-none z-0" />
              <div className="absolute bottom-10 -left-10 w-56 h-56 bg-blue/20 rounded-full blur-[100px] pointer-events-none z-0" />
            </div>
          </div>
        </div>
      </div>
      {/* Keyframe animations are defined in globals.css */}
    </section>
  );
}
