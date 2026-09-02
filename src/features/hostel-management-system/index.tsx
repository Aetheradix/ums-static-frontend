import { Navigate, Route, Routes } from 'react-router-dom';
import { HmsProvider } from './context/HmsContext';
import HmsLayout from './layout/HmsLayout';

// Portal selectors
import HmsPortalPage from './portal/HmsPortalPage';
import AdminPortalPage from './portal/AdminPortalPage';
import WardenPortalPage from './portal/WardenPortalPage';
import StudentPortalPage from './portal/StudentPortalPage';

// Hostel Admin
import AdminDashboard from './admin/AdminDashboard';
import HostelRegistration from './admin/HostelRegistration';
import SeatMonitoring from './admin/SeatMonitoring';
import AdminReports from './admin/AdminReports';

// Hostel Warden
import WardenDashboard from './warden/WardenDashboard';
import RoomConfiguration from './warden/RoomConfiguration';
import HostelFacilities from './warden/HostelFacilities';
import AdmissionRequests from './warden/AdmissionRequests';
import RoomAllocation from './warden/RoomAllocation';

// Student
import StudentDashboard from './student/StudentDashboard';
import MyRoom from './student/MyRoom';

// Shared between warden and student, branched on the active portal
import Activities from './shared/Activities';
import Attendance from './shared/Attendance';
import Grievances from './shared/Grievances';
import InOutEntry from './shared/InOutEntry';
import LeaveRequests from './shared/LeaveRequests';
import MessFeedback from './shared/MessFeedback';
import MessMenu from './shared/MessMenu';
import Payments from './shared/Payments';
import RoomChangeRequests from './shared/RoomChangeRequest';
import Visitors from './shared/Visitors';
import Warnings from './shared/Warnings';

/**
 * Hostel Management System — four entry points (public forum, hostel admin,
 * hostel warden, student). Sign-in is assumed: each portal opens straight
 * into its own workspace.
 */
export default function HostelManagementSystem() {
  return (
    <HmsProvider>
      <Routes>
        <Route index element={<HmsPortalPage />} />

        {/* ── Hostel Admin ── */}
        <Route path="admin" element={<HmsLayout />}>
          <Route index element={<AdminPortalPage />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="hostel-registration" element={<HostelRegistration />} />
          <Route path="monitoring" element={<SeatMonitoring />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* ── Hostel Warden ── */}
        <Route path="warden" element={<HmsLayout />}>
          <Route index element={<WardenPortalPage />} />
          <Route path="dashboard" element={<WardenDashboard />} />
          <Route path="room-configuration" element={<RoomConfiguration />} />
          <Route path="facilities" element={<HostelFacilities />} />
          <Route path="admission-requests" element={<AdmissionRequests />} />
          <Route path="room-allocation" element={<RoomAllocation />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="in-out-entry" element={<InOutEntry />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="warnings" element={<Warnings />} />
          <Route path="mess-menu" element={<MessMenu />} />
          <Route path="mess-feedback" element={<MessFeedback />} />
          <Route path="payments" element={<Payments />} />
          <Route path="activities" element={<Activities />} />
          <Route path="room-change-requests" element={<RoomChangeRequests />} />
          <Route path="grievances" element={<Grievances />} />
        </Route>

        {/* ── Student ── */}
        <Route path="student" element={<HmsLayout />}>
          <Route index element={<StudentPortalPage />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="my-room" element={<MyRoom />} />
          <Route path="payments" element={<Payments />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="in-out-entry" element={<InOutEntry />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="warnings" element={<Warnings />} />
          <Route path="mess-menu" element={<MessMenu />} />
          <Route path="mess-feedback" element={<MessFeedback />} />
          <Route path="activities" element={<Activities />} />
          <Route path="room-change-request" element={<RoomChangeRequests />} />
          <Route path="grievances" element={<Grievances />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/hostel-management-system" replace />}
        />
      </Routes>
    </HmsProvider>
  );
}
