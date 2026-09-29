import { Route, Routes } from 'react-router';
import SpecialServiceRequestApprovalPage from './pages/SpecialServiceRequestApprovalPage';

export default function SpecialServiceRequestApproval() {
  return (
    <Routes>
      <Route path="" element={<SpecialServiceRequestApprovalPage />} />
    </Routes>
  );
}
