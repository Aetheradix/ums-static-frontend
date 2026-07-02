const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const admissionsIndexContent = `import { Route, Routes } from 'react-router-dom';
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
import CourseMaster from './admin/pages/CourseMaster';
import ProgramMaster from './admin/pages/ProgramMaster';
import EligibilityRuleEngine from './admin/pages/EligibilityRuleEngine';
import ReservationMaster from './admin/pages/ReservationMaster';
import SeatMatrixConfig from './admin/pages/SeatMatrixConfig';
import MeritRuleConfig from './admin/pages/MeritRuleConfig';
import AdmissionWorkflow from './admin/pages/AdmissionWorkflow';
import DocumentMaster from './admin/pages/DocumentMaster';
import NotificationTemplates from './admin/pages/NotificationTemplates';
import ReportsDashboard from './admin/pages/ReportsDashboard';
import RolePermission from './admin/pages/RolePermission';
import SystemSettings from './admin/pages/SystemSettings';

// New Student imports
import AdmissionEnquiry from './student/pages/AdmissionEnquiry';
import Registration from './student/pages/Registration';
import CoursePreference from './student/pages/CoursePreference';
import DocumentUpload from './student/pages/DocumentUpload';
import ApplicationPreview from './student/pages/ApplicationPreview';
import ApplicationTracking from './student/pages/ApplicationTracking';
import MeritList from './student/pages/MeritList';
import AdmissionOffer from './student/pages/AdmissionOffer';
import AdmissionLetter from './student/pages/AdmissionLetter';

// New Department imports
import DepartmentPortalPage from './department/DepartmentPortalPage';
import DepartmentDashboard from './department/pages/Dashboard';
import ApplicationsList from './department/pages/ApplicationsList';
import ApplicantProfile from './department/pages/ApplicantProfile';
import AcademicEligibility from './department/pages/AcademicEligibility';
import DocumentVerification from './department/pages/DocumentVerification';
import Remarks from './department/pages/Remarks';
import DepartmentReports from './department/pages/Reports';

// New Cell imports
import CellPortalPage from './cell/CellPortalPage';
import CellDashboard from './cell/pages/Dashboard';
import ApplicationManagement from './cell/pages/ApplicationManagement';
import CellDocumentVerification from './cell/pages/DocumentVerification';
import EligibilityVerification from './cell/pages/EligibilityVerification';
import MeritListGeneration from './cell/pages/MeritListGeneration';
import SeatMatrix from './cell/pages/SeatMatrix';
import SeatAllocation from './cell/pages/SeatAllocation';
import CellAdmissionOffer from './cell/pages/AdmissionOffer';
import WaitingList from './cell/pages/WaitingList';
import AdmissionConfirmation from './cell/pages/AdmissionConfirmation';
import StudentConversion from './cell/pages/StudentConversion';
import CellReports from './cell/pages/Reports';
import CellAuditLogs from './cell/pages/AuditLogs';

// New Finance imports
import FinancePortalPage from './finance/FinancePortalPage';
import FinanceDashboard from './finance/pages/Dashboard';
import PaymentVerification from './finance/pages/PaymentVerification';
import FeeStructure from './finance/pages/FeeStructure';
import PaymentReconciliation from './finance/pages/PaymentReconciliation';
import RefundManagement from './finance/pages/RefundManagement';
import Receipts from './finance/pages/Receipts';
import FinanceReports from './finance/pages/Reports';

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
      <Route path="admin/course-master" element={<CourseMaster />} />
      <Route path="admin/program-master" element={<ProgramMaster />} />
      <Route path="admin/eligibility-rules" element={<EligibilityRuleEngine />} />
      <Route path="admin/reservation-master" element={<ReservationMaster />} />
      <Route path="admin/seat-matrix" element={<SeatMatrixConfig />} />
      <Route path="admin/merit-rules" element={<MeritRuleConfig />} />
      <Route path="admin/workflow" element={<AdmissionWorkflow />} />
      <Route path="admin/document-master" element={<DocumentMaster />} />
      <Route path="admin/notification-templates" element={<NotificationTemplates />} />
      <Route path="admin/reports" element={<ReportsDashboard />} />
      <Route path="admin/roles" element={<RolePermission />} />
      <Route path="admin/system-settings" element={<SystemSettings />} />

      {/* Student routes */}
      <Route path="student" element={<StudentPortalPage />} />
      <Route path="student/dashboard" element={<AdmissionsStudentDashboard />} />
      <Route path="student/apply/*" element={<ApplicationForm />} />
      <Route path="student/status" element={<ApplicationStatus />} />
      <Route path="student/fee-payment" element={<FeePayment token="mock-token" />} />
      <Route path="student/subject-selection" element={<SubjectSelection token="mock-token" />} />
      <Route path="student/enquiry" element={<AdmissionEnquiry />} />
      <Route path="student/registration" element={<Registration />} />
      <Route path="student/course-preference" element={<CoursePreference />} />
      <Route path="student/documents" element={<DocumentUpload />} />
      <Route path="student/preview" element={<ApplicationPreview />} />
      <Route path="student/tracking" element={<ApplicationTracking />} />
      <Route path="student/merit-list" element={<MeritList />} />
      <Route path="student/offer" element={<AdmissionOffer />} />
      <Route path="student/admission-letter" element={<AdmissionLetter />} />

      {/* Department routes */}
      <Route path="department" element={<DepartmentPortalPage />} />
      <Route path="department/dashboard" element={<DepartmentDashboard />} />
      <Route path="department/applications" element={<ApplicationsList />} />
      <Route path="department/applicant/:id" element={<ApplicantProfile />} />
      <Route path="department/eligibility" element={<AcademicEligibility />} />
      <Route path="department/documents" element={<DocumentVerification />} />
      <Route path="department/remarks" element={<Remarks />} />
      <Route path="department/reports" element={<DepartmentReports />} />

      {/* Cell routes */}
      <Route path="cell" element={<CellPortalPage />} />
      <Route path="cell/dashboard" element={<CellDashboard />} />
      <Route path="cell/applications" element={<ApplicationManagement />} />
      <Route path="cell/documents" element={<CellDocumentVerification />} />
      <Route path="cell/eligibility" element={<EligibilityVerification />} />
      <Route path="cell/merit-list" element={<MeritListGeneration />} />
      <Route path="cell/seat-matrix" element={<SeatMatrix />} />
      <Route path="cell/seat-allocation" element={<SeatAllocation />} />
      <Route path="cell/offer" element={<CellAdmissionOffer />} />
      <Route path="cell/waiting-list" element={<WaitingList />} />
      <Route path="cell/confirmation" element={<AdmissionConfirmation />} />
      <Route path="cell/student-conversion" element={<StudentConversion />} />
      <Route path="cell/reports" element={<CellReports />} />
      <Route path="cell/audit-logs" element={<CellAuditLogs />} />

      {/* Finance routes */}
      <Route path="finance" element={<FinancePortalPage />} />
      <Route path="finance/dashboard" element={<FinanceDashboard />} />
      <Route path="finance/payment-verification" element={<PaymentVerification />} />
      <Route path="finance/fee-structure" element={<FeeStructure />} />
      <Route path="finance/reconciliation" element={<PaymentReconciliation />} />
      <Route path="finance/refunds" element={<RefundManagement />} />
      <Route path="finance/receipts" element={<Receipts />} />
      <Route path="finance/reports" element={<FinanceReports />} />
    </Routes>
  );
}
`;

