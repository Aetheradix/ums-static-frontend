import { Route, Routes } from 'react-router-dom';
import GSTReport from './pages/GSTReport';

export default function GSTTaxReport() {
  return (
    <Routes>
      <Route index element={<GSTReport />} />
      <Route path="*" element={<GSTReport />} />
    </Routes>
  );
}
