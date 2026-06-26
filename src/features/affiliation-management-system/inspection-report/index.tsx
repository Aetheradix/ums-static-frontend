import { Route, Routes } from 'react-router';
import Create from './pages/Create';

export default function InspectionReport() {
  return (
    <Routes>
      <Route path="/" element={<Create />} />
    </Routes>
  );
}
