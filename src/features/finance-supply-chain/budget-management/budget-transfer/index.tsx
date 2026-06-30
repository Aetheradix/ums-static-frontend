import { Route, Routes } from 'react-router-dom';
import List from './pages/List';
export default function BudgetTransfer() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="*" element={<List />} />
    </Routes>
  );
}
