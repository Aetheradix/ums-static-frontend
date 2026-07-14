import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const SLIDES = [
  {
    image: '/davv-cms/crousel/Slide1.jpg',
    title: 'Nurturing Minds',
    highlight: 'Empowering Futures',
    description:
      'Devi Ahilya Vishwavidyalaya, Indore is committed to excellence in teaching, research and innovation for a better tomorrow.',
    ctaText: 'Know More About DAVV',
    link: '#',
  },
  {
    image: '/davv-cms/crousel/Slide2.jpg',
    title: 'Gateway to Knowledge',
    highlight: 'NEP 2020 Compliant',
    description:
      'Empowering students with holistic development, skills-oriented training, and integrated DigiLocker certifications.',
    ctaText: 'Explore Admissions',
    link: '#',
  },
  {
    image: '/davv-cms/crousel/Slide3.jpg',
    title: 'Campus Life',
    highlight: 'Excellence in Education',
    description:
      'Experience world-class infrastructure, vibrant campus culture and holistic learning environment at DAVV.',
    ctaText: 'Explore Campus',
    link: '#',
  },
  {
    image: '/davv-cms/crousel/Slide4.jpg',
    title: 'Research & Innovation',
    highlight: 'Shaping Tomorrow',
    description:
      'DAVV fosters cutting-edge research, innovation and entrepreneurship across all disciplines.',
    ctaText: 'Research at DAVV',
    link: '#',
  },
  {
    image: '/davv-cms/crousel/Slide5.jpg',
    title: 'Global Connect',
    highlight: 'International Collaborations',
    description:
      'DAVV has established strong international partnerships for academic exchange and collaborative research.',
    ctaText: 'Global Outreach',
    link: '#',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent(prev => (prev + 1) % SLIDES.length);
  };

  return (
    <section className="relative w-full h-[380px] xs:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden bg-slate-900 select-none rounded-b-2xl md:rounded-b-3xl">
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Background image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center scale-102 dark:opacity-70 dark:brightness-75 transition-all duration-300"
          />
        </div>
      ))}

      {/* Combined Controls & Indicators Pill - Mobile Only */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-25 md:hidden flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 shadow-xl transition-all duration-300">
        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="text-white/70 hover:text-white p-0.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Dot Indicators */}
        <div className="flex items-center gap-1 px-2 border-x border-white/10">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                index === current
                  ? 'w-3 bg-[#F2A900]'
                  : 'w-1 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="text-white/70 hover:text-white p-0.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Desktop Controls (Left & Right Side Arrows) */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-25 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-black/35 hover:bg-black/55 text-white border border-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-25 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-black/35 hover:bg-black/55 text-white border border-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Desktop Simple Indicator Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-25 hidden md:flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 shadow-md">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === current
                ? 'w-4 bg-[#F2A900]'
                : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
