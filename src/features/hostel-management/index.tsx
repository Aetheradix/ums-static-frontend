import { Navigate, Route, Routes } from 'react-router-dom';
import { HostelProvider } from './context';
import HostelNotification from './components/HostelNotification';
import AdminDesk from './pages/AdminDesk';
import CheckIn from './pages/CheckIn';
import HostelRegistry from './pages/HostelRegistry';
import LedgerInvoice from './pages/LedgerInvoice';
import RoomAllotment from './pages/RoomAllotment';
import RoomConfiguration from './pages/RoomConfiguration';
import StudentApply from './pages/StudentApply';

export default function HostelManagement() {
  return (
    <HostelProvider>
      {/* Floating notification bar — reads from shared context */}
      <HostelNotification />

      <Routes>
        {/* Default: redirect to the first step */}
        <Route index element={<Navigate to="hostel-registry" replace />} />

        {/* Step 1 */}
        <Route path="hostel-registry" element={<HostelRegistry />} />

        {/* Step 2 */}
        <Route path="room-configuration" element={<RoomConfiguration />} />

        {/* Step 3 */}
        <Route path="student-apply" element={<StudentApply />} />

        {/* Step 4 (admin side — allotment) */}
        <Route path="room-allotment" element={<RoomAllotment />} />

        {/* Step 5 (admin review) */}
        <Route path="admin-desk" element={<AdminDesk />} />

        {/* Step 6 */}
        <Route path="ledger-invoice" element={<LedgerInvoice />} />

        {/* Step 7 */}
        <Route path="check-in" element={<CheckIn />} />
      </Routes>
    </HostelProvider>
  );
}
