import { Route, Routes } from 'react-router-dom';
import Students from './pages/Students';

export default function StudentsFeature() {
  return (
    <Routes>
      <Route index element={<Students />} />
    </Routes>
  );
}
