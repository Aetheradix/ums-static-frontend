import { Route, Routes } from 'react-router';
import Create from './pages/Create';
import List from './pages/List';

export default function DepartmentRegistration() {
  return (
    <Routes>
      <Route path="list" element={<List />} />
      <Route path="create" element={<Create />} />
      <Route path="update/:id" element={<Create />} />
    </Routes>
  );
}
