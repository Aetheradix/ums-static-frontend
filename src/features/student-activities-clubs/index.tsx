import { Route, Routes, Navigate } from 'react-router-dom';

import Dashboard from './admin/pages/Dashboard';
import ClubManagement from './admin/pages/ClubManagement';
import EventManagement from './admin/pages/EventManagement';
import Memberships from './admin/pages/Memberships';
import ActivityMaster from './admin/pages/ActivityMaster';
import ActivityRegistrations from './admin/pages/ActivityRegistrations';
import ActivitiesAdminPortalPage from './admin/ActivitiesAdminPortalPage';
import StudentDashboard from './student/pages/Dashboard';
import BrowseClubs from './student/pages/BrowseClubs';
import ApplyActivity from './student/pages/ApplyActivity';

export default function StudentActivitiesClubs() {
  return (
    <Routes>
      <Route
        index
        element={
          <Navigate to="/home/sub-menu/student-activities-clubs" replace />
        }
      />
      <Route path="admin" element={<ActivitiesAdminPortalPage />} />
      <Route path="admin/dashboard" element={<Dashboard />} />
      <Route path="admin/clubs" element={<ClubManagement />} />
      <Route path="admin/events" element={<EventManagement />} />
      <Route path="admin/memberships" element={<Memberships />} />
      <Route path="admin/activities" element={<ActivityMaster />} />
      <Route path="admin/registrations" element={<ActivityRegistrations />} />

      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route path="student/browse" element={<BrowseClubs />} />
      <Route path="student/apply" element={<ApplyActivity />} />
    </Routes>
  );
}
