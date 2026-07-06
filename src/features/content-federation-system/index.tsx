import { Navigate, Route, Routes } from 'react-router-dom';

// Portal imports

// Page imports
import AllContentList from './pages/content/AllContentList';
import ContentForm from './pages/content/ContentForm';
import MyContentList from './pages/content/MyContentList';
import VersionHistory from './pages/content/VersionHistory';
import ViewContent from './pages/content/ViewContent';
import AdminDashboard from './pages/Dashboard';
import ReportsPage from './pages/reports/ReportsPage';
import PendingReviewQueue from './pages/review/PendingReviewQueue';
import ReviewDetail from './pages/review/ReviewDetail';
import ReviewHistory from './pages/review/ReviewHistory';
import ActivityLogsList from './pages/settings/ActivityLogsList';
import PublishingCategoriesList from './pages/settings/PublishingCategoriesList';
import SettingsHub from './pages/settings/SettingsHub';
import SubPublishingCategoriesList from './pages/settings/SubPublishingCategoriesList';
import WorkflowConfiguration from './pages/settings/WorkflowConfiguration';
import ContentLifecycle from './pages/tracking/ContentLifecycle';
import TrackingList from './pages/tracking/TrackingList';
import Unauthorized from './pages/Unauthorized';

export default function ContentFederationSystem() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to="/home/sub-menu/content-federation" replace />}
      />
      <Route
        path="admin"
        element={<Navigate to="/home/sub-menu/cfs-admin" replace />}
      />
      <Route
        path="ou-admin"
        element={<Navigate to="/home/sub-menu/cfs-ou-admin" replace />}
      />
      <Route
        path="reviewer"
        element={<Navigate to="/home/sub-menu/cfs-reviewer" replace />}
      />

      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="ou-admin/dashboard" element={<AdminDashboard />} />
      <Route path="reviewer/dashboard" element={<AdminDashboard />} />

      {/* Settings & Admin Setup */}
      <Route path="admin/settings" element={<SettingsHub />} />
      <Route
        path="admin/settings/publishing-categories"
        element={<PublishingCategoriesList />}
      />
      <Route
        path="admin/settings/sub-publishing-categories"
        element={<SubPublishingCategoriesList />}
      />
      <Route
        path="admin/settings/workflow"
        element={<WorkflowConfiguration />}
      />
      <Route path="admin/activity-logs" element={<ActivityLogsList />} />
      <Route path="admin/reports" element={<ReportsPage />} />

      {/* Content Form Routes */}
      <Route path="ou-admin/content/add" element={<ContentForm />} />
      <Route path="ou-admin/content/edit/:id" element={<ContentForm />} />
      <Route path="ou-admin/my-content" element={<MyContentList />} />
      <Route path="admin/all-content" element={<AllContentList />} />
      <Route path="content/view/:id" element={<ViewContent />} />
      <Route path="content/versions/:id" element={<VersionHistory />} />

      {/* Review Workflow Routes */}
      <Route path="reviewer/pending-review" element={<PendingReviewQueue />} />
      <Route path="reviewer/review/:id" element={<ReviewDetail />} />
      <Route path="reviewer/review-history" element={<ReviewHistory />} />

      {/* Tracking */}
      <Route path="tracking" element={<TrackingList />} />
      <Route path="tracking/lifecycle/:id" element={<ContentLifecycle />} />

      <Route path="unauthorized" element={<Unauthorized />} />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/home/sub-menu/content-federation" replace />}
      />
    </Routes>
  );
}
