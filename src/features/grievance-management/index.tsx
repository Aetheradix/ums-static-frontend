import { Route, Routes } from 'react-router-dom';

// Portal
import GrievancePortalPage from './portal/GrievancePortalPage';

// Student
import StudentPortalPage from './student/StudentPortalPage';
import StudentDashboard from './student/pages/Dashboard';
import StudentRaiseGrievance from './student/pages/RaiseGrievance';
import StudentTrackComplaint from './student/pages/TrackComplaint';
import StudentComplaintDetails from './student/pages/ComplaintDetails';
import StudentCommunicationCenter from './student/pages/CommunicationCenter';
import StudentAppeal from './student/pages/Appeal';
import StudentComplaintHistory from './student/pages/ComplaintHistory';

// Department
import DepartmentPortalPage from './department/DepartmentPortalPage';
import DepartmentDashboard from './department/pages/Dashboard';
import DepartmentComplaintInbox from './department/pages/ComplaintInbox';
import DepartmentComplaintDetails from './department/pages/ComplaintDetails';
import DepartmentNotesheetAction from './department/pages/NotesheetAction';
import DepartmentReports from './department/pages/Reports';

// Cell
import GrievanceCellPortalPage from './grievance-cell/GrievanceCellPortalPage';
import GrievanceCellDashboard from './grievance-cell/pages/Dashboard';
import GrievanceCellComplaintManagement from './grievance-cell/pages/ComplaintManagement';
import GrievanceCellComplaintAssignment from './grievance-cell/pages/ComplaintAssignment';
import GrievanceCellSLAMonitoring from './grievance-cell/pages/SLAMonitoring';
import GrievanceCellCommitteeManagement from './grievance-cell/pages/CommitteeManagement';
import GrievanceCellReportsAnalytics from './grievance-cell/pages/ReportsAnalytics';

// Authority
import AuthorityPortalPage from './authority/AuthorityPortalPage';
import AuthorityDashboard from './authority/pages/Dashboard';
import AuthorityPendingApprovals from './authority/pages/PendingApprovals';
import AuthorityAppealManagement from './authority/pages/AppealManagement';
import AuthorityDecisionHistory from './authority/pages/DecisionHistory';

// Admin
import AdminPortalPage from './admin/AdminPortalPage';
import AdminDashboard from './admin/pages/Dashboard';
import AdminCategoryMaster from './admin/pages/CategoryMaster';
import AdminDepartmentMapping from './admin/pages/DepartmentMapping';
import AdminWorkflowEscalation from './admin/pages/WorkflowEscalation';
import AdminSLAConfig from './admin/pages/SLAConfig';
import AdminNotificationTemplates from './admin/pages/NotificationTemplates';
import AdminIntegrationDashboard from './admin/pages/IntegrationDashboard';
import AdminAuditLogs from './admin/pages/AuditLogs';

export default function GrievanceManagementRoutes() {
  return (
    <Routes>
      {/* Root Portal */}
      <Route index element={<GrievancePortalPage />} />

      {/* Student Portal */}
      <Route path="student" element={<StudentPortalPage />} />
      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route
        path="student/raise-grievance"
        element={<StudentRaiseGrievance />}
      />
      <Route path="student/track" element={<StudentTrackComplaint />} />
      <Route
        path="student/complaint-details"
        element={<StudentComplaintDetails />}
      />
      <Route
        path="student/communication"
        element={<StudentCommunicationCenter />}
      />
      <Route path="student/appeal" element={<StudentAppeal />} />
      <Route path="student/history" element={<StudentComplaintHistory />} />

      {/* Department Portal */}
      <Route path="department" element={<DepartmentPortalPage />} />
      <Route path="department/dashboard" element={<DepartmentDashboard />} />
      <Route path="department/inbox" element={<DepartmentComplaintInbox />} />
      <Route
        path="department/complaint-details"
        element={<DepartmentComplaintDetails />}
      />
      <Route
        path="department/notesheet"
        element={<DepartmentNotesheetAction />}
      />
      <Route path="department/reports" element={<DepartmentReports />} />

      {/* Cell Portal */}
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
        path="grievance-cell/assignment"
        element={<GrievanceCellComplaintAssignment />}
      />
      <Route
        path="grievance-cell/sla-monitoring"
        element={<GrievanceCellSLAMonitoring />}
      />
      <Route
        path="grievance-cell/committees"
        element={<GrievanceCellCommitteeManagement />}
      />
      <Route
        path="grievance-cell/reports"
        element={<GrievanceCellReportsAnalytics />}
      />

      {/* Authority Portal */}
      <Route path="authority" element={<AuthorityPortalPage />} />
      <Route path="authority/dashboard" element={<AuthorityDashboard />} />
      <Route
        path="authority/pending-approvals"
        element={<AuthorityPendingApprovals />}
      />
      <Route
        path="authority/appeal-management"
        element={<AuthorityAppealManagement />}
      />
      <Route
        path="authority/decision-history"
        element={<AuthorityDecisionHistory />}
      />

      {/* Admin Portal */}
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="admin/category-master" element={<AdminCategoryMaster />} />
      <Route
        path="admin/department-mapping"
        element={<AdminDepartmentMapping />}
      />
      <Route
        path="admin/workflow-escalation"
        element={<AdminWorkflowEscalation />}
      />
      <Route path="admin/sla-config" element={<AdminSLAConfig />} />
      <Route
        path="admin/notification-templates"
        element={<AdminNotificationTemplates />}
      />
      <Route
        path="admin/integration-dashboard"
        element={<AdminIntegrationDashboard />}
      />
      <Route path="admin/audit-logs" element={<AdminAuditLogs />} />
    </Routes>
  );
}
