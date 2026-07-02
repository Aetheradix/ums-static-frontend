import { Route, Routes } from 'react-router-dom';
import MasterConfigurationPortalPage from '../portal/MasterConfigurationPortalPage';
import EndowmentMastersPage from './pages/EndowmentMastersPage';

export default function MasterRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MasterConfigurationPortalPage />} />
      <Route path="types" element={<EndowmentMastersPage />} />
    </Routes>
  );
}
