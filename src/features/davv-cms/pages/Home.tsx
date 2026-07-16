import { useEffect } from 'react';
import AdmissionStepper from '../components/Home/AdmissionStepper';
import AnnouncementsAndLinks from '../components/Home/AnnouncementsAndLinks';
import CampusLifeBanner from '../components/Home/CampusLifeBanner';
import ExploreSlider from '../components/Home/ExploreSlider';
import HeroSlider from '../components/Home/HeroSlider';
import ImportantServices from '../components/Home/ImportantServices';
import NewsAndEvents from '../components/Home/NewsAndEvents';
import QuickLinks from '../components/Home/QuickLinks';
import StatsBanner from '../components/Home/StatsBanner';
import VCAndRecruiters from '../components/Home/VCAndRecruiters';
import CMSLayout from '../layouts/CMSLayout';

export default function Home() {
  useEffect(() => {
    document.title = 'Devi Ahilya Vishwavidyalaya, Indore (DAVV) | Portal';
  }, []);

  return (
    <CMSLayout>
      {/* 1. Hero + Quick Links (overlapping) */}
      <div className="relative">
        <HeroSlider />

        {/* 2. Quick Links — overlays bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-2/3 px-4 sm:px-6">
          <QuickLinks />
        </div>
      </div>

      {/* 4. Announcements and Important Links Section */}
      <div className="bg-slate-100 dark:bg-slate-950 py-2 sm:py-4 pt-28 xs:pt-32 sm:pt-36 md:pt-40 transition-colors duration-300">
        <AnnouncementsAndLinks />
      </div>

      {/* 5. Explore DAVV Slider Cards */}
      <div className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800/80 py-2 sm:py-4 transition-colors duration-300">
        <ExploreSlider />
      </div>

      {/* 6. Statistics Glance Banner */}
      <div className="bg-slate-100 dark:bg-slate-950 py-2 sm:py-4 transition-colors duration-300">
        <StatsBanner />
      </div>

      {/* 7 & 8. Admission Process Stepper & Important Services */}
      <div className="bg-white dark:bg-slate-900 py-4 sm:py-8 border-y border-slate-100 dark:border-slate-800/80 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdmissionStepper />
          </div>
          <div className="lg:col-span-1">
            <ImportantServices />
          </div>
        </div>
      </div>

      {/* 9. News & Upcoming Events Section */}
      <div className="relative border-y border-[#002147] dark:border-slate-800/80 py-4 sm:py-6 overflow-hidden">
        {/* Solid primary background */}
        <div className="absolute inset-0 bg-[#002147] dark:bg-slate-950/90 transition-colors duration-300" />
        {/* DAVV image overlay — fixed background so it stays in place, never scrolls */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'url(/DAVV_Uni.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        {/* Content */}
        <div className="relative z-10">
          <NewsAndEvents />
        </div>
      </div>

      {/* 10. Vice Chancellor & Top Recruiters Section */}
      <div className="bg-slate-100 dark:bg-slate-950 py-2 sm:py-4 transition-colors duration-300">
        <VCAndRecruiters />
      </div>

      {/* 11. Campus Life Video Tour Banner */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 py-2 sm:py-4 transition-colors duration-300">
        <CampusLifeBanner />
      </div>
    </CMSLayout>
  );
}
