import { Route, Routes } from 'react-router-dom';

// Portal Pages
import ScholarshipPortalPage from './portal/ScholarshipPortalPage';

// Student Portal
import StudentPortalPage from './student/StudentPortalPage';
import StudentDashboard from './student/pages/Dashboard';
import StudentSchemes from './student/pages/Schemes';
import StudentApply from './student/pages/Apply';
import StudentDocuments from './student/pages/Documents';
import StudentAadhaarBank from './student/pages/AadhaarBank';
import StudentBonafide from './student/pages/Bonafide';
import StudentPreview from './student/pages/Preview';
import StudentTrack from './student/pages/Track';
import StudentHistory from './student/pages/History';
import StudentDbtPayments from './student/pages/DbtPayments';
import StudentNotifications from './student/pages/Notifications';
import StudentGrievance from './student/pages/Grievance';
import StudentDownloads from './student/pages/Downloads';

// Teacher Portal
import TeacherPortalPage from './teacher/TeacherPortalPage';
import TeacherDashboard from './teacher/pages/Dashboard';
import TeacherPending from './teacher/pages/Pending';
import TeacherStudentProfile from './teacher/pages/StudentProfile';
import TeacherAttendanceVerify from './teacher/pages/AttendanceVerify';
import TeacherAcademicVerify from './teacher/pages/AcademicVerify';
import TeacherDocumentVerify from './teacher/pages/DocumentVerify';
import TeacherHistory from './teacher/pages/History';

// Scholarship Cell Portal
import ScholarshipCellPortalPage from './scholarship-cell/ScholarshipCellPortalPage';
import CellDashboard from './scholarship-cell/pages/Dashboard';
import CellApplications from './scholarship-cell/pages/Applications';
import CellApplicationDetail from './scholarship-cell/pages/ApplicationDetail';
import CellDocumentVerify from './scholarship-cell/pages/DocumentVerify';
import CellBonafideApproval from './scholarship-cell/pages/BonafideApproval';
import CellEligibilityEngine from './scholarship-cell/pages/EligibilityEngine';
import CellPortalSync from './scholarship-cell/pages/PortalSync';
import CellFinalApproval from './scholarship-cell/pages/FinalApproval';
import CellReports from './scholarship-cell/pages/Reports';

// Finance Portal
import FinancePortalPage from './finance/FinancePortalPage';
import FinanceDashboard from './finance/pages/Dashboard';
import FinanceReceipts from './finance/pages/Receipts';
import FinanceFeeAdjustment from './finance/pages/FeeAdjustment';
import FinanceLedger from './finance/pages/Ledger';
import FinanceDbtReconciliation from './finance/pages/DbtReconciliation';
import FinanceReports from './finance/pages/Reports';

// Admin Portal
import AdminPortalPage from './admin/AdminPortalPage';
import AdminDashboard from './admin/pages/Dashboard';
import AdminScholarshipMaster from './admin/pages/ScholarshipMaster';
import AdminSchemeMaster from './admin/pages/SchemeMaster';
import AdminEligibilityRules from './admin/pages/EligibilityRules';
import AdminAcademicYear from './admin/pages/AcademicYear';
import AdminDocumentMaster from './admin/pages/DocumentMaster';
import AdminConfiguration from './admin/pages/Configuration';
import AdminGovtIntegration from './admin/pages/GovtIntegration';
import AdminPortalSyncLogs from './admin/pages/PortalSyncLogs';
import AdminFailedSync from './admin/pages/FailedSync';
import AdminDbtMonitoring from './admin/pages/DbtMonitoring';
import AdminNpciValidation from './admin/pages/NpciValidation';
import AdminAuditLogs from './admin/pages/AuditLogs';
import AdminReports from './admin/pages/Reports';
import AdminNotificationConfig from './admin/pages/NotificationConfig';

