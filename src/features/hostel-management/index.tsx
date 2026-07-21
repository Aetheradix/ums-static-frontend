import { Navigate, Route, Routes } from 'react-router-dom';
import { HostelProvider } from './context';
import HostelAdminPortalPage from './pages/HostelAdminPortalPage';
import HostelEmployeePortalPage from './pages/HostelEmployeePortalPage';
import HostelStudentPortalPage from './pages/HostelStudentPortalPage';
import HostelMasters from './masters';
import StudentApplication from './student-application';
import RoomManagement from './room-management';
import StudentOperations from './student-operations';
import Maintenance from './maintenance';
import StockManagement from './stock-management';
import StaffManagement from './staff-management';
import HealthMessManagement from './health-mess';
import DashboardsReports from './dashboards-reports';
import StudentDashboardModule from './student-dashboard';

export default function HostelManagement() {
  return (
    <HostelProvider>
      <Routes>
        <Route
          index
          element={<Navigate to="/home/sub-menu/hostel-management" replace />}
        />
        <Route path="admin" element={<HostelAdminPortalPage />} />
        <Route path="employee" element={<HostelEmployeePortalPage />} />
        <Route path="student" element={<HostelStudentPortalPage />} />
        <Route
          path="student-dashboard/*"
          element={<StudentDashboardModule />}
        />
        <Route path="masters/*" element={<HostelMasters />} />
        <Route path="student-application/*" element={<StudentApplication />} />
        <Route path="room-management/*" element={<RoomManagement />} />
        <Route path="student-operations/*" element={<StudentOperations />} />
        <Route path="maintenance/*" element={<Maintenance />} />
        <Route path="stock/*" element={<StockManagement />} />
        <Route path="staff/*" element={<StaffManagement />} />
        <Route path="health/*" element={<HealthMessManagement />} />
        <Route path="reports/*" element={<DashboardsReports />} />
        <Route
          path="*"
          element={<Navigate to="/home/sub-menu/hostel-management" replace />}
        />
      </Routes>
    </HostelProvider>
  );
}
