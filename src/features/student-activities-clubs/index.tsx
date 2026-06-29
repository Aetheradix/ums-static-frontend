import { Route, Routes } from 'react-router-dom';
import ActivitiesPortalPage from './portal/ActivitiesPortalPage';
import Dashboard from './admin/pages/Dashboard';
import ClubManagement from './admin/pages/ClubManagement';
import EventManagement from './admin/pages/EventManagement';
import Memberships from './admin/pages/Memberships';
import ActivityMaster from './admin/pages/ActivityMaster';
import ActivitiesAdminPortalPage from './admin/ActivitiesAdminPortalPage';
import StudentDashboard from './student/pages/Dashboard';
import BrowseClubs from './student/pages/BrowseClubs';

export default function StudentActivitiesClubs() {
  return (
    <Routes>
      <Route index element={<ActivitiesPortalPage />} />
      <Route path="admin" element={<ActivitiesAdminPortalPage />} />
      <Route path="admin/dashboard" element={<Dashboard />} />
      <Route path="admin/clubs" element={<ClubManagement />} />
      <Route path="admin/events" element={<EventManagement />} />
      <Route path="admin/memberships" element={<Memberships />} />
      <Route path="admin/activities" element={<ActivityMaster />} />

      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route path="student/browse" element={<BrowseClubs />} />
    </Routes>
  );
}
