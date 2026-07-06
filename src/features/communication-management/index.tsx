import { Route, Routes, Navigate } from 'react-router-dom';
import CommunicationPortalPage from './portal/CommunicationPortalPage';
import AdminPortalLayout from './admin';
import ViewerPortalLayout from './viewer';

export default function CommunicationManagementRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Navigate
            to="/home/sub-menu/communication-management-system"
            replace
          />
        }
      />
      <Route path="admin/*" element={<AdminPortalLayout />} />
      <Route path="viewer/*" element={<ViewerPortalLayout />} />
    </Routes>
  );
}

export { CommunicationPortalPage, AdminPortalLayout, ViewerPortalLayout };
