import { Route, Routes } from 'react-router-dom';
import Reports from '../admin/pages/Reports';
import { legalUrls } from '../urls';
import ViewerPortalPage from './ViewerPortalPage';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';

export default function ViewerPortalLayout() {
  return (
    <Routes>
      <Route index element={<ViewerPortalPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="cases" element={<CaseList />} />
      <Route
        path="reports"
        element={
          <Reports
            roleCrumb={{ url: legalUrls.viewer.portal, label: 'Case Viewer' }}
          />
        }
      />
    </Routes>
  );
}
