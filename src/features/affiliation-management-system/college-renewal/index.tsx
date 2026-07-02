import { Route, Routes } from 'react-router-dom';
import RenewalApplication from './pages/RenewalApplication';

export default function CollegeRenewal() {
  return (
    <Routes>
      <Route path="application" element={<RenewalApplication />} />
    </Routes>
  );
}
