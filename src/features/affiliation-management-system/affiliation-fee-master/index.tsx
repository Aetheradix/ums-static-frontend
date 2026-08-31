import { Navigate, Route, Routes } from 'react-router-dom';
import List from './pages/List';
import CreateCourseFee from './pages/CreateCourseFee';
import CreateSpecialFee from './pages/CreateSpecialFee';
import Edit from './pages/Edit';

export default function AffiliationFeeMasterRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="list" />} />
      <Route path="list" element={<List />} />
      <Route path="create-course" element={<CreateCourseFee />} />
      <Route path="create-special" element={<CreateSpecialFee />} />
      <Route path="edit/:id" element={<Edit />} />
    </Routes>
  );
}
