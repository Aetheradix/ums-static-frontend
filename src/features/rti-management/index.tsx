import { Navigate, Route, Routes } from 'react-router-dom';
import Appeals from './admin/pages/Appeals';
import Dashboard from './admin/pages/Dashboard';
import PendingActions from './admin/pages/PendingActions';
import RegisterRTI from './admin/pages/RegisterRTI';
import ReportsAnalytics from './admin/pages/ReportsAnalytics';
import RTIInbox from './admin/pages/RTIInbox';
import Settings from './admin/pages/Settings';

export default function RTIManagement() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to="/home/sub-menu/rti-management" replace />}
      />
      <Route
        path="admin"
        element={<Navigate to="/home/sub-menu/rti-admin" replace />}
      />
      <Route path="admin/dashboard" element={<Dashboard />} />
      <Route path="admin/register" element={<RegisterRTI />} />
      <Route path="admin/inbox" element={<RTIInbox />} />
      <Route path="admin/pending-actions" element={<PendingActions />} />
      <Route path="admin/appeals" element={<Appeals />} />
      <Route path="admin/reports" element={<ReportsAnalytics />} />
      <Route path="admin/settings" element={<Settings />} />

      <Route path="department/inbox" element={<RTIInbox />} />
    </Routes>
  );
}
