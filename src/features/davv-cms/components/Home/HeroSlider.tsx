import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <section className="relative w-full h-[380px] xs:h-[420px] md:h-[500px] lg:h-[580px] overflow-hidden bg-slate-900 select-none rounded-b-2xl md:rounded-b-3xl">
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
            className="w-full h-full object-cover object-center scale-102"
          />
          {/* Dark Overlay mask — darker on left side for text readability */}
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent" />

          {/* Slide Text Content overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full text-left flex flex-col items-start gap-3 md:gap-5">
              <div className="space-y-1 xs:space-y-2 max-w-2xl">
                <h2 className="font-display font-black text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight drop-shadow-lg">
                  {slide.title} <br />
                  <span className="text-[#F2A900]">{slide.highlight}</span>
                </h2>
                <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-lg font-medium leading-relaxed drop-shadow-md pt-2">
                  {slide.description}
                </p>
              </div>

              {/* Action Button */}
              <a
                href={slide.link}
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-[#F2A900] hover:bg-[#d99700] text-[#002147] font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
              >
                {slide.ctaText}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-xs transition-all z-25 hover:scale-105 border border-white/10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-xs transition-all z-25 hover:scale-105 border border-white/10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-25">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === current ? 'w-8 bg-[#F2A900]' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
}
