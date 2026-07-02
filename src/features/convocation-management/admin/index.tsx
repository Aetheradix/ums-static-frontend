import { Route, Routes, Navigate } from 'react-router-dom';
import ConvocationAdminDashboard from './pages/dashboard/ConvocationAdminDashboard';
import EventSetupPage from './pages/setup/EventSetupPage';
import AdvancedConfigPage from './pages/configuration/AdvancedConfigPage';
import StudentEligibilityPage from './pages/eligibility/StudentEligibilityPage';
import ApplicationReviewPage from './pages/applications/ApplicationReviewPage';
import DegreeDispatchPage from './pages/dispatch/DegreeDispatchPage';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<ConvocationAdminDashboard />} />
      <Route path="setup" element={<EventSetupPage />} />
      <Route path="configuration" element={<AdvancedConfigPage />} />
      <Route path="eligibility" element={<StudentEligibilityPage />} />
      <Route path="applications" element={<ApplicationReviewPage />} />
      <Route path="dispatch" element={<DegreeDispatchPage />} />
    </Routes>
  );
}
