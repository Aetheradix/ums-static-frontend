import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isFading, setIsFading] = useState(false);

  const handleVideoEnd = () => {
    setIsFading(true);
    // Wait for the CSS fade transition to finish before removing the component completely
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  // Fallback timeout in case video fails to auto-play or load (e.g. strict browser policies)
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      handleVideoEnd();
    }, 5000); // 5 seconds max wait

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div
      className={clsx(
        'fixed inset-0 z-999999 bg-navy flex items-center justify-center transition-opacity duration-700 ease-in-out',
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
    >
      <video
        src="/Title_Octagon_The_Pillars.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        onError={handleVideoEnd}
        className="w-full h-full object-contain md:object-cover scale-105"
      />

      <button
        onClick={handleVideoEnd}
        className="absolute bottom-10 right-10 text-white/50 hover:text-white text-[10px] font-black tracking-[0.2em] uppercase transition-colors"
      >
        Skip Intro
      </button>
    </div>
  );
}
