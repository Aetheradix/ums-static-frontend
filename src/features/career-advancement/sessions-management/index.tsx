import { Route, Routes } from 'react-router';
import List from './pages/List';

export default function SessionsManagement() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="*" element={<List />} />
    </Routes>
  );
}
