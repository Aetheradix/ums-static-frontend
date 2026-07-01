import { Route, Routes } from 'react-router-dom';
import SchedulerPortalPage from './SchedulerPortalPage';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Rooms from './pages/Rooms';

export default function SchedulerPortalLayout() {
  return (
    <Routes>
      <Route index element={<SchedulerPortalPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="assignments" element={<Assignments />} />
      <Route path="rooms" element={<Rooms />} />
    </Routes>
  );
}
