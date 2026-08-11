import { Route, Routes } from 'react-router';
import List from './pages/List';

export default function StandingCommitteeMeeting() {
  return (
    <Routes>
      <Route index element={<List />} />
    </Routes>
  );
}
