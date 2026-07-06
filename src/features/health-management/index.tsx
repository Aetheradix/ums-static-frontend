import { Navigate, Route, Routes } from 'react-router-dom';
import HealthPortalPage from './pages/HealthPortalPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';
import DispensaryPage from './pages/dispensary/DispensaryPage';
import DoctorsPage from './pages/doctors/DoctorsPage';
import AddGuestUserPage from './pages/guest-users/AddGuestUserPage';
import GuestUsersPage from './pages/guest-users/GuestUsersPage';
import AddMembershipPage from './pages/memberships/AddMembershipPage';
import MembershipsPage from './pages/memberships/MembershipsPage';
import AddPrescriptionPage from './pages/prescriptions/AddPrescriptionPage';
import PrescriptionsPage from './pages/prescriptions/PrescriptionsPage';
import AddHealthRecordPage from './pages/records/AddHealthRecordPage';
import HealthRecordsPage from './pages/records/HealthRecordsPage';
import ReportsPage from './pages/reports/ReportsPage';
import AdminSettings from './pages/settings/AdminSettings';
import AddStockPage from './pages/stock/AddStockPage';
import MedicalStockPage from './pages/stock/MedicalStockPage';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-gray-400 text-lg">
    {title} — Coming Soon
  </div>
);

export default function HealthManagement() {
  return (
    <Routes>
      <Route index element={<HealthPortalPage />} />
      <Route
        path="admin"
        element={<Navigate to="/home/sub-menu/hms-admin-portal" replace />}
      />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="admin/settings" element={<AdminSettings />} />
      <Route
        path="doctor"
        element={<Navigate to="/home/sub-menu/hms-doctor-portal" replace />}
      />
      <Route
        path="doctor/dashboard"
        element={<Placeholder title="Doctor Dashboard" />}
      />
      <Route
        path="pharmacist"
        element={<Navigate to="/home/sub-menu/hms-pharmacist-portal" replace />}
      />
      <Route path="pharmacist/dispensary" element={<DispensaryPage />} />
      <Route path="pharmacist/stock" element={<MedicalStockPage />} />
      <Route
        path="employee"
        element={<Navigate to="/home/sub-menu/hms-employee-portal" replace />}
      />
      <Route path="employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="memberships" element={<MembershipsPage />} />
      <Route path="memberships/add" element={<AddMembershipPage />} />
      <Route path="records" element={<HealthRecordsPage />} />
      <Route path="records/add" element={<AddHealthRecordPage />} />
      <Route path="doctors" element={<DoctorsPage />} />
      <Route path="stock" element={<MedicalStockPage />} />
      <Route path="stock/add" element={<AddStockPage />} />
      <Route path="prescriptions" element={<PrescriptionsPage />} />
      <Route path="prescriptions/add" element={<AddPrescriptionPage />} />
      <Route path="dispensary" element={<DispensaryPage />} />
      <Route
        path="dispensary/add"
        element={<Placeholder title="Dispense Medicine" />}
      />
      <Route path="appointments" element={<AppointmentsPage />} />
      <Route path="guest-users" element={<GuestUsersPage />} />
      <Route path="guest-users/add" element={<AddGuestUserPage />} />
      <Route
        path="subscriptions"
        element={<Placeholder title="Subscriptions" />}
      />
      <Route path="reports" element={<ReportsPage />} />
    </Routes>
  );
}
