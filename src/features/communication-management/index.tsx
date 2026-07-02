import { Route, Routes } from 'react-router-dom';
import CommunicationPortalPage from './portal/CommunicationPortalPage';
import AdminPortalLayout from './admin';
import ViewerPortalLayout from './viewer';

export default function CommunicationManagementRoutes() {
  return (
    <Routes>
      <Route index element={<CommunicationPortalPage />} />
      <Route path="admin/*" element={<AdminPortalLayout />} />
      <Route path="viewer/*" element={<ViewerPortalLayout />} />
    </Routes>
  );
}

export { CommunicationPortalPage, AdminPortalLayout, ViewerPortalLayout };
