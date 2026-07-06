import { Navigate, Route, Routes } from 'react-router-dom';
import AssignedRequests from './admin/pages/AssignedRequests';
import Dashboard from './admin/pages/Dashboard';
import MaintenanceRequests from './admin/pages/MaintenanceRequests';
import ManageBuildings from './admin/pages/ManageBuildings';
import OpenAreas from './admin/pages/OpenAreas';
import Reports from './admin/pages/Reports';
import RoadsFootpaths from './admin/pages/RoadsFootpaths';
import Settings from './admin/pages/Settings';
import WorkOrders from './admin/pages/WorkOrders';
import WorkOrderTasks from './admin/pages/WorkOrderTasks';

export default function EstateManagement() {
  return (
    <Routes>
      {/* Top-Level Portal landing */}
      <Route
        index
        element={<Navigate to="/home/sub-menu/estate-management" replace />}
      />

      {/* Admin Portal selector */}
      <Route
        path="admin"
        element={
          <Navigate to="/home/sub-menu/estate-management-admin" replace />
        }
      />

      {/* Sub-features under admin */}
      <Route path="admin/dashboard" element={<Dashboard />} />
      <Route path="admin/manage-buildings" element={<ManageBuildings />} />
      <Route path="admin/open-areas" element={<OpenAreas />} />
      <Route path="admin/roads-footpaths" element={<RoadsFootpaths />} />
      <Route path="admin/settings" element={<Settings />} />
      <Route
        path="admin/maintenance-requests"
        element={<MaintenanceRequests />}
      />
      <Route path="admin/assigned-requests" element={<AssignedRequests />} />
      <Route path="admin/work-orders" element={<WorkOrders />} />
      <Route path="admin/work-order-tasks" element={<WorkOrderTasks />} />
      <Route path="admin/reports" element={<Reports />} />
    </Routes>
  );
}
