import { Route, Routes, Navigate } from 'react-router-dom';
import ThesisPortalPage from './portal/ThesisPortalPage';
import StudentPortalLayout from './student';
import SupervisorPortalLayout from './supervisor';
import HodPortalLayout from './hod';
import CellPortalLayout from './cell';
import AdminPortalLayout from './admin';

export default function ThesisManagementRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Navigate to="/home/sub-menu/thesis-management-system" replace />
        }
      />
      <Route path="student/*" element={<StudentPortalLayout />} />
      <Route path="supervisor/*" element={<SupervisorPortalLayout />} />
      <Route path="hod/*" element={<HodPortalLayout />} />
      <Route path="cell/*" element={<CellPortalLayout />} />
      <Route path="admin/*" element={<AdminPortalLayout />} />
    </Routes>
  );
}
export {
  ThesisPortalPage,
  StudentPortalLayout,
  SupervisorPortalLayout,
  HodPortalLayout,
  CellPortalLayout,
  AdminPortalLayout,
};
