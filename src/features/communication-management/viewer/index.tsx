import { Route, Routes } from 'react-router-dom';
import Logs from '../admin/pages/Logs';
import { commUrls } from '../urls';
import ViewerPortalPage from './ViewerPortalPage';
import Dashboard from './pages/Dashboard';

export default function ViewerPortalLayout() {
  return (
    <Routes>
      <Route index element={<ViewerPortalPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route
        path="logs"
        element={
          <Logs
            roleCrumb={{
              url: commUrls.viewer.portal,
              label: 'Read-only Viewer',
            }}
          />
        }
      />
    </Routes>
  );
}
