import { Route, Routes, Navigate } from 'react-router-dom';
import EventTicketingPortalPage from './portal/EventTicketingPortalPage';
import AdminPortalLayout from './admin';
import OrganizerPortalLayout from './organizer';
import VolunteerPortalLayout from './volunteer';
import AttendeePortalLayout from './attendee';

export default function EventTicketingRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Navigate
            to="/home/sub-menu/event-ticketing-management-system"
            replace
          />
        }
      />
      <Route path="admin/*" element={<AdminPortalLayout />} />
      <Route path="organizer/*" element={<OrganizerPortalLayout />} />
      <Route path="volunteer/*" element={<VolunteerPortalLayout />} />
      <Route path="attendee/*" element={<AttendeePortalLayout />} />
    </Routes>
  );
}

export {
  EventTicketingPortalPage,
  AdminPortalLayout,
  OrganizerPortalLayout,
  VolunteerPortalLayout,
  AttendeePortalLayout,
};
