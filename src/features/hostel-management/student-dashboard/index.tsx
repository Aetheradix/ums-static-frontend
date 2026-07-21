import { Route, Routes } from 'react-router-dom';
import StudentDashboard from '../dashboards-reports/pages/StudentDashboard';
import StudentMessMenu from './pages/StudentMessMenu';

export default function StudentDashboardModule() {
  return (
    <Routes>
      <Route index element={<StudentDashboard />} />
      <Route path="mess-menu" element={<StudentMessMenu />} />
    </Routes>
  );
}
