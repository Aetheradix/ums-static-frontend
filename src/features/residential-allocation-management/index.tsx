import { Navigate, Route, Routes } from 'react-router-dom';
import ResidentialNotification from './components/ResidentialNotification';
import { ResidentialAllocationProvider } from './context';
import AdminReview from './pages/AdminReview';
import CheckIn from './pages/CheckIn';
import Dashboard from './pages/Dashboard';
import EstateRegistry from './pages/EstateRegistry';
import FlatAllotment from './pages/FlatAllotment';
import LedgerInvoice from './pages/LedgerInvoice';
import StaffApply from './pages/StaffApply';

export default function ResidentialAllocationManagement() {
  return (
    <ResidentialAllocationProvider>
      <ResidentialNotification />
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="estate-registry" element={<EstateRegistry />} />
        <Route path="staff-apply" element={<StaffApply />} />
        <Route path="admin-review" element={<AdminReview />} />
        <Route path="flat-allotment" element={<FlatAllotment />} />
        <Route path="ledger-invoice" element={<LedgerInvoice />} />
        <Route path="check-in" element={<CheckIn />} />
      </Routes>
    </ResidentialAllocationProvider>
  );
}
