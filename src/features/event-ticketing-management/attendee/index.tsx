import { Route, Routes } from 'react-router-dom';
import AttendeePortalPage from './AttendeePortalPage';
import BrowseEvents from './pages/BrowseEvents';
import MyTickets from './pages/MyTickets';

export default function AttendeePortalLayout() {
  return (
    <Routes>
      <Route index element={<AttendeePortalPage />} />
      <Route path="browse" element={<BrowseEvents />} />
      <Route path="tickets" element={<MyTickets />} />
    </Routes>
  );
}
