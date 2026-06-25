import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!barRef.current) return;
        const scrollY = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;

        // Calculate progress (0 to 1)
        const progress = docHeight > 0 ? scrollY / docHeight : 0;

        // Use hardware-accelerated transform instead of width
        barRef.current.style.transform = `scaleX(${progress})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial set

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 h-[3px] w-full bg-blue z-[9999] origin-left will-change-transform"
      style={{ transform: 'scaleX(0)' }}
    />
  );
}
