import React, { Suspense, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useLenis from '../hooks/useLenis';
import useScrollReveal from '../hooks/useScrollReveal';
import useGSAPAnimations from '../hooks/useGSAPAnimations';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollProgress from '../components/ui/ScrollProgress';
import BackToTop from '../components/ui/BackToTop';
import Preloader from '../components/ui/Preloader';
import { UniversityLoader } from 'shared/components/progress';

export function PublicRouteWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useScrollReveal();
  useGSAPAnimations();
  return <>{children}</>;
}

export default function PublicPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showPreloader, setShowPreloader] = useState(() => {
    return !sessionStorage.getItem('octagon_intro_seen');
  });

  useLenis();

  useEffect(() => {
    if (sessionStorage.getItem('just_logged_out') === 'true') {
      sessionStorage.removeItem('just_logged_out');
      navigate('/home');
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Enable clean public page scroll settings
    document.documentElement.classList.add('public-portal-active');
    document.body.classList.add('public-portal-active');

    return () => {
      // Restore standard dashboard scroll settings on unmount
      document.documentElement.classList.remove('public-portal-active');
      document.body.classList.remove('public-portal-active');
    };
  }, []);

  useEffect(() => {
    if (showPreloader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('resize'));
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPreloader]);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    sessionStorage.setItem('octagon_intro_seen', 'true');
  };

  if (sessionStorage.getItem('just_logged_out') === 'true') {
    return <UniversityLoader bgTransparent={true} text="Redirecting..." />;
  }

  return (
    <div className="octagon-theme min-h-screen relative bg-white text-navy selection:bg-blue-100 selection:text-blue-700">
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      <ScrollProgress />
      <Navbar />
      <Suspense
        fallback={<UniversityLoader bgTransparent={true} text="Loading..." />}
      >
        {children}
      </Suspense>
      <Footer />
      <BackToTop />
    </div>
  );
}
