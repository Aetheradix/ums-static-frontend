import { Route, Routes } from 'react-router-dom';
import List from './pages/List';
export default function CashFlow() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="*" element={<List />} />
    </Routes>
  );
}
