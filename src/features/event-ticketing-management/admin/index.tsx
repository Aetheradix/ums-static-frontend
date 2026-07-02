import { Route, Routes } from 'react-router-dom';
import AdminPortalPage from './AdminPortalPage';
import Dashboard from './pages/Dashboard';
import EventList from './pages/EventList';
import EventForm from './pages/EventForm';
import EventDetail from './pages/EventDetail';
import Registrations from './pages/Registrations';
import Reports from './pages/Reports';

export default function AdminPortalLayout() {
  return (
    <Routes>
      <Route index element={<AdminPortalPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="events" element={<EventList />} />
      <Route path="events/new" element={<EventForm />} />
      <Route path="events/:id/edit" element={<EventForm />} />
      <Route path="events/:id" element={<EventDetail />} />
      <Route path="registrations" element={<Registrations />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
