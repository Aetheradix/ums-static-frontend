import { Navigate, Route, Routes } from 'react-router-dom';
import { GrievanceProvider } from './context';
import GrievanceNotification from './components/GrievanceNotification';
import Dashboard from './pages/Dashboard';
import GrievanceCategory from './pages/GrievanceCategory';
import GrievanceCommittee from './pages/GrievanceCommittee';
import GrievanceCategoryUserMapping from './pages/GrievanceCategoryUserMapping';
import GrievanceUserMapping from './pages/GrievanceUserMapping';
import Grievances from './pages/Grievances';
import PublicGrievances from './pages/PublicGrievances';
import Reports from './pages/Reports';

export default function GrievanceManagement() {
  return (
    <GrievanceProvider>
      <GrievanceNotification />
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="categories" element={<GrievanceCategory />} />
        <Route path="committees" element={<GrievanceCommittee />} />
        <Route
          path="category-user-mapping"
          element={<GrievanceCategoryUserMapping />}
        />
        <Route
          path="grievance-user-mapping"
          element={<GrievanceUserMapping />}
        />
        <Route path="grievances" element={<Grievances />} />
        <Route path="public-grievances" element={<PublicGrievances />} />
        <Route path="reports" element={<Reports />} />
      </Routes>
    </GrievanceProvider>
  );
}
