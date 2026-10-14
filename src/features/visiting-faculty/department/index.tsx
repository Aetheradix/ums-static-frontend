import { Navigate, Route, Routes } from 'react-router-dom';
import Applications from './pages/Applications';
import Attendance from './pages/Attendance';
import Bills from './pages/Bills';
import Dashboard from './pages/Dashboard';
import Faculty from './pages/Faculty';
import MeritList from './pages/MeritList';
import Reports from './pages/Reports';
import Interview from './pages/Interview';
import Scrutiny from './pages/Scrutiny';
import { vfUrls } from '../urls';

export default function DepartmentLogin() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to={vfUrls.department.portal} replace />}
      />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="applications" element={<Applications />} />
      <Route path="scrutiny" element={<Scrutiny />} />
      <Route path="interview" element={<Interview />} />
      <Route path="merit-list" element={<MeritList />} />
      <Route path="faculty" element={<Faculty />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="bills" element={<Bills />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
