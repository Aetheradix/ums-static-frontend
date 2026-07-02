import { Route, Routes } from 'react-router-dom';
import List from './pages/List';

export default function CancelledBills() {
  return (
    <Routes>
      <Route index element={<List />} />
    </Routes>
  );
}
