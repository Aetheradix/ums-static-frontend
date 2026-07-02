import { Route, Routes } from 'react-router';
import UpcomingRenewals from './pages/UpcomingRenewals';

export default function CollegeRenewalAdmin() {
  return (
    <Routes>
      <Route path="upcoming" element={<UpcomingRenewals />} />
    </Routes>
  );
}
