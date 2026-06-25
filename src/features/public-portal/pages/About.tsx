import { useEffect } from 'react';
import AboutHero from '../components/sections/about/AboutHero';
import CompanyStory from '../components/sections/about/CompanyStory';
import MissionVision from '../components/sections/about/MissionVision';
import HomeCTA from '../components/sections/home/HomeCTA';

export default function About() {
  useEffect(() => {
    document.title = 'About Us — The OCTAGON Story | OCTAGON ERP';
  }, []);

  return (
    <main>
      <AboutHero />
      <CompanyStory />
      <MissionVision />
      <HomeCTA />
    </main>
  );
}
