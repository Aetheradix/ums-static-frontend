import { Route, Routes } from 'react-router-dom';
import FeeApprovalPage from './pages/FeeApprovalPage';

export default function StudentFeeApproval() {
  return (
    <Routes>
      <Route path="/*" element={<FeeApprovalPage />} />
    </Routes>
  );
}
