import { useEffect } from 'react';
import Hero from '../components/sections/home/Hero';
import TrustBar from '../components/sections/home/TrustBar';
import EverythingConnected from '../components/sections/home/EverythingConnected';
import GovernanceExcellence from '../components/sections/home/GovernanceExcellence';
import RealTimeInsights from '../components/sections/home/RealTimeInsights';
import ProblemStatement from '../components/sections/home/ProblemStatement';
import SolutionsPreview from '../components/sections/home/SolutionsPreview';
import EnterpriseModules from '../components/sections/home/EnterpriseModules';
import ComparisonTable from '../components/sections/home/ComparisonTable';
import FeaturesHighlight from '../components/sections/home/FeaturesHighlight';
import Integrations from '../components/sections/home/Integrations';
import OurClients from '../components/sections/home/OurClients';
import HomeCTA from '../components/sections/home/HomeCTA';
import ChatBot from '../components/ui/ChatBot';

export default function Home() {
  useEffect(() => {
    document.title = 'OCTAGON — University ERP Software | Bhopal';
  }, []);

  return (
    <main>
      <div id="hero">
        <Hero />
      </div>
      <TrustBar />
      <EverythingConnected />
      <GovernanceExcellence />
      <RealTimeInsights />
      <ProblemStatement />
      <SolutionsPreview />
      <EnterpriseModules />
      <div id="comparison">
        <ComparisonTable />
      </div>
      <Integrations />
      <FeaturesHighlight />
      <OurClients />
      <div id="home-cta">
        <HomeCTA />
      </div>
      <ChatBot />
    </main>
  );
}
