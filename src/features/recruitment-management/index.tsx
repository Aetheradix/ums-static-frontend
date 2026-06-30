import { Route, Routes } from 'react-router-dom';
import RecruitmentPortalPage from './portal/RecruitmentPortalPage';

// Candidate
import CandidateChoiceFillingPage from './candidate/pages/ChoiceFilling/CandidateChoiceFillingPage';
import DocumentUploadPage from './candidate/pages/DocumentUpload/DocumentUploadPage';
import CandidateJoiningRequestPage from './candidate/pages/JoiningRequest/CandidateJoiningRequestPage';
import CandidatePortalPage from './candidate/portal/CandidatePortalPage';

// Verification Center
import CandidateQueuePage from './verification-center/pages/CandidateQueue/CandidateQueuePage';
import VerificationCenterDashboard from './verification-center/pages/Dashboard/VerificationCenterDashboard';
import VerificationCenterPortalPage from './verification-center/portal/VerificationCenterPortalPage';

// HR Admin
import JoiningOrderPage from './admin/pages/CreateJoiningOrder/JoiningOrderPage';
import HRAdminDashboard from './admin/pages/Dashboard/HRAdminDashboard';
import DocumentConfigPage from './admin/pages/DocumentConfiguration/DocumentConfigPage';
import HOVerificationPage from './admin/pages/DocumentVerificationByHO/HOVerificationPage';
import MeritListUploadPage from './admin/pages/MeritListUpload/MeritListUploadPage';
import VacancyUploadPage from './admin/pages/VacancyUpload/VacancyUploadPage';
import VerificationCenterUploadPage from './admin/pages/VerificationCenterUpload/VerificationCenterUploadPage';
import HRAdminPortalPage from './admin/portal/HRAdminPortalPage';

export default function RecruitmentManagement() {
  return (
    <Routes>
      {/* Main login portal — no sidebar */}
      <Route index element={<RecruitmentPortalPage />} />

      {/* Candidate routes — sidebar active */}
      <Route path="candidate" element={<CandidatePortalPage />} />
      <Route path="candidate/documents" element={<DocumentUploadPage />} />
      <Route
        path="candidate/choice-filling"
        element={<CandidateChoiceFillingPage />}
      />
      <Route
        path="candidate/joining-request"
        element={<CandidateJoiningRequestPage />}
      />

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
        element={<CandidateQueuePage />}
      />

      {/* HR/Admin routes — sidebar active */}
      <Route path="admin" element={<HRAdminPortalPage />} />
      <Route path="admin/dashboard" element={<HRAdminDashboard />} />
      <Route path="admin/merit-list" element={<MeritListUploadPage />} />
      <Route path="admin/vacancies" element={<VacancyUploadPage />} />
      <Route path="admin/document-config" element={<DocumentConfigPage />} />
      <Route
        path="admin/verification-center"
        element={<VerificationCenterUploadPage />}
      />
      <Route path="admin/ho-verification" element={<HOVerificationPage />} />
      <Route path="admin/joining-order" element={<JoiningOrderPage />} />

      <Route path="*" element={<RecruitmentPortalPage />} />
    </Routes>
  );
}
