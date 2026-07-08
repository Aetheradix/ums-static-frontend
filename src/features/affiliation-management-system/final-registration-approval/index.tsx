import { Route, Routes } from 'react-router';
import FinalRegistrationApprovalList from './pages/List';

export default function FinalRegistrationApproval() {
  return (
    <Routes>
      <Route index element={<FinalRegistrationApprovalList />} />
    </Routes>
  );
}
