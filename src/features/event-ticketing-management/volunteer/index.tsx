import { Route, Routes } from 'react-router-dom';
import VolunteerPortalPage from './VolunteerPortalPage';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';

export default function VolunteerPortalLayout() {
  return (
    <Routes>
      <Route index element={<VolunteerPortalPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="check-in" element={<CheckIn />} />
    </Routes>
  );
}
