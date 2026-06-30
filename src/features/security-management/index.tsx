import { Route, Routes } from 'react-router-dom';

// Main Portal
import SecurityPortalPage from './portal/SecurityPortalPage';

// Super Admin
import SuperAdminPortalPage from './super-admin/SuperAdminPortalPage';
import SuperAdminDashboard from './super-admin/pages/Dashboard';
import IncidentCategoryMaster from './super-admin/pages/masters/IncidentCategoryMaster';
import IncidentTypeMaster from './super-admin/pages/masters/IncidentTypeMaster';
import PriorityMaster from './super-admin/pages/masters/PriorityMaster';
import SeverityMaster from './super-admin/pages/masters/SeverityMaster';
import StatusMaster from './super-admin/pages/masters/StatusMaster';
import BuildingMaster from './super-admin/pages/masters/BuildingMaster';
import LocationMaster from './super-admin/pages/masters/LocationMaster';
import DepartmentMapping from './super-admin/pages/masters/DepartmentMapping';
import EmergencyContactType from './super-admin/pages/masters/EmergencyContactType';
import HelplineManagement from './super-admin/pages/helpline/HelplineManagement';
import GuidelinesManagement from './super-admin/pages/guidelines/GuidelinesManagement';
import AwarenessProgramManagement from './super-admin/pages/awareness/AwarenessProgramManagement';
import SuperAdminIncidentManagement from './super-admin/pages/incidents/IncidentManagement';
import SuperAdminReports from './super-admin/pages/Reports';
import SuperAdminSettings from './super-admin/pages/Settings';

// Security Admin
import SecurityAdminPortalPage from './security-admin/SecurityAdminPortalPage';
import SecurityAdminDashboard from './security-admin/pages/Dashboard';
import SecurityAdminIncidentManagement from './security-admin/pages/IncidentManagement';
import SecurityAdminHelpline from './security-admin/pages/Helpline';
import SecurityAdminGuidelines from './security-admin/pages/Guidelines';
import SecurityAdminAwarenessPrograms from './security-admin/pages/AwarenessPrograms';
import SecurityAdminReports from './security-admin/pages/Reports';

// Security Officer
import SecurityOfficerPortalPage from './security-officer/SecurityOfficerPortalPage';
import SecurityOfficerDashboard from './security-officer/pages/Dashboard';
import AssignedIncidents from './security-officer/pages/AssignedIncidents';

// Employee Portal
import EmployeePortalPage from './employee/EmployeePortalPage';
import EmployeeDashboard from './employee/pages/Dashboard';
import EmployeeReportIncident from './employee/pages/ReportIncident';
import EmployeeMyIncidents from './employee/pages/MyIncidents';
import EmployeeHelplines from './employee/pages/Helplines';
import EmployeeGuidelines from './employee/pages/Guidelines';
import EmployeeAwarenessPrograms from './employee/pages/AwarenessPrograms';

// Student Portal
import StudentSecurityPortalPage from './student/StudentPortalPage';
import StudentDashboard from './student/pages/Dashboard';
// Student reuses Employee pages with student-specific breadcrumbs via the student portal
import StudentReportIncident from './student/pages/ReportIncident';
import StudentMyIncidents from './student/pages/MyIncidents';
import StudentHelplines from './student/pages/Helplines';
import StudentGuidelines from './student/pages/Guidelines';
import StudentAwarenessPrograms from './student/pages/AwarenessPrograms';

/**
 * Security Management System Routes
 *
 * Mounted at path="security-management/*" in the main features router.
 * All child paths are RELATIVE (no leading slash).
 */
export default function SecurityManagementRoutes() {
  return (
    <Routes>
      {/* Main Portal Selector */}
      <Route index element={<SecurityPortalPage />} />

      {/* ── Super Admin ── */}
      <Route path="super-admin" element={<SuperAdminPortalPage />} />
      <Route path="super-admin/dashboard" element={<SuperAdminDashboard />} />
      {/* Masters */}
      <Route
        path="super-admin/masters/incident-category"
        element={<IncidentCategoryMaster />}
      />
      <Route
        path="super-admin/masters/incident-type"
        element={<IncidentTypeMaster />}
      />
      <Route path="super-admin/masters/priority" element={<PriorityMaster />} />
      <Route path="super-admin/masters/severity" element={<SeverityMaster />} />
      <Route path="super-admin/masters/status" element={<StatusMaster />} />
      <Route path="super-admin/masters/building" element={<BuildingMaster />} />
      <Route path="super-admin/masters/location" element={<LocationMaster />} />
      <Route
        path="super-admin/masters/department-mapping"
        element={<DepartmentMapping />}
      />
      <Route
        path="super-admin/masters/emergency-contact-type"
        element={<EmergencyContactType />}
      />
      {/* Operations */}
      <Route path="super-admin/helpline" element={<HelplineManagement />} />
      <Route path="super-admin/guidelines" element={<GuidelinesManagement />} />
      <Route
        path="super-admin/awareness"
        element={<AwarenessProgramManagement />}
      />
      <Route
        path="super-admin/incidents"
        element={<SuperAdminIncidentManagement />}
      />
      <Route path="super-admin/reports" element={<SuperAdminReports />} />
      <Route path="super-admin/settings" element={<SuperAdminSettings />} />

      {/* ── Security Admin ── */}
      <Route path="security-admin" element={<SecurityAdminPortalPage />} />
      <Route
        path="security-admin/dashboard"
        element={<SecurityAdminDashboard />}
      />
      <Route
        path="security-admin/incidents"
        element={<SecurityAdminIncidentManagement />}
      />
      <Route
        path="security-admin/helpline"
        element={<SecurityAdminHelpline />}
      />
      <Route
        path="security-admin/guidelines"
        element={<SecurityAdminGuidelines />}
      />
      <Route
        path="security-admin/awareness"
        element={<SecurityAdminAwarenessPrograms />}
      />
      <Route path="security-admin/reports" element={<SecurityAdminReports />} />

      {/* ── Security Officer ── */}
      <Route path="officer" element={<SecurityOfficerPortalPage />} />
      <Route path="officer/dashboard" element={<SecurityOfficerDashboard />} />
      <Route
        path="officer/assigned-incidents"
        element={<AssignedIncidents />}
      />

      {/* ── Employee ── */}
      <Route path="employee" element={<EmployeePortalPage />} />
      <Route path="employee/dashboard" element={<EmployeeDashboard />} />
      <Route
        path="employee/report-incident"
        element={<EmployeeReportIncident />}
      />
      <Route path="employee/my-incidents" element={<EmployeeMyIncidents />} />
      <Route path="employee/helplines" element={<EmployeeHelplines />} />
      <Route path="employee/guidelines" element={<EmployeeGuidelines />} />
      <Route
        path="employee/awareness"
        element={<EmployeeAwarenessPrograms />}
      />

      {/* ── Student ── */}
      <Route path="student" element={<StudentSecurityPortalPage />} />
      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route
        path="student/report-incident"
        element={<StudentReportIncident />}
      />
      <Route path="student/my-incidents" element={<StudentMyIncidents />} />
      <Route path="student/helplines" element={<StudentHelplines />} />
      <Route path="student/guidelines" element={<StudentGuidelines />} />
      <Route path="student/awareness" element={<StudentAwarenessPrograms />} />
    </Routes>
  );
}
