import { Navigate, Route, Routes } from 'react-router-dom';
import MaintenanceRequest from './pages/MaintenanceRequest';
import MaintenanceAssignment from './pages/MaintenanceAssignment';
import MaintenanceStatus from './pages/MaintenanceStatus';
import MaintenanceFeedback from './pages/MaintenanceFeedback';

export default function Maintenance() {
  return (
    <Routes>
      <Route index element={<Navigate to="requests" replace />} />
      <Route path="requests" element={<MaintenanceRequest />} />
      <Route path="assignment" element={<MaintenanceAssignment />} />
      <Route path="status" element={<MaintenanceStatus />} />
      <Route path="feedback" element={<MaintenanceFeedback />} />
    </Routes>
  );
}
