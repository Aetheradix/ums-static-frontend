import { Navigate, Route, Routes } from 'react-router-dom';

import ApplicationDetails from './student/ApplicationDetails';
import ApplyCertificate from './student/ApplyCertificate';
import Dashboard from './student/Dashboard';
import MyApplications from './student/MyApplications';
import EditApplication from './student/EditApplication';
import DownloadPage from './student/DownloadPage';

import VerifyApplications from './college/VerifyApplications';
import VerificationPage from './college/VerificationPage';
import PaymentPage from './payment/PaymentPage';
import ApprovalPage from './university/ApprovalPage';
import GenerateCertificate from './university/GenerateCertificate';

import CertificateReport from './reports/CertificateReport';
import PendingApplicationsReport from './reports/PendingApplicationsReport';
import IssuedCertificateReport from './reports/IssuedCertificateReport';

import TrackDispatch from './student/TrackDispatch';
import Helpdesk from './student/Helpdesk';
import ManageQueries from './college/ManageQueries';
import DispatchManagement from './university/DispatchManagement';
import VerifyCertificate from './public/VerifyCertificate';

export default function CertificateManagementSystem() {
  return (
    <Routes>
      {/* Student */}
      <Route path="student/dashboard" element={<Dashboard />} />
      <Route path="student/apply" element={<ApplyCertificate />} />
      <Route path="student/applications" element={<MyApplications />} />
      <Route path="student/applications/:id" element={<ApplicationDetails />} />
      <Route
        path="student/applications/:id/edit"
        element={<EditApplication />}
      />
      <Route path="student/download" element={<DownloadPage />} />
      <Route path="student/track-dispatch" element={<TrackDispatch />} />
      <Route path="student/helpdesk" element={<Helpdesk />} />

      {/* College */}
      <Route path="college/verify" element={<VerifyApplications />} />
      <Route path="college/verify/:id" element={<VerificationPage />} />
      <Route path="college/manage-queries" element={<ManageQueries />} />

      {/* Payment */}
      <Route path="payment/checkout" element={<PaymentPage />} />

      {/* University */}
      <Route path="university/approve" element={<ApprovalPage />} />
      <Route path="university/generate" element={<GenerateCertificate />} />
      <Route
        path="university/dispatch-management"
        element={<DispatchManagement />}
      />

      {/* Reports */}
      <Route path="reports/certificate" element={<CertificateReport />} />
      <Route
        path="reports/pending-applications"
        element={<PendingApplicationsReport />}
      />
      <Route
        path="reports/issued-certificates"
        element={<IssuedCertificateReport />}
      />

      {/* Public */}
      <Route path="public/verify" element={<VerifyCertificate />} />

      {/* Default fallback for any unmatched route */}
      <Route path="*" element={<Navigate to="student/dashboard" replace />} />
    </Routes>
  );
}
