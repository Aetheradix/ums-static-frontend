import { Route, Routes } from 'react-router-dom';
import AdminPortalPage from './AdminPortalPage';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import SetupWizard from './pages/SetupWizard';
import Clashes from './pages/Clashes';
import Timetables from './pages/Timetables';
import Reports from './pages/Reports';

export default function AdminPortalLayout() {
  return (
    <Routes>
      <Route index element={<AdminPortalPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="setup" element={<Sessions />} />
      <Route path="setup/new" element={<SetupWizard />} />
      <Route path="setup/:id/edit" element={<SetupWizard />} />
      <Route path="clashes" element={<Clashes />} />
      <Route path="timetables" element={<Timetables />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
