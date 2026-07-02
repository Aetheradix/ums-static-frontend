import { Route, Routes } from 'react-router-dom';
import AdminPortalPage from './AdminPortalPage';
import Dashboard from './pages/Dashboard';
import ComposeEmail from './pages/ComposeEmail';
import ComposeSms from './pages/ComposeSms';
import Groups from './pages/Groups';
import MailingLists from './pages/MailingLists';
import Logs from './pages/Logs';
import Settings from './pages/Settings';

export default function AdminPortalLayout() {
  return (
    <Routes>
      <Route index element={<AdminPortalPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="compose-email" element={<ComposeEmail />} />
      <Route path="compose-sms" element={<ComposeSms />} />
      <Route path="groups" element={<Groups />} />
      <Route path="mailing-lists" element={<MailingLists />} />
      <Route path="logs" element={<Logs />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
}
