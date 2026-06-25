import { Navigate, Route, Routes } from 'react-router-dom';
import Create from './pages/Create';

export default function EmployeeSelfAssessment() {
  return (
    <Routes>
      <Route path="" element={<Create />} />
      <Route path="create" element={<Create />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}
