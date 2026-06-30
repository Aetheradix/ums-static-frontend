import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPages from './pages/admin';
import ApproverPages from './pages/approver';
import EmployeePages from './pages/employee';
import PublicPages from './pages/public';
import ReportPages from './pages/reports';

export default function FileManagementTracking() {
  return (
    <Routes>
      <Route index element={<Navigate to="admin/dashboard" replace />} />
      <Route path="admin/*" element={<AdminPages />} />
      <Route path="employee/*" element={<EmployeePages />} />
      <Route path="approver/*" element={<ApproverPages />} />
      <Route path="public/*" element={<PublicPages />} />
      <Route path="reports/*" element={<ReportPages />} />
    </Routes>
  );
}
