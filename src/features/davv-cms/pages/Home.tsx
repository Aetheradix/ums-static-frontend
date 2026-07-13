import { useEffect } from 'react';
import CMSLayout from '../layouts/CMSLayout';
import HeroSlider from '../components/Home/HeroSlider';
import SearchBarOverlay from '../components/Home/SearchBarOverlay';
import QuickLinks from '../components/Home/QuickLinks';
import AnnouncementsAndLinks from '../components/Home/AnnouncementsAndLinks';
import StatsBanner from '../components/Home/StatsBanner';
import ExploreSlider from '../components/Home/ExploreSlider';
import AdmissionStepper from '../components/Home/AdmissionStepper';
import ImportantServices from '../components/Home/ImportantServices';
import NewsAndEvents from '../components/Home/NewsAndEvents';
import VCAndRecruiters from '../components/Home/VCAndRecruiters';
import CampusLifeBanner from '../components/Home/CampusLifeBanner';

export default function Home() {
  useEffect(() => {
    document.title = 'Devi Ahilya Vishwavidyalaya, Indore (DAVV) | Portal';
  }, []);

  return (
    <CMSLayout>
      {/* 1. Hero Campus Slider */}
      <HeroSlider />

      {/* 2. Floating Search Bar Overlay */}
      <div className="bg-white pb-6">
        <SearchBarOverlay />
      </div>

      {/* 3. Quick Links Section */}
      <div className="bg-white border-b border-slate-100">
        <QuickLinks />
      </div>

      {/* 4. Announcements and Important Links Section */}
      <div className="bg-slate-50 py-4">
        <AnnouncementsAndLinks />
      </div>

      {/* 5. Statistics Glance Banner */}
      <div className="bg-white border-y border-slate-100 py-4">
        <StatsBanner />
      </div>

      {/* 6. Explore DAVV Slider Cards */}
      <div className="bg-slate-50 py-4">
        <ExploreSlider />
      </div>

      {/* 7. Admission Process Stepper */}
      <div className="bg-white border-y border-slate-100 py-4">
        <AdmissionStepper />
      </div>

      {/* 8. Important Services Section */}
      <div className="bg-slate-50 py-4">
        <ImportantServices />
      </div>

      {/* 9. News & Upcoming Events Section */}
      <div className="bg-white border-y border-slate-100 py-4">
        <NewsAndEvents />
      </div>

      {/* 10. Vice Chancellor & Top Recruiters Section */}
      <div className="bg-slate-50 py-4">
        <VCAndRecruiters />
      </div>

      {/* 11. Campus Life Video Tour Banner */}
      <div className="bg-white border-t border-slate-100 py-4">
        <CampusLifeBanner />
      </div>
    </CMSLayout>
  );
}
