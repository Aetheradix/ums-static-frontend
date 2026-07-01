import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
export default function BillTrackingStatus() {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="*" element={<Index />} />
    </Routes>
  );
}
