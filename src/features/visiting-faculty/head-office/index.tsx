import { Navigate, Route, Routes } from 'react-router-dom';
import Approvals from './pages/Approvals';
import BillApproval from './pages/BillApproval';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Reports from './pages/Reports';
import { vfUrls } from '../urls';

export default function HeadOfficeLogin() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to={vfUrls.headOffice.portal} replace />}
      />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="approvals" element={<Approvals />} />
      <Route path="bill-approval" element={<BillApproval />} />
      <Route path="faculty-register" element={<Register />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
