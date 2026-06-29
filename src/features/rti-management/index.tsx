import { Route, Routes } from 'react-router-dom';
import Dashboard from './admin/pages/Dashboard';
import RegisterRTI from './admin/pages/RegisterRTI';
import RTIInbox from './admin/pages/RTIInbox';
import PendingActions from './admin/pages/PendingActions';
import Appeals from './admin/pages/Appeals';
import ReportsAnalytics from './admin/pages/ReportsAnalytics';
import Settings from './admin/pages/Settings';
import RTIAdminPortalPage from './admin/RTIAdminPortalPage';
import RTIPortalPage from './portal/RTIPortalPage';

export default function RTIManagement() {
  return (
    <Routes>
      <Route index element={<RTIPortalPage />} />
      <Route path="admin" element={<RTIAdminPortalPage />} />
      <Route path="admin/dashboard" element={<Dashboard />} />
      <Route path="admin/register" element={<RegisterRTI />} />
      <Route path="admin/inbox" element={<RTIInbox />} />
      <Route path="admin/pending-actions" element={<PendingActions />} />
      <Route path="admin/appeals" element={<Appeals />} />
      <Route path="admin/reports" element={<ReportsAnalytics />} />
      <Route path="admin/settings" element={<Settings />} />
    </Routes>
  );
}
