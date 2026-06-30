import { Route, Routes } from 'react-router-dom';
import List from './pages/List';
export default function ChartOfAccounts() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="*" element={<List />} />
    </Routes>
  );
}
