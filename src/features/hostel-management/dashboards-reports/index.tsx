import { Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import WardenDashboard from './pages/WardenDashboard';
import OccupancyReport from './pages/OccupancyReport';
import RevenueReport from './pages/RevenueReport';
import DisciplinaryReport from './pages/DisciplinaryReport';
import AssetInventoryReport from './pages/AssetInventoryReport';
import StaffPerformanceReport from './pages/StaffPerformanceReport';
import IncidentAnalysisReport from './pages/IncidentAnalysisReport';
import SystemAuditLogs from './pages/SystemAuditLogs';
import ConfigSettings from './pages/ConfigSettings';

export default function DashboardsReports() {
  return (
    <Routes>
      <Route index element={<Navigate to="admin-dashboard" replace />} />
      <Route path="admin-dashboard" element={<AdminDashboard />} />
      <Route path="student-dashboard" element={<StudentDashboard />} />
      <Route path="warden-dashboard" element={<WardenDashboard />} />
      <Route path="occupancy" element={<OccupancyReport />} />
      <Route path="revenue" element={<RevenueReport />} />
      <Route path="disciplinary" element={<DisciplinaryReport />} />
      <Route path="asset-inventory" element={<AssetInventoryReport />} />
      <Route path="staff-performance" element={<StaffPerformanceReport />} />
      <Route path="incident-analysis" element={<IncidentAnalysisReport />} />
      <Route path="audit-logs" element={<SystemAuditLogs />} />
      <Route path="settings" element={<ConfigSettings />} />
    </Routes>
  );
}
