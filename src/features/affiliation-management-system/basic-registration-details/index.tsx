import { Route, Routes } from 'react-router';
import BasicRegistrationDetailsView from './pages/View';

export default function BasicRegistrationDetails() {
  return (
    <Routes>
      <Route path="view" element={<BasicRegistrationDetailsView />} />
      <Route index element={<BasicRegistrationDetailsView />} />
    </Routes>
  );
}
