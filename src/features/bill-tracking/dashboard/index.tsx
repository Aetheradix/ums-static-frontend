import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
export default function BillTrackingDashboard() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}
