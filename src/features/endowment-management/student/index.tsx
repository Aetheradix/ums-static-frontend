import { Route, Routes } from 'react-router-dom';
import StudentPortalPage from './StudentPortalPage';
import StudentDashboardPage from './pages/dashboard/StudentDashboardPage';
import BrowseSchemesPage from './pages/schemes/BrowseSchemesPage';
import MyApplicationsPage from './pages/applications/MyApplicationsPage';
import MyAwardsPage from './pages/awards/MyAwardsPage';

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StudentPortalPage />} />
      <Route path="dashboard" element={<StudentDashboardPage />} />
      <Route path="schemes" element={<BrowseSchemesPage />} />
      <Route path="applications" element={<MyApplicationsPage />} />
      <Route path="awards" element={<MyAwardsPage />} />
    </Routes>
  );
}
