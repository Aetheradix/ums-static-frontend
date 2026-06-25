import { Route, Routes } from 'react-router-dom';
import AcademicYear from './academic-year';
import DegreeLevel from './degree-level';

export default function Other() {
  return (
    <Routes>
      <Route path="academic-year/*" element={<AcademicYear />} />
      <Route path="degree-level/*" element={<DegreeLevel />} />
    </Routes>
  );
}
