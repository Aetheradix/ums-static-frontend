import { Route, Routes } from 'react-router-dom';
import StudentProfile from './pages/StudentProfile';

export default function StudentProfileModule() {
  return (
    <Routes>
      <Route index element={<StudentProfile />} />
      <Route path="*" element={<StudentProfile />} />
    </Routes>
  );
}
