import { Route, Routes } from 'react-router-dom';
import EventForm from '../admin/pages/EventForm';
import { eventUrls } from '../urls';
import OrganizerPortalPage from './OrganizerPortalPage';
import Dashboard from './pages/Dashboard';
import MyEvents from './pages/MyEvents';

export default function OrganizerPortalLayout() {
  return (
    <Routes>
      <Route index element={<OrganizerPortalPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="events" element={<MyEvents />} />
      <Route
        path="events/new"
        element={<EventForm eventsUrl={eventUrls.organizer.events} />}
      />
      <Route
        path="events/:id/edit"
        element={<EventForm eventsUrl={eventUrls.organizer.events} />}
      />
    </Routes>
  );
}
