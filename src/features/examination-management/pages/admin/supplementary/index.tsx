import { Route, Routes } from 'react-router-dom';
import SupplementaryExamSetup from './SupplementaryExamSetup';

export default function SupplementaryPages() {
  return (
    <Routes>
      <Route index element={<SupplementaryExamSetup />} />
    </Routes>
  );
}
