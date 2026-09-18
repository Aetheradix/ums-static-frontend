import { Route, Routes } from 'react-router';
import List from './pages/List';

export default function StandingCommitteeDecision() {
  return (
    <Routes>
      <Route index element={<List />} />
    </Routes>
  );
}
