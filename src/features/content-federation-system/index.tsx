import { Route, Routes, Navigate } from 'react-router-dom';

// Portal imports
import ContentFederationPortalPage from './ContentFederationPortalPage';
import AdminPortalPage from './admin/AdminPortalPage';
import OuAdminPortalPage from './ou-admin/OuAdminPortalPage';
import ReviewerPortalPage from './reviewer/ReviewerPortalPage';

// Page imports
import AdminDashboard from './pages/Dashboard';
import SettingsHub from './pages/settings/SettingsHub';
import PublishingCategoriesList from './pages/settings/PublishingCategoriesList';
import SubPublishingCategoriesList from './pages/settings/SubPublishingCategoriesList';
import WorkflowConfiguration from './pages/settings/WorkflowConfiguration';
import ContentForm from './pages/content/ContentForm';
import MyContentList from './pages/content/MyContentList';
import ContentLifecycle from './pages/tracking/ContentLifecycle';
import ActivityLogsList from './pages/settings/ActivityLogsList';
import PendingReviewQueue from './pages/review/PendingReviewQueue';
import ViewContent from './pages/content/ViewContent';
import AllContentList from './pages/content/AllContentList';
import ReviewDetail from './pages/review/ReviewDetail';
import TrackingList from './pages/tracking/TrackingList';
import ReviewHistory from './pages/review/ReviewHistory';
import VersionHistory from './pages/content/VersionHistory';
import ReportsPage from './pages/reports/ReportsPage';
import Unauthorized from './pages/Unauthorized';

export default function ContentFederationSystem() {
  return (
    <Routes>
      <Route index element={<ContentFederationPortalPage />} />
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="ou-admin" element={<OuAdminPortalPage />} />
      <Route path="reviewer" element={<ReviewerPortalPage />} />

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
      <Route path="*" element={<Navigate to="/content-federation" replace />} />
    </Routes>
  );
}
