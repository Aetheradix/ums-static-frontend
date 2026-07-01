import { Routes, Route } from 'react-router-dom';
import HealthPortalPage from './pages/HealthPortalPage';
import AdminPortalPage from './pages/AdminPortalPage';
import DoctorPortalPage from './pages/DoctorPortalPage';
import PharmacistPortalPage from './pages/PharmacistPortalPage';
import EmployeePortalPage from './pages/EmployeePortalPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminSettings from './pages/settings/AdminSettings';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';
import MembershipsPage from './pages/memberships/MembershipsPage';
import AddMembershipPage from './pages/memberships/AddMembershipPage';
import HealthRecordsPage from './pages/records/HealthRecordsPage';
import AddHealthRecordPage from './pages/records/AddHealthRecordPage';
import DoctorsPage from './pages/doctors/DoctorsPage';
import MedicalStockPage from './pages/stock/MedicalStockPage';
import AddStockPage from './pages/stock/AddStockPage';
import PrescriptionsPage from './pages/prescriptions/PrescriptionsPage';
import AddPrescriptionPage from './pages/prescriptions/AddPrescriptionPage';
import DispensaryPage from './pages/dispensary/DispensaryPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import GuestUsersPage from './pages/guest-users/GuestUsersPage';
import AddGuestUserPage from './pages/guest-users/AddGuestUserPage';
import ReportsPage from './pages/reports/ReportsPage';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-gray-400 text-lg">
    {title} — Coming Soon
  </div>
);

export default function HealthManagement() {
  return (
    <Routes>
      <Route index element={<HealthPortalPage />} />
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="admin/settings" element={<AdminSettings />} />
      <Route path="doctor" element={<DoctorPortalPage />} />
      <Route
        path="doctor/dashboard"
        element={<Placeholder title="Doctor Dashboard" />}
      />
      <Route path="pharmacist" element={<PharmacistPortalPage />} />
      <Route path="pharmacist/dispensary" element={<DispensaryPage />} />
      <Route path="pharmacist/stock" element={<MedicalStockPage />} />
      <Route path="employee" element={<EmployeePortalPage />} />
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
