import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';

export default function Dashboard() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
    </Routes>
  );
}
