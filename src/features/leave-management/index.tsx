import { Route, Routes } from 'react-router-dom';

// Portal Pages
import LmsPortalPage from './portal/LmsPortalPage';

// Admin Portal
import AdminPortalPage from './admin/AdminPortalPage';
import AdminMastersPortalPage from './admin/AdminMastersPortalPage';
import AdminDashboard from './admin/pages/Dashboard';
import LeaveTypeMaster from './admin/pages/masters/LeaveTypeMaster';
import LeavePolicyMaster from './admin/pages/masters/LeavePolicyMaster';
import ApprovalHierarchyMaster from './admin/pages/masters/ApprovalHierarchy';
import AcademicCalendar from './admin/pages/masters/AcademicCalendar';
import LeaveRequests from './admin/pages/LeaveRequests';
import AdminAttendance from './admin/pages/Attendance';
import AdminBiometric from './admin/pages/Biometric';
import LtcManagement from './admin/pages/LtcManagement';
import AdminReports from './admin/pages/Reports';
import AdminSettings from './admin/pages/Settings';

// Teacher Portal
import TeacherPortalPage from './teacher/TeacherPortalPage';
import TeacherDashboard from './teacher/pages/Dashboard';
import TeacherApplyLeave from './teacher/pages/ApplyLeave';
import TeacherMyApplications from './teacher/pages/MyApplications';
import StudentLeaveRequests from './teacher/pages/StudentLeaveRequests';
import TeacherAttendance from './teacher/pages/Attendance';
import TeacherBiometric from './teacher/pages/Biometric';
import TeacherReports from './teacher/pages/Reports';

// Student Portal
import StudentPortalPage from './student/StudentPortalPage';
import StudentDashboard from './student/pages/Dashboard';
import StudentApplyLeave from './student/pages/ApplyLeave';
import StudentMyLeave from './student/pages/MyLeave';
import StudentAttendance from './student/pages/Attendance';
import StudentBiometric from './student/pages/Biometric';
import StudentNotifications from './student/pages/Notifications';

/**
 * Leave Management System Routes
 *
 * Mounted at path="leave-management/*" in the main features router.
 * All child paths are RELATIVE (no leading slash).
 */
export default function LeaveManagementRoutes() {
  return (
    <Routes>
      {/* Main LMS Portal */}
      <Route index element={<LmsPortalPage />} />

      {/* ── Admin ── */}
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="admin/masters" element={<AdminMastersPortalPage />} />
      <Route path="admin/masters/leave-types" element={<LeaveTypeMaster />} />
      <Route
        path="admin/masters/leave-policy"
        element={<LeavePolicyMaster />}
      />
      <Route
        path="admin/masters/approval-hierarchy"
        element={<ApprovalHierarchyMaster />}
      />
      <Route
        path="admin/masters/academic-calendar"
        element={<AcademicCalendar />}
      />
      <Route path="admin/leave-requests" element={<LeaveRequests />} />
      <Route path="admin/attendance" element={<AdminAttendance />} />
      <Route path="admin/biometric" element={<AdminBiometric />} />
      <Route path="admin/ltc" element={<LtcManagement />} />
      <Route path="admin/reports" element={<AdminReports />} />
      <Route path="admin/settings" element={<AdminSettings />} />

      {/* ── Teacher ── */}
      <Route path="teacher" element={<TeacherPortalPage />} />
      <Route path="teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="teacher/apply-leave" element={<TeacherApplyLeave />} />
      <Route
        path="teacher/my-applications"
        element={<TeacherMyApplications />}
      />
      <Route
        path="teacher/student-requests"
        element={<StudentLeaveRequests />}
      />
      <Route path="teacher/attendance" element={<TeacherAttendance />} />
      <Route path="teacher/biometric" element={<TeacherBiometric />} />
      <Route path="teacher/reports" element={<TeacherReports />} />

      {/* ── Student ── */}
      <Route path="student" element={<StudentPortalPage />} />
      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route path="student/apply-leave" element={<StudentApplyLeave />} />
      <Route path="student/my-leave" element={<StudentMyLeave />} />
      <Route path="student/attendance" element={<StudentAttendance />} />
      <Route path="student/biometric" element={<StudentBiometric />} />
      <Route path="student/notifications" element={<StudentNotifications />} />
    </Routes>
  );
}
