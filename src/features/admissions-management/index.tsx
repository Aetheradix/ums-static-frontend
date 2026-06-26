import { Routes, Route } from 'react-router-dom';
import AdmissionsPortalPage from './AdmissionsPortalPage';
import AdminPortalPage from './admin/AdminPortalPage';
import ApplicationList from './admin/pages/ApplicationList';
import FeeApproval from './admin/pages/FeeApproval';
import ProgrammeConfig from './admin/pages/ProgrammeConfig';
import FeeConfig from './admin/pages/FeeConfig';
import PortalSettings from './admin/pages/PortalSettings';
import NotificationList from './admin/pages/NotificationList';
import StudentPortalPage from './student/StudentPortalPage';
import ApplicationStatus from './student/pages/ApplicationStatus';
import ApplicationForm from './student/application-form/pages/ApplicationForm';
import FeePayment from 'features/admission-portal/pages/FeePayment';

export default function AdmissionsManagement() {
  return (
    <Routes>
      <Route path="" element={<AdmissionsPortalPage />} />

      {/* Admin routes */}
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/applications" element={<ApplicationList />} />
      <Route path="admin/fee-approval" element={<FeeApproval />} />
      <Route path="admin/programme-config" element={<ProgrammeConfig />} />
      <Route path="admin/fee-config" element={<FeeConfig />} />
      <Route path="admin/portal-settings" element={<PortalSettings />} />
      <Route path="admin/notifications" element={<NotificationList />} />

      {/* Student routes */}
      <Route path="student" element={<StudentPortalPage />} />
      <Route path="student/apply/*" element={<ApplicationForm />} />
      <Route path="student/status" element={<ApplicationStatus />} />
      <Route
        path="student/fee-payment"
        element={<FeePayment token="mock-token" />}
      />
    </Routes>
  );
}
