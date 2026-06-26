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

      {/* College */}
      <Route path="college/verify" element={<VerifyApplications />} />
      <Route path="college/verify/:id" element={<VerificationPage />} />

      {/* Payment */}
      <Route path="payment/checkout" element={<PaymentPage />} />

      {/* University */}
      <Route path="university/approve" element={<ApprovalPage />} />
      <Route path="university/generate" element={<GenerateCertificate />} />

      {/* Default fallback for any unmatched route */}
      <Route path="*" element={<Navigate to="student/dashboard" replace />} />
    </Routes>
  );
}
