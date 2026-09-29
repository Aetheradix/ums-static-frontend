import { Route, Routes } from 'react-router';
import SpecialServiceRequestsPage from './pages/SpecialServiceRequestsPage';

export default function SpecialServiceRequests() {
  return (
    <Routes>
      <Route path="/" element={<SpecialServiceRequestsPage />} />
    </Routes>
  );
}
