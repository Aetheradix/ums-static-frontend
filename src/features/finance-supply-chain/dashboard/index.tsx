import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';

export default function Dashboard() {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
}
