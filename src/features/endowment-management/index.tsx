import { Route, Routes } from 'react-router-dom';
import EndowmentPortalPage from './portal/EndowmentPortalPage';

// We will import admin/student routes later as we build them.
import AdminRoutes from './admin';
import StudentRoutes from './student';
import MasterRoutes from './master';

export default function EndowmentManagementRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EndowmentPortalPage />} />
      <Route path="master/*" element={<MasterRoutes />} />
      <Route path="admin/*" element={<AdminRoutes />} />
      <Route path="student/*" element={<StudentRoutes />} />
    </Routes>
  );
}
