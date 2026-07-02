import { Route, Routes } from 'react-router-dom';
import ConvocationPortalPage from './portal/ConvocationPortalPage';

// We will import admin/student routes later as we build them.
import AdminRoutes from './admin';
import StudentRoutes from './student';

export default function ConvocationManagementRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ConvocationPortalPage />} />
      <Route path="admin/*" element={<AdminRoutes />} />
      <Route path="student/*" element={<StudentRoutes />} />
    </Routes>
  );
}
