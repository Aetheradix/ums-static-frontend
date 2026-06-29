import { Route, Routes } from 'react-router-dom';
import ApplicationForm from './pages/ApplicationForm';

export default function StudentApplicationForm() {
  return (
    <Routes>
      <Route index element={<ApplicationForm />} />
      <Route path="*" element={<ApplicationForm />} />
    </Routes>
  );
}
