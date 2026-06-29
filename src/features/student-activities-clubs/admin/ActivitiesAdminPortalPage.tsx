import { Navigate } from 'react-router-dom';
import { activitiesUrls } from '../urls';

export default function ActivitiesAdminPortalPage() {
  return <Navigate to={activitiesUrls.admin.dashboard} replace />;
}
