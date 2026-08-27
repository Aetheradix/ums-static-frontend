import { Route, Routes } from 'react-router';
import Create from './pages/Create';
import Update from './pages/Update';
import FeeSummaryMockup from './pages/FeeSummaryMockup';

export default function CollegeRegistration() {
  return (
    <Routes>
      <Route index element={<Create />} />
      <Route path="update" element={<Update />} />
      <Route path="fee-summary-mockup" element={<FeeSummaryMockup />} />
    </Routes>
  );
}
