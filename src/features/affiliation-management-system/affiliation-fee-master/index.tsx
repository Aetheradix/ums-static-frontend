import { Navigate, Route, Routes } from 'react-router-dom';
import List from './pages/List';
import Create from './pages/Create';
import Edit from './pages/Edit';

export default function AffiliationFeeMasterRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="list" />} />
      <Route path="list" element={<List />} />
      <Route path="create" element={<Create />} />
      <Route path="edit/:id" element={<Edit />} />
    </Routes>
  );
}
