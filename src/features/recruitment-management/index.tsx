import { Route, Routes } from 'react-router-dom';
import RecruitmentPortalPage from './portal/RecruitmentPortalPage';

// Candidate
import CandidateDashboard from './candidate/pages/CandidateDashboard';
import CandidatePortalPage from './candidate/portal/CandidatePortalPage';

// Verification Center
import VerificationCenterDashboard from './verification-center/pages/VerificationCenterDashboard';
import VerificationCenterPortalPage from './verification-center/portal/VerificationCenterPortalPage';

// HR Admin
import DocumentConfigPage from './admin/pages/DocumentConfigPage';
import HRAdminDashboard from './admin/pages/HRAdminDashboard';
import MeritListUploadPage from './admin/pages/MeritListUploadPage';
import VacancyUploadPage from './admin/pages/VacancyUploadPage';
import HRAdminPortalPage from './admin/portal/HRAdminPortalPage';

export default function RecruitmentManagement() {
  return (
    <Routes>
      {/* Main login portal — no sidebar */}
      <Route index element={<RecruitmentPortalPage />} />

      {/* Candidate routes — sidebar active */}
      <Route path="candidate" element={<CandidatePortalPage />} />
      <Route path="candidate/dashboard" element={<CandidateDashboard />} />
      <Route path="candidate/documents" element={<CandidateDashboard />} />
      <Route path="candidate/status" element={<CandidateDashboard />} />
      <Route path="candidate/choice-filling" element={<CandidateDashboard />} />

      {/* Verification Center routes — sidebar active */}
      <Route
        path="verification-center"
        element={<VerificationCenterPortalPage />}
      />
      <Route
        path="verification-center/dashboard"
        element={<VerificationCenterDashboard />}
      />
      <Route
        path="verification-center/queue"
        element={<VerificationCenterDashboard />}
      />

      {/* HR/Admin routes — sidebar active */}
      <Route path="admin" element={<HRAdminPortalPage />} />
      <Route path="admin/dashboard" element={<HRAdminDashboard />} />
      <Route path="admin/merit-list" element={<MeritListUploadPage />} />
      <Route path="admin/vacancies" element={<VacancyUploadPage />} />
      <Route path="admin/document-config" element={<DocumentConfigPage />} />
      <Route path="admin/approvals" element={<HRAdminDashboard />} />

      <Route path="*" element={<RecruitmentPortalPage />} />
    </Routes>
  );
}