const studentManagementIndexContent = `import { Routes, Route } from 'react-router-dom';
import ImportStudents from './admin/pages/ImportStudents';
import StudentList from './admin/pages/StudentList';
import LinkAbcAccount from './student/pages/LinkAbcAccount';
import StudentProfile from './student/profile/pages/StudentProfile';
import SubjectSelectionStub from 'features/admission-portal/pages/SubjectSelection';
import StudentPortalPage from './student/StudentPortalPage';
import StudentManagementPortalPage from './StudentManagementPortalPage';
import StudentDashboard from './student/pages/Dashboard';
import AdminDashboard from './admin/pages/Dashboard';
import MyCourses from './student/pages/MyCourses';
import MyGrades from './student/pages/MyGrades';
import TermReport from './student/pages/TermReport';

// New Admin imports
import ProgramMaster from './admin/pages/ProgramMaster';
import DepartmentMaster from './admin/pages/DepartmentMaster';
import CourseMaster from './admin/pages/CourseMaster';
import SemesterMaster from './admin/pages/SemesterMaster';
import BatchMaster from './admin/pages/BatchMaster';
import SectionMaster from './admin/pages/SectionMaster';
import AcademicSession from './admin/pages/AcademicSession';
import SubjectMaster from './admin/pages/SubjectMaster';
import CBCSConfiguration from './admin/pages/CBCSConfiguration';
import PromotionRules from './admin/pages/PromotionRules';
import UserRoleMgmt from './admin/pages/UserRoleMgmt';
import ReportsDashboard from './admin/pages/ReportsDashboard';
import AuditLogs from './admin/pages/AuditLogs';

// New Student imports
import AcademicProfile from './student/pages/AcademicProfile';
import SemesterRegistration from './student/pages/SemesterRegistration';
import SubjectRegistration from './student/pages/SubjectRegistration';
import Attendance from './student/pages/Attendance';
import Timetable from './student/pages/Timetable';
import FeeDetails from './student/pages/FeeDetails';
import FeePayment from './student/pages/FeePayment';
import Scholarship from './student/pages/Scholarship';
import LMS from './student/pages/LMS';
import AssignmentSubmission from './student/pages/AssignmentSubmission';
import ExamRegistration from './student/pages/ExamRegistration';
import HallTicket from './student/pages/HallTicket';
import Results from './student/pages/Results';
import GradeCard from './student/pages/GradeCard';
import AcademicHistory from './student/pages/AcademicHistory';
import Certificates from './student/pages/Certificates';
import Notifications from './student/pages/Notifications';
import Grievance from './student/pages/Grievance';

// Faculty imports
import FacultyPortalPage from './faculty/FacultyPortalPage';
import FacultyDashboard from './faculty/pages/Dashboard';
import FacultyStudentList from './faculty/pages/StudentList';
import FacultyAttendance from './faculty/pages/Attendance';
import InternalAssessment from './faculty/pages/InternalAssessment';
import AssignmentEvaluation from './faculty/pages/AssignmentEvaluation';
import StudentProgress from './faculty/pages/StudentProgress';
import FacultyReports from './faculty/pages/Reports';

// Department imports
import DepartmentPortalPage from './department/DepartmentPortalPage';
import DepartmentDashboard from './department/pages/Dashboard';
import StudentMaster from './department/pages/StudentMaster';
import BatchAllocation from './department/pages/BatchAllocation';
import SectionAllocation from './department/pages/SectionAllocation';
import SubjectMapping from './department/pages/SubjectMapping';
import SemesterPromotion from './department/pages/SemesterPromotion';
import DepartmentReports from './department/pages/Reports';

// Exam Cell imports
import ExamCellPortalPage from './exam-cell/ExamCellPortalPage';
import ExamCellDashboard from './exam-cell/pages/Dashboard';
import ExamRegistrationMgmt from './exam-cell/pages/ExamRegistration';
import HallTicketMgmt from './exam-cell/pages/HallTicket';
import InternalMarksVerification from './exam-cell/pages/InternalMarksVerification';
import ExternalMarks from './exam-cell/pages/ExternalMarks';
import ResultProcessing from './exam-cell/pages/ResultProcessing';
import GradeCardMgmt from './exam-cell/pages/GradeCard';
import Revaluation from './exam-cell/pages/Revaluation';
import ExamReports from './exam-cell/pages/Reports';

// Finance imports
import FinancePortalPage from './finance/FinancePortalPage';
import FinanceDashboard from './finance/pages/Dashboard';
import StudentFeeLedger from './finance/pages/StudentFeeLedger';
import FeeCollection from './finance/pages/FeeCollection';
import OnlinePayments from './finance/pages/OnlinePayments';
import Refunds from './finance/pages/Refunds';
import ScholarshipAdjustment from './finance/pages/ScholarshipAdjustment';
import FinanceReports from './finance/pages/Reports';

export default function StudentManagement() {
  return (
    <Routes>
      <Route path="" element={<StudentManagementPortalPage />} />
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="admin/directory" element={<StudentList />} />
      <Route path="admin/import" element={<ImportStudents />} />
      <Route path="admin/program-master" element={<ProgramMaster />} />
      <Route path="admin/department-master" element={<DepartmentMaster />} />
      <Route path="admin/course-master" element={<CourseMaster />} />
      <Route path="admin/semester-master" element={<SemesterMaster />} />
      <Route path="admin/batch-master" element={<BatchMaster />} />
      <Route path="admin/section-master" element={<SectionMaster />} />
      <Route path="admin/academic-session" element={<AcademicSession />} />
      <Route path="admin/subject-master" element={<SubjectMaster />} />
      <Route path="admin/cbcs-config" element={<CBCSConfiguration />} />
      <Route path="admin/promotion-rules" element={<PromotionRules />} />
      <Route path="admin/user-roles" element={<UserRoleMgmt />} />
      <Route path="admin/reports" element={<ReportsDashboard />} />
      <Route path="admin/audit-logs" element={<AuditLogs />} />

      <Route path="student" element={<StudentPortalPage />} />
      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route path="student/link-abc" element={<LinkAbcAccount />} />
      <Route path="student/profile/*" element={<StudentProfile />} />
      <Route path="student/my-courses" element={<MyCourses />} />
      <Route path="student/my-grades" element={<MyGrades />} />
      <Route path="student/term-report" element={<TermReport />} />
      <Route path="student/subject-selection" element={<SubjectSelectionStub token="mock-token" />} />
      
      <Route path="student/academic-profile" element={<AcademicProfile />} />
      <Route path="student/semester-registration" element={<SemesterRegistration />} />
      <Route path="student/subject-registration" element={<SubjectRegistration />} />
      <Route path="student/attendance" element={<Attendance />} />
      <Route path="student/timetable" element={<Timetable />} />
      <Route path="student/fee-details" element={<FeeDetails />} />
      <Route path="student/fee-payment" element={<FeePayment />} />
      <Route path="student/scholarship" element={<Scholarship />} />
      <Route path="student/lms" element={<LMS />} />
      <Route path="student/assignments" element={<AssignmentSubmission />} />
      <Route path="student/exam-registration" element={<ExamRegistration />} />
      <Route path="student/hall-ticket" element={<HallTicket />} />
      <Route path="student/results" element={<Results />} />
      <Route path="student/grade-card" element={<GradeCard />} />
      <Route path="student/academic-history" element={<AcademicHistory />} />
      <Route path="student/certificates" element={<Certificates />} />
      <Route path="student/notifications" element={<Notifications />} />
      <Route path="student/grievance" element={<Grievance />} />

      {/* Faculty routes */}
      <Route path="faculty" element={<FacultyPortalPage />} />
      <Route path="faculty/dashboard" element={<FacultyDashboard />} />
      <Route path="faculty/students" element={<FacultyStudentList />} />
      <Route path="faculty/attendance" element={<FacultyAttendance />} />
      <Route path="faculty/internal-assessment" element={<InternalAssessment />} />
      <Route path="faculty/assignments" element={<AssignmentEvaluation />} />
      <Route path="faculty/progress" element={<StudentProgress />} />
      <Route path="faculty/reports" element={<FacultyReports />} />

      {/* Department routes */}
      <Route path="department" element={<DepartmentPortalPage />} />
      <Route path="department/dashboard" element={<DepartmentDashboard />} />
      <Route path="department/students" element={<StudentMaster />} />
      <Route path="department/batch-allocation" element={<BatchAllocation />} />
      <Route path="department/section-allocation" element={<SectionAllocation />} />
      <Route path="department/subject-mapping" element={<SubjectMapping />} />
      <Route path="department/promotion" element={<SemesterPromotion />} />
      <Route path="department/reports" element={<DepartmentReports />} />

      {/* Exam Cell routes */}
      <Route path="exam-cell" element={<ExamCellPortalPage />} />
      <Route path="exam-cell/dashboard" element={<ExamCellDashboard />} />
      <Route path="exam-cell/registration" element={<ExamRegistrationMgmt />} />
      <Route path="exam-cell/hall-ticket" element={<HallTicketMgmt />} />
      <Route path="exam-cell/internal-marks" element={<InternalMarksVerification />} />
      <Route path="exam-cell/external-marks" element={<ExternalMarks />} />
      <Route path="exam-cell/results" element={<ResultProcessing />} />
      <Route path="exam-cell/grade-card" element={<GradeCardMgmt />} />
      <Route path="exam-cell/revaluation" element={<Revaluation />} />
      <Route path="exam-cell/reports" element={<ExamReports />} />

      {/* Finance routes */}
      <Route path="finance" element={<FinancePortalPage />} />
      <Route path="finance/dashboard" element={<FinanceDashboard />} />
      <Route path="finance/ledger" element={<StudentFeeLedger />} />
      <Route path="finance/collection" element={<FeeCollection />} />
      <Route path="finance/online-payments" element={<OnlinePayments />} />
      <Route path="finance/refunds" element={<Refunds />} />
      <Route path="finance/scholarship" element={<ScholarshipAdjustment />} />
      <Route path="finance/reports" element={<FinanceReports />} />

    </Routes>
  );
}
`;

fs.writeFileSync(path.join(srcDir, 'features/admissions-management/index.tsx'), admissionsIndexContent);
fs.writeFileSync(path.join(srcDir, 'features/student-management/index.tsx'), studentManagementIndexContent);
console.log('Updated index.tsx files');
