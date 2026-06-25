import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useGSAPAnimations() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Kill existing triggers to avoid memory leaks and ghost animations
    ScrollTrigger.getAll().forEach(t => t.kill());

    const timeoutId = setTimeout(() => {
      // 1. Navbar shrink
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'navbar--scrolled', targets: '.navbar' },
      });

      // Home Page specific animations
      if (pathname === '/') {
        // Comparison table rows
        const tableRows = document.querySelectorAll('#comparison tr');
        if (tableRows.length) {
          gsap.from(tableRows, {
            opacity: 0,
            x: -30,
            stagger: 0.03,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#comparison table',
              start: 'top 75%',
            },
          });
        }

        // 6. HomeCTA parallax
        const ctaSection = document.querySelector('#home-cta');
        if (ctaSection) {
          gsap.to(ctaSection.querySelector('.bg-dots'), {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: ctaSection,
              scrub: true,
            },
          });
        }
      }

      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [pathname]);
}
