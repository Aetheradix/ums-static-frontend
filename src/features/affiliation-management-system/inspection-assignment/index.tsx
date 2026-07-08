import { Route, Routes } from 'react-router';
import InspectionAssignmentList from './pages/List';

export default function InspectionAssignment() {
  return (
    <Routes>
      <Route index element={<InspectionAssignmentList />} />
    </Routes>
  );
}
