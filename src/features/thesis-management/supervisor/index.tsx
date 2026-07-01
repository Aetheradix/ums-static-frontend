import { Route, Routes } from 'react-router-dom';
import SupervisorPortalPage from './SupervisorPortalPage';
import SupervisorDashboard from './pages/Dashboard';
import ScholarsList from './pages/ScholarsList';
import ProposalReview from './pages/ProposalReview';
import PlagiarismReview from './pages/PlagiarismReview';
import ProgressReview from './pages/ProgressReview';
import Meetings from './pages/Meetings';
import Milestones from './pages/Milestones';
import SynopsisReview from './pages/SynopsisReview';
import ThesisReview from './pages/ThesisReview';
import VivaRecommendation from './pages/VivaRecommendation';

export default function SupervisorPortalLayout() {
  return (
    <Routes>
      <Route index element={<SupervisorPortalPage />} />
      <Route path="dashboard" element={<SupervisorDashboard />} />
      <Route path="scholars-list" element={<ScholarsList />} />
      <Route path="proposal-review" element={<ProposalReview />} />
      <Route path="plagiarism-review" element={<PlagiarismReview />} />
      <Route path="progress-review" element={<ProgressReview />} />
      <Route path="meetings" element={<Meetings />} />
      <Route path="milestones" element={<Milestones />} />
      <Route path="synopsis-review" element={<SynopsisReview />} />
      <Route path="thesis-review" element={<ThesisReview />} />
      <Route path="viva-recommendation" element={<VivaRecommendation />} />
    </Routes>
  );
}
