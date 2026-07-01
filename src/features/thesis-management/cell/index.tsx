import { Route, Routes } from 'react-router-dom';
import CellPortalPage from './CellPortalPage';
import CellDashboard from './pages/Dashboard';
import ProposalManagement from './pages/ProposalManagement';
import ScholarRegistration from './pages/ScholarRegistration';
import SupervisorAllocation from './pages/SupervisorAllocation';
import PlagiarismVerification from './pages/PlagiarismVerification';
import MilestoneMonitoring from './pages/MilestoneMonitoring';
import JuryManagement from './pages/JuryManagement';
import DefenseScheduling from './pages/DefenseScheduling';
import Evaluation from './pages/Evaluation';
import CellRepository from './pages/Repository';
import Reports from './pages/Reports';

export default function CellPortalLayout() {
  return (
    <Routes>
      <Route index element={<CellPortalPage />} />
      <Route path="dashboard" element={<CellDashboard />} />
      <Route path="proposal-management" element={<ProposalManagement />} />
      <Route path="scholar-registration" element={<ScholarRegistration />} />
      <Route path="supervisor-allocation" element={<SupervisorAllocation />} />
      <Route
        path="plagiarism-verification"
        element={<PlagiarismVerification />}
      />
      <Route path="milestone-monitoring" element={<MilestoneMonitoring />} />
      <Route path="jury-management" element={<JuryManagement />} />
      <Route path="defense-scheduling" element={<DefenseScheduling />} />
      <Route path="evaluation" element={<Evaluation />} />
      <Route path="repository" element={<CellRepository />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
