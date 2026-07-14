import { Route, Routes } from 'react-router-dom';

// Portal Page selector
import GrievancePortalPage from './portal/GrievancePortalPage';

// Student Pages
import StudentPortalPage from './student/StudentPortalPage';
import StudentDashboard from './student/pages/Dashboard';
import StudentRaiseGrievance from './student/pages/RaiseGrievance';
import StudentMyGrievances from './student/pages/MyGrievances';
import StudentTrackComplaint from './student/pages/TrackComplaint';
import StudentDownloadsNotifications from './student/pages/DownloadsNotifications';
import StudentComplaintDetails from './student/pages/ComplaintDetails';
import StudentComplaintHistory from './student/pages/ComplaintHistory';
import StudentAppeal from './student/pages/Appeal';
import StudentCommunicationCenter from './student/pages/CommunicationCenter';

// Teacher Pages
import TeacherPortalPage from './teacher/TeacherPortalPage';

// Department Officer Pages
import DepartmentOfficerPortalPage from './department-officer/DepartmentOfficerPortalPage';
import DepartmentOfficerDashboard from './department-officer/pages/Dashboard';
import DepartmentOfficerComplaintInbox from './department-officer/pages/ComplaintInbox';
import DepartmentOfficerComplaintDetails from './department-officer/pages/ComplaintDetails';

// HoD Pages
import HodPortalPage from './hod/HodPortalPage';
import HodDashboard from './hod/pages/Dashboard';
import HodPendingComplaints from './hod/pages/PendingComplaints';
import HodComplaintReview from './hod/pages/ComplaintReview';
import AuthorityPortalPage from './authority/AuthorityPortalPage';

// Grievance Cell Pages
import GrievanceCellPortalPage from './grievance-cell/GrievanceCellPortalPage';
import GrievanceCellDashboard from './grievance-cell/pages/Dashboard';
import GrievanceCellComplaintManagement from './grievance-cell/pages/ComplaintManagement';
import GrievanceCellCommitteeReview from './grievance-cell/pages/CommitteeReview';
import GrievanceCellReports from './grievance-cell/pages/Reports';

// Registrar Pages
import RegistrarPortalPage from './registrar/RegistrarPortalPage';
import RegistrarDashboard from './registrar/pages/Dashboard';
import RegistrarPendingDecisions from './registrar/pages/PendingDecisions';
import RegistrarFinalDecision from './registrar/pages/FinalDecision';

// Admin Pages
import AdminPortalPage from './admin/AdminPortalPage';
import AdminDashboard from './admin/pages/Dashboard';
import AdminMasters from './admin/pages/Masters';
import AdminUserRoleManagement from './admin/pages/UserRoleManagement';
import AdminWorkflowConfiguration from './admin/pages/WorkflowConfiguration';
import AdminReportsAuditLogs from './admin/pages/ReportsAuditLogs';

export default function GrievanceManagementRoutes() {
  return (
    <Routes>
      {/* Root Portal Page (Role Selector) */}
      <Route index element={<GrievancePortalPage />} />

      {/* LOGIN 1: STUDENT LOGIN */}
      <Route path="student" element={<StudentPortalPage />} />
      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route
        path="student/raise-grievance"
        element={<StudentRaiseGrievance />}
      />
      <Route path="student/my-grievances" element={<StudentMyGrievances />} />
      <Route path="student/track" element={<StudentTrackComplaint />} />
      <Route
        path="student/downloads"
        element={<StudentDownloadsNotifications />}
      />
      <Route
        path="student/complaint-details"
        element={<StudentComplaintDetails />}
      />
      <Route path="student/history" element={<StudentComplaintHistory />} />
      <Route path="student/appeal" element={<StudentAppeal />} />
      <Route
        path="student/communication"
        element={<StudentCommunicationCenter />}
      />

      {/* LOGIN 2: TEACHER / EMPLOYEE LOGIN (Reuses student workflow dynamically) */}
      <Route path="teacher" element={<TeacherPortalPage />} />
      <Route path="teacher/dashboard" element={<StudentDashboard />} />
      <Route
        path="teacher/raise-grievance"
        element={<StudentRaiseGrievance />}
      />
      <Route path="teacher/my-grievances" element={<StudentMyGrievances />} />
      <Route path="teacher/track" element={<StudentTrackComplaint />} />
      <Route
        path="teacher/downloads"
        element={<StudentDownloadsNotifications />}
      />
      <Route
        path="teacher/complaint-details"
        element={<StudentComplaintDetails />}
      />
      <Route path="teacher/history" element={<StudentComplaintHistory />} />
      <Route path="teacher/appeal" element={<StudentAppeal />} />
      <Route
        path="teacher/communication"
        element={<StudentCommunicationCenter />}
      />

      {/* LOGIN 3: DEPARTMENT OFFICER LOGIN */}
      <Route
        path="department-officer"
        element={<DepartmentOfficerPortalPage />}
      />
      <Route
        path="department-officer/dashboard"
        element={<DepartmentOfficerDashboard />}
      />
      <Route
        path="department-officer/inbox"
        element={<DepartmentOfficerComplaintInbox />}
      />
      <Route
        path="department-officer/complaint-details"
        element={<DepartmentOfficerComplaintDetails />}
      />

      {/* Alias Department routes for main application sidebar links */}
      <Route path="department" element={<DepartmentOfficerPortalPage />} />
      <Route
        path="department/dashboard"
        element={<DepartmentOfficerDashboard />}
      />
      <Route
        path="department/inbox"
        element={<DepartmentOfficerComplaintInbox />}
      />
      <Route
        path="department/complaint-details"
        element={<DepartmentOfficerComplaintDetails />}
      />

      {/* LOGIN 4: HOD LOGIN */}
      <Route path="hod" element={<HodPortalPage />} />
      <Route path="hod/dashboard" element={<HodDashboard />} />
      <Route path="hod/pending-complaints" element={<HodPendingComplaints />} />
      <Route path="hod/complaint-review" element={<HodComplaintReview />} />

      {/* Authority Portal selector route */}
      <Route path="authority" element={<AuthorityPortalPage />} />

      {/* LOGIN 5: GRIEVANCE CELL LOGIN */}
      <Route path="grievance-cell" element={<GrievanceCellPortalPage />} />
      <Route
        path="grievance-cell/dashboard"
        element={<GrievanceCellDashboard />}
      />
      <Route
        path="grievance-cell/complaint-management"
        element={<GrievanceCellComplaintManagement />}
      />
      <Route
        path="grievance-cell/committee-review"
        element={<GrievanceCellCommitteeReview />}
      />
      <Route path="grievance-cell/reports" element={<GrievanceCellReports />} />

      {/* LOGIN 6: REGISTRAR LOGIN */}
      <Route path="registrar" element={<RegistrarPortalPage />} />
      <Route path="registrar/dashboard" element={<RegistrarDashboard />} />
      <Route
        path="registrar/pending-decisions"
        element={<RegistrarPendingDecisions />}
      />
      <Route
        path="registrar/final-decision"
        element={<RegistrarFinalDecision />}
      />

      {/* LOGIN 7: ADMIN LOGIN */}
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="admin/masters" element={<AdminMasters />} />
      <Route path="admin/users" element={<AdminUserRoleManagement />} />
      <Route path="admin/workflow" element={<AdminWorkflowConfiguration />} />
      <Route path="admin/reports" element={<AdminReportsAuditLogs />} />
    </Routes>
  );
}
