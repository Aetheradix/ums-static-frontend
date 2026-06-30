import { Route, Routes } from 'react-router';
import EssentialServicesPortalPage from './portal/EssentialServicesPortalPage';
import AdminPortalPage from './admin/AdminPortalPage';
import Dashboard from './admin/pages/Dashboard';
import ApprovalHierarchy from './admin/pages/ApprovalHierarchy';
import EmailTemplates from './admin/pages/EmailTemplates';
import ParkingManagement from './admin/pages/ParkingManagement';
import ConferenceManagement from './admin/pages/ConferenceManagement';
import GuestHouseManagement from './admin/pages/GuestHouseManagement';
import TransportManagement from './admin/pages/TransportManagement';
import SystemLogs from './admin/pages/SystemLogs';
import Reports from './admin/pages/Reports';
import EmployeePortalPage from './employee/EmployeePortalPage';
import EmployeeBookings from './employee/pages/EmployeeBookings';

export default function EssentialServices() {
  return (
    <Routes>
      <Route index element={<EssentialServicesPortalPage />} />

      {/* Admin Routes */}
      <Route path="admin" element={<AdminPortalPage />} />
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
      <Route path="employee" element={<EmployeePortalPage />} />
      <Route path="employee/bookings" element={<EmployeeBookings />} />
    </Routes>
  );
}
