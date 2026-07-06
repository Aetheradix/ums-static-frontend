import { Route, Routes } from 'react-router';
import { Navigate } from 'react-router-dom';
import ApprovalHierarchy from './admin/pages/ApprovalHierarchy';
import ConferenceManagement from './admin/pages/ConferenceManagement';
import Dashboard from './admin/pages/Dashboard';
import EmailTemplates from './admin/pages/EmailTemplates';
import GuestHouseManagement from './admin/pages/GuestHouseManagement';
import ParkingManagement from './admin/pages/ParkingManagement';
import Reports from './admin/pages/Reports';
import SystemLogs from './admin/pages/SystemLogs';
import TransportManagement from './admin/pages/TransportManagement';
import EmployeeBookings from './employee/pages/EmployeeBookings';

export default function EssentialServices() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to="/home/sub-menu/essential-services" replace />}
      />

      {/* Admin Routes */}
      <Route
        path="admin"
        element={
          <Navigate to="/home/sub-menu/essential-services-admin" replace />
        }
      />
      <Route path="admin/dashboard" element={<Dashboard />} />
      <Route path="admin/hierarchy" element={<ApprovalHierarchy />} />
      <Route path="admin/templates" element={<EmailTemplates />} />
      <Route path="admin/parking" element={<ParkingManagement />} />
      <Route path="admin/conference" element={<ConferenceManagement />} />
      <Route path="admin/guest-house" element={<GuestHouseManagement />} />
      <Route path="admin/transport" element={<TransportManagement />} />
      <Route path="admin/logs" element={<SystemLogs />} />
      <Route path="admin/reports" element={<Reports />} />

      {/* Employee Routes */}
      <Route
        path="employee"
        element={
          <Navigate to="/home/sub-menu/essential-services-employee" replace />
        }
      />
      <Route path="employee/bookings" element={<EmployeeBookings />} />
    </Routes>
  );
}
