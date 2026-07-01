import { Route, Routes } from 'react-router-dom';
import AchievementsCertificatesPage from './admin/pages/achievements-certificates/AchievementsCertificatesPage';
import EquipmentIssueReturnPage from './admin/pages/booking-management/EquipmentIssueReturnPage';
import AdminGroundCourtBookingPage from './admin/pages/booking-management/GroundCourtBookingPage';
import EventCreationPage from './admin/pages/event-tournament/EventCreationPage';
import FixturesResultsPage from './admin/pages/event-tournament/FixturesResultsPage';
import AchievementAwardTypeMasterPage from './admin/pages/sports-master/AchievementAwardTypeMasterPage';
import EquipmentMasterPage from './admin/pages/sports-master/EquipmentMasterPage';
import FacilityMasterPage from './admin/pages/sports-master/FacilityMasterPage';
import SportsGamesMasterPage from './admin/pages/sports-master/SportsGamesMasterPage';
import SquadTrialSelectionPage from './admin/pages/team-management/SquadTrialSelectionPage';
import TeamCreationPage from './admin/pages/team-management/TeamCreationPage';
import AdminPortalPage from './admin/portal/AdminPortalPage';

import MasterConfigurationPortalPage from './portal/MasterConfigurationPortalPage';
import SportsManagementPortalPage from './portal/SportsManagementPortalPage';

import StudentGroundCourtBookingPage from './student/pages/booking-management/GroundCourtBookingPage';
import StudentSportsDashboardPage from './student/pages/dashboard/StudentSportsDashboardPage';
import EventRegistrationPage from './student/pages/event-tournament/EventRegistrationPage';
import SportsRegistrationPage from './student/pages/student-sports-profile/SportsRegistrationPage';
import StudentPortalPage from './student/portal/StudentPortalPage';

export default function SportsManagement() {
  return (
    <Routes>
      {/* 1. Portal Landing Page */}
      <Route index element={<SportsManagementPortalPage />} />

      {/* STUDENT PORTAL */}
      <Route path="student" element={<StudentPortalPage />} />
      <Route
        path="student/dashboard"
        element={<StudentSportsDashboardPage />}
      />
      <Route
        path="student/profile/registration"
        element={<SportsRegistrationPage />}
      />
      <Route
        path="student/events/registration"
        element={<EventRegistrationPage />}
      />
      <Route
        path="student/booking/facility"
        element={<StudentGroundCourtBookingPage />}
      />

      {/* ADMIN PORTAL */}
      <Route path="admin" element={<AdminPortalPage />} />

      {/* MASTER PORTAL */}
      <Route path="master" element={<MasterConfigurationPortalPage />} />

      {/* Master Configuration */}
      <Route path="master/sports" element={<SportsGamesMasterPage />} />
      <Route path="master/facilities" element={<FacilityMasterPage />} />
      <Route path="master/equipment" element={<EquipmentMasterPage />} />
      <Route
        path="master/achievements"
        element={<AchievementAwardTypeMasterPage />}
      />

      {/* Team Management */}
      <Route path="admin/teams/creation" element={<TeamCreationPage />} />
      <Route
        path="admin/teams/squad-selection"
        element={<SquadTrialSelectionPage />}
      />

      {/* Event Management */}
      <Route path="admin/events/creation" element={<EventCreationPage />} />
      <Route
        path="admin/events/fixtures-results"
        element={<FixturesResultsPage />}
      />

      {/* Booking & Equipment */}
      <Route
        path="admin/booking/facility"
        element={<AdminGroundCourtBookingPage />}
      />
      <Route
        path="admin/booking/equipment"
        element={<EquipmentIssueReturnPage />}
      />

      {/* Achievements & Certificates */}
      <Route
        path="admin/achievements/record"
        element={<AchievementsCertificatesPage />}
      />

      <Route path="*" element={<SportsManagementPortalPage />} />
    </Routes>
  );
}