export default function ScholarshipDbtRoutes() {
  return (
    <Routes>
      {/* Main Selector */}
      <Route index element={<ScholarshipPortalPage />} />

      {/* ── Student ── */}
      <Route path="student" element={<StudentPortalPage />} />
      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route path="student/schemes" element={<StudentSchemes />} />
      <Route path="student/apply" element={<StudentApply />} />
      <Route path="student/documents" element={<StudentDocuments />} />
      <Route path="student/aadhaar-bank" element={<StudentAadhaarBank />} />
      <Route path="student/bonafide" element={<StudentBonafide />} />
      <Route path="student/preview" element={<StudentPreview />} />
      <Route path="student/track" element={<StudentTrack />} />
      <Route path="student/history" element={<StudentHistory />} />
      <Route path="student/dbt-payments" element={<StudentDbtPayments />} />
      <Route path="student/notifications" element={<StudentNotifications />} />
      <Route path="student/grievance" element={<StudentGrievance />} />
      <Route path="student/downloads" element={<StudentDownloads />} />

      {/* ── Teacher ── */}
      <Route path="teacher" element={<TeacherPortalPage />} />
      <Route path="teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="teacher/pending" element={<TeacherPending />} />
      <Route
        path="teacher/student-profile"
        element={<TeacherStudentProfile />}
      />
      <Route
        path="teacher/attendance-verify"
        element={<TeacherAttendanceVerify />}
      />
      <Route
        path="teacher/academic-verify"
        element={<TeacherAcademicVerify />}
      />
      <Route
        path="teacher/document-verify"
        element={<TeacherDocumentVerify />}
      />
      <Route path="teacher/history" element={<TeacherHistory />} />

      {/* ── Scholarship Cell ── */}
      <Route path="scholarship-cell" element={<ScholarshipCellPortalPage />} />
      <Route path="scholarship-cell/dashboard" element={<CellDashboard />} />
      <Route
        path="scholarship-cell/applications"
        element={<CellApplications />}
      />
      <Route
        path="scholarship-cell/application-detail"
        element={<CellApplicationDetail />}
      />
      <Route
        path="scholarship-cell/document-verify"
        element={<CellDocumentVerify />}
      />
      <Route
        path="scholarship-cell/bonafide-approval"
        element={<CellBonafideApproval />}
      />
      <Route
        path="scholarship-cell/eligibility-engine"
        element={<CellEligibilityEngine />}
      />
      <Route path="scholarship-cell/portal-sync" element={<CellPortalSync />} />
      <Route
        path="scholarship-cell/final-approval"
        element={<CellFinalApproval />}
      />
      <Route path="scholarship-cell/reports" element={<CellReports />} />

      {/* ── Finance ── */}
      <Route path="finance" element={<FinancePortalPage />} />
      <Route path="finance/dashboard" element={<FinanceDashboard />} />
      <Route path="finance/receipts" element={<FinanceReceipts />} />
      <Route path="finance/fee-adjustment" element={<FinanceFeeAdjustment />} />
      <Route path="finance/ledger" element={<FinanceLedger />} />
      <Route
        path="finance/dbt-reconciliation"
        element={<FinanceDbtReconciliation />}
      />
      <Route path="finance/reports" element={<FinanceReports />} />

      {/* ── Admin ── */}
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route
        path="admin/scholarship-master"
        element={<AdminScholarshipMaster />}
      />
      <Route path="admin/scheme-master" element={<AdminSchemeMaster />} />
      <Route
        path="admin/eligibility-rules"
        element={<AdminEligibilityRules />}
      />
      <Route path="admin/academic-year" element={<AdminAcademicYear />} />
      <Route path="admin/document-master" element={<AdminDocumentMaster />} />
      <Route path="admin/configuration" element={<AdminConfiguration />} />
      <Route path="admin/govt-integration" element={<AdminGovtIntegration />} />
      <Route path="admin/portal-sync-logs" element={<AdminPortalSyncLogs />} />
      <Route path="admin/failed-sync" element={<AdminFailedSync />} />
      <Route path="admin/dbt-monitoring" element={<AdminDbtMonitoring />} />
      <Route path="admin/npci-validation" element={<AdminNpciValidation />} />
      <Route path="admin/audit-logs" element={<AdminAuditLogs />} />
      <Route path="admin/reports" element={<AdminReports />} />
      <Route
        path="admin/notification-config"
        element={<AdminNotificationConfig />}
      />
    </Routes>
  );
}
