import { Route, Routes } from 'react-router-dom';
import FacultyPortalPage from './FacultyPortalPage';
import Dashboard from './pages/Dashboard';
import MySchedule from './pages/MySchedule';
import Substitutions from './pages/Substitutions';

export default function FacultyPortalLayout() {
  return (
    <Routes>
      <Route index element={<FacultyPortalPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="schedule" element={<MySchedule />} />
      <Route path="substitutions" element={<Substitutions />} />
    </Routes>
  );
}
