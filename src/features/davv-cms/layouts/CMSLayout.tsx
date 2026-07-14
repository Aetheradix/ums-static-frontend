import React, { useState, useEffect } from 'react';
import Topbar from '../components/Navigation/Topbar';
import Navbar from '../components/Navigation/Navbar';
import Footer from '../components/Navigation/Footer';
import FloatingBar from '../components/Navigation/FloatingBar';
import { ArrowUp } from 'lucide-react';

interface CMSLayoutProps {
  children: React.ReactNode;
}

export default function CMSLayout({ children }: CMSLayoutProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as any;
      let scrollPos = 0;
      if (target === document || target === window || !target) {
        scrollPos =
          window.scrollY ||
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
      } else {
        // Only trigger scroll-to-top for main page containers.
        // Ignore sub-lists like the announcements marquee, dropdowns, etc.
        const isMainElement =
          target.id === 'root' ||
          target.tagName === 'BODY' ||
          target.tagName === 'HTML' ||
          target.classList?.contains('main-scroll-container');

        if (isMainElement) {
          scrollPos = (target as HTMLElement).scrollTop || 0;
        } else {
          return; // Ignore sub-scrolling elements
        }
      }
      setShowScrollTop(scrollPos > 300);
    };

    window.addEventListener('scroll', handleScroll, true);

    const initialPos =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    setShowScrollTop(initialPos > 300);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const scrollToTop = () => {
    const scrollOptions: ScrollToOptions = {
      top: 0,
      behavior: 'smooth',
    };

    window.scrollTo(scrollOptions);
    document.documentElement.scrollTo(scrollOptions);
    document.body.scrollTo(scrollOptions);

    // Also target #root and any other active scroll container
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.scrollTo(scrollOptions);
    }

    const scrollableEl = document.querySelector('.overflow-y-auto');
    if (scrollableEl) {
      scrollableEl.scrollTo(scrollOptions);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-navy">
      {/* Navigation Headers */}
      <Topbar />
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-20">{children}</main>

      {/* Premium Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 p-2 sm:p-3 rounded-full bg-[#002147] hover:bg-blue text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 border border-white/10 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      )}

      {/* Floating Actions Sidebar Bar */}
      <FloatingBar />
    </div>
  );
}
