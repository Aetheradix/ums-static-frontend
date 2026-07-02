import { Route, Routes, Navigate } from 'react-router-dom';
import StudentConvocationDashboard from './pages/dashboard/StudentConvocationDashboard';
import RegistrationFormPage from './pages/registration/RegistrationFormPage';
import ConvocationPassPage from './pages/pass/ConvocationPassPage';

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<StudentConvocationDashboard />} />
      <Route path="registration" element={<RegistrationFormPage />} />
      <Route path="pass" element={<ConvocationPassPage />} />
    </Routes>
  );
}
