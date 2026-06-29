import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import Masters from './masters';
import Configuration from './configuration';
import ContentManagement from './content-management';
import Assessment from './assessment';
import ProgressTracking from './progress-tracking';
import Certification from './certification';
import LearningPortalPage from './LearningPortalPage';

export default function Lms() {
  return (
    <Routes>
      <Route index element={<LearningPortalPage />} />
      <Route path="dashboard/*" element={<Dashboard />} />
      <Route path="masters/*" element={<Masters />} />
      <Route path="configuration/*" element={<Configuration />} />
      <Route path="content-management/*" element={<ContentManagement />} />
      <Route path="assessment/*" element={<Assessment />} />
      <Route path="progress-tracking/*" element={<ProgressTracking />} />
      <Route path="certification/*" element={<Certification />} />
    </Routes>
  );
}
