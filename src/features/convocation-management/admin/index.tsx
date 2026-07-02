import { Navigate, Route, Routes } from 'react-router-dom';
import ApplicationReviewPage from './pages/applications/ApplicationReviewPage';
import AdvancedConfigPage from './pages/configuration/AdvancedConfigPage';
import ConvocationAdminDashboard from './pages/dashboard/ConvocationAdminDashboard';
import DegreeDispatchPage from './pages/dispatch/DegreeDispatchPage';
import StudentEligibilityPage from './pages/eligibility/StudentEligibilityPage';
import ReportsPage from './pages/reports/ReportsPage';
import EventSetupPage from './pages/setup/EventSetupPage';

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
      <Route path="reports" element={<ReportsPage />} />
    </Routes>
  );
}
