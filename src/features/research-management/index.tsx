import { Navigate, Route, Routes } from 'react-router-dom';
import { ResearchProvider } from './context';
import ResearchNotification from './components/ResearchNotification';
import Dashboard from './pages/Dashboard';
import ProjectRegistry from './pages/ProjectRegistry';
import ProposalWizard from './pages/ProposalWizard';
import AdminReview from './pages/AdminReview';
import LedgerDisbursement from './pages/LedgerDisbursement';

export default function ResearchManagement() {
  return (
    <ResearchProvider>
      {/* Floating notification bar — reads from shared context */}
      <ResearchNotification />

      <Routes>
        {/* Default: redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Step 1 — Overview */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Step 2 — Project Registry */}
        <Route path="project-registry" element={<ProjectRegistry />} />

        {/* Step 3 — Proposal Wizard (PI Portal) */}
        <Route path="proposal-wizard" element={<ProposalWizard />} />

        {/* Step 4 — Compliance Admin Desk */}
        <Route path="admin-review" element={<AdminReview />} />

        {/* Step 5 — Milestone Ledger Disbursement */}
        <Route path="ledger-disbursement" element={<LedgerDisbursement />} />
      </Routes>
    </ResearchProvider>
  );
}
