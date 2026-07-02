import { Route, Routes } from 'react-router-dom';
import AdmissionsPortalPage from './AdmissionsPortalPage';
import AdminPortalPage from './admin/AdminPortalPage';
import ApplicationList from './admin/pages/ApplicationList';
import Dashboard from './admin/pages/Dashboard';
import FeeApproval from './admin/pages/FeeApproval';
import FeeConfig from './admin/pages/FeeConfig';
import NotificationList from './admin/pages/NotificationList';
import PortalSettings from './admin/pages/PortalSettings';
import ProgrammeConfig from './admin/pages/ProgrammeConfig';
import StudentPortalPage from './student/StudentPortalPage';
import ApplicationForm from './student/application-form/pages/ApplicationForm';
import ApplicationStatus from './student/pages/ApplicationStatus';
import AdmissionsStudentDashboard from './student/pages/Dashboard';
import FeePayment from './student/pages/FeePayment';
import SubjectSelection from './student/pages/SubjectSelection';

// New Admin imports
import AdmissionCycleMaster from './admin/pages/AdmissionCycleMaster';
import EligibilityRuleEngine from './admin/pages/EligibilityRuleEngine';
import ReservationMaster from './admin/pages/ReservationMaster';
import SeatMatrixConfig from './admin/pages/SeatMatrixConfig';
import MeritRuleConfig from './admin/pages/MeritRuleConfig';
import DocumentMaster from './admin/pages/DocumentMaster';

// New Student imports
import AdmissionEnquiry from './student/pages/AdmissionEnquiry';
import CoursePreference from './student/pages/CoursePreference';
import DocumentUpload from './student/pages/DocumentUpload';
import ApplicationPreview from './student/pages/ApplicationPreview';
import ApplicationTracking from './student/pages/ApplicationTracking';
import MeritList from './student/pages/MeritList';
import AdmissionOffer from './student/pages/AdmissionOffer';
import AdmissionLetter from './student/pages/AdmissionLetter';

// New Cell imports
import CellPortalPage from './cell/CellPortalPage';
import CellDashboard from './cell/pages/Dashboard';
import CellDocumentVerification from './cell/pages/DocumentVerification';
import MeritListGeneration from './cell/pages/MeritListGeneration';
import SeatAllocation from './cell/pages/SeatAllocation';
import StudentConversion from './cell/pages/StudentConversion';

// New Finance imports

export default function AdmissionsManagement() {
  return (
    <Routes>
      <Route path="" element={<AdmissionsPortalPage />} />

      {/* Admin routes */}
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/dashboard" element={<Dashboard />} />
      <Route path="admin/applications" element={<ApplicationList />} />
      <Route path="admin/fee-approval" element={<FeeApproval />} />
      <Route path="admin/programme-config" element={<ProgrammeConfig />} />
      <Route path="admin/fee-config" element={<FeeConfig />} />
      <Route path="admin/portal-settings" element={<PortalSettings />} />
      <Route path="admin/notifications" element={<NotificationList />} />
      <Route path="admin/cycle-master" element={<AdmissionCycleMaster />} />
      <Route
        path="admin/eligibility-rules"
        element={<EligibilityRuleEngine />}
      />
      <Route path="admin/reservation-master" element={<ReservationMaster />} />
      <Route path="admin/seat-matrix" element={<SeatMatrixConfig />} />
      <Route path="admin/merit-rules" element={<MeritRuleConfig />} />
      <Route path="admin/document-master" element={<DocumentMaster />} />

      {/* Student routes */}
      <Route path="student" element={<StudentPortalPage />} />
      <Route
        path="student/dashboard"
        element={<AdmissionsStudentDashboard />}
      />
      <Route path="student/apply/*" element={<ApplicationForm />} />
      <Route path="student/status" element={<ApplicationStatus />} />
      <Route
        path="student/fee-payment"
        element={<FeePayment token="mock-token" />}
      />
      <Route
        path="student/subject-selection"
        element={<SubjectSelection token="mock-token" />}
      />
      <Route path="student/enquiry" element={<AdmissionEnquiry />} />
      <Route path="student/course-preference" element={<CoursePreference />} />
      <Route path="student/documents" element={<DocumentUpload />} />
      <Route path="student/preview" element={<ApplicationPreview />} />
      <Route path="student/tracking" element={<ApplicationTracking />} />
      <Route path="student/merit-list" element={<MeritList />} />
      <Route path="student/offer" element={<AdmissionOffer />} />
      <Route path="student/admission-letter" element={<AdmissionLetter />} />

      {/* Cell routes */}
      <Route path="cell" element={<CellPortalPage />} />
      <Route path="cell/dashboard" element={<CellDashboard />} />
      <Route path="cell/documents" element={<CellDocumentVerification />} />
      <Route path="cell/merit-list" element={<MeritListGeneration />} />
      <Route path="cell/seat-allocation" element={<SeatAllocation />} />
      <Route path="cell/student-conversion" element={<StudentConversion />} />
    </Routes>
  );
}
