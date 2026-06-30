import { Route, Routes } from 'react-router-dom';
import HodPortalPage from './HodPortalPage';
import HodDashboard from './pages/Dashboard';
import ProposalApprovals from './pages/ProposalApprovals';
import SupervisorWorkload from './pages/SupervisorWorkload';
import DeptProgress from './pages/DeptProgress';
import SynopsisEndorsement from './pages/SynopsisEndorsement';
import ThesisEndorsement from './pages/ThesisEndorsement';
import Reports from './pages/Reports';

export default function HodPortalLayout() {
  return (
    <Routes>
      <Route index element={<HodPortalPage />} />
      <Route path="dashboard" element={<HodDashboard />} />
      <Route path="proposal-approvals" element={<ProposalApprovals />} />
      <Route path="supervisor-workload" element={<SupervisorWorkload />} />
      <Route path="dept-progress" element={<DeptProgress />} />
      <Route path="synopsis-endorsement" element={<SynopsisEndorsement />} />
      <Route path="thesis-endorsement" element={<ThesisEndorsement />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
