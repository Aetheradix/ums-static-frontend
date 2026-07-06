import { Navigate, Route, Routes } from 'react-router-dom';

// Candidate
import CandidateChoiceFillingPage from './candidate/pages/ChoiceFilling/CandidateChoiceFillingPage';
import DocumentUploadPage from './candidate/pages/DocumentUpload/DocumentUploadPage';
import CandidateJoiningRequestPage from './candidate/pages/JoiningRequest/CandidateJoiningRequestPage';

// Verification Center
import CandidateQueuePage from './verification-center/pages/CandidateQueue/CandidateQueuePage';
import VerificationCenterDashboard from './verification-center/pages/Dashboard/VerificationCenterDashboard';
import VerificationReportsPage from './verification-center/pages/Reports/VerificationReportsPage';
import VerificationCenterPortalPage from './verification-center/portal/VerificationCenterPortalPage';

// HR Admin
import JoiningOrderPage from './admin/pages/CreateJoiningOrder/JoiningOrderPage';
import HRAdminDashboard from './admin/pages/Dashboard/HRAdminDashboard';
import DocumentConfigPage from './admin/pages/DocumentConfiguration/DocumentConfigPage';
import HOVerificationPage from './admin/pages/DocumentVerificationByHO/HOVerificationPage';
import MeritListUploadPage from './admin/pages/MeritListUpload/MeritListUploadPage';
import AdminReportsPage from './admin/pages/Reports/AdminReportsPage';
import VacancyUploadPage from './admin/pages/VacancyUpload/VacancyUploadPage';
import VerificationCenterUploadPage from './admin/pages/VerificationCenterUpload/VerificationCenterUploadPage';

export default function RecruitmentManagement() {
  return (
    <Routes>
      {/* Main login portal — redirects to standard grid sub-menu */}
      <Route
        index
        element={
          <Navigate to="/home/sub-menu/recruitment-management" replace />
        }
      />

      {/* Candidate routes — sidebar active */}
      <Route
        path="candidate"
        element={<Navigate to="/home/sub-menu/recruitment-candidate" replace />}
      />
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
      <Route
        path="verification-center/reports"
        element={<VerificationReportsPage />}
      />

      {/* HR/Admin routes — sidebar active */}
      <Route
        path="admin"
        element={<Navigate to="/home/sub-menu/recruitment-admin" replace />}
      />
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
      <Route path="admin/reports" element={<AdminReportsPage />} />

      <Route
        path="*"
        element={
          <Navigate to="/home/sub-menu/recruitment-management" replace />
        }
      />
    </Routes>
  );
}
