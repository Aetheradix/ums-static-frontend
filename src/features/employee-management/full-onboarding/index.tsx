import { Route, Routes } from 'react-router-dom';
import Create from './pages/Create';

export default function FullOnboarding() {
  return (
    <Routes>
      <Route index element={<Create />} />
      <Route path="create" element={<Create />} />
    </Routes>
  );
}
