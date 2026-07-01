import { Route, Routes } from 'react-router-dom';
import LegalCasePortalPage from './portal/LegalCasePortalPage';
import AdminPortalLayout from './admin';
import DataEntryPortalLayout from './data-entry';
import ViewerPortalLayout from './viewer';

export default function LegalCaseManagementRoutes() {
  return (
    <Routes>
      <Route index element={<LegalCasePortalPage />} />
      <Route path="admin/*" element={<AdminPortalLayout />} />
      <Route path="data-entry/*" element={<DataEntryPortalLayout />} />
      <Route path="viewer/*" element={<ViewerPortalLayout />} />
    </Routes>
  );
}

export {
  LegalCasePortalPage,
  AdminPortalLayout,
  DataEntryPortalLayout,
  ViewerPortalLayout,
};
