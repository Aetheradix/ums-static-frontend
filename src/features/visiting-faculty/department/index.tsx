import { Navigate, Route, Routes } from 'react-router-dom';
import { ScopeProvider } from '../components/scope';
import Attendance from './pages/Attendance';
import BillReview from './pages/BillReview';
import Dashboard from './pages/Dashboard';
import Faculty from './pages/Faculty';
import MeritReview from './pages/MeritReview';
import Reports from './pages/Reports';
import { vfUrls } from '../urls';

/**
 * UTD Department login — reviews what its branch HODs forward: merit lists
 * go on to the Registrar & VC, bills go on to Finance.
 */
export default function DepartmentLogin() {
  return (
    <ScopeProvider role="utd">
      <Routes>
        <Route
          index
          element={<Navigate to={vfUrls.department.portal} replace />}
        />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="merit-review" element={<MeritReview />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="bill-review" element={<BillReview />} />
        <Route path="reports" element={<Reports />} />
      </Routes>
    </ScopeProvider>
  );
}
