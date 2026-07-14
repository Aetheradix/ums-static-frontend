import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import KpiDetailPage from './pages/KpiDetailPage';

export default function Dashboard() {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path=":kpiId" element={<KpiDetailPage />} />
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
}
