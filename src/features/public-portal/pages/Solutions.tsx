import { useEffect } from 'react';
import SolutionsHero from '../components/sections/solutions/SolutionsHero';
import ModuleTabSection from '../components/sections/solutions/ModuleTabSection';
import HomeCTA from '../components/sections/home/HomeCTA';

export default function Solutions() {
  useEffect(() => {
    document.title = 'Solutions — Complete ERP Modules | OCTAGON';
  }, []);

  return (
    <main>
      <SolutionsHero />
      <ModuleTabSection />

      <HomeCTA />
    </main>
  );
}
