import { Route, Routes } from 'react-router';
import CollegeAffiliationTracker from './pages/CollegeAffiliationTracker';

export default function CollegeAffiliationTrackerRoutes() {
  return (
    <Routes>
      <Route path="" element={<CollegeAffiliationTracker />} />
      <Route path="*" element={<CollegeAffiliationTracker />} />
    </Routes>
  );
}
