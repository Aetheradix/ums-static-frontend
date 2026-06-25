import { Route, Routes } from 'react-router';
import Initiate from './pages/Initiate';
import List from './pages/List';

export default function AparApplication() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="all" element={<List />} />
      <Route path="initiate" element={<Initiate />} />
      <Route path="initiate/:id" element={<Initiate />} />
    </Routes>
  );
}
