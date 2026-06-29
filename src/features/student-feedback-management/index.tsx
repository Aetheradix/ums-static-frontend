import { Route, Routes } from 'react-router-dom';
import Dashboard from './admin/pages/Dashboard';
import FeedbackSessions from './admin/pages/FeedbackSessions';
import QuestionBank from './admin/pages/QuestionBank';
import FeedbackTemplates from './admin/pages/FeedbackTemplates';
import FeedbackAssignmentPage from './admin/pages/FeedbackAssignment';
import StudentResponses from './admin/pages/StudentResponses';
import ReportsAnalytics from './admin/pages/ReportsAnalytics';
import Notifications from './admin/pages/Notifications';
import Settings from './admin/pages/Settings';
import FeedbackAdminPortalPage from './admin/FeedbackAdminPortalPage';
import FeedbackPortalPage from './portal/FeedbackPortalPage';
import StudentPages from './student/pages';

export default function StudentFeedbackManagement() {
  return (
    <Routes>
      <Route index element={<FeedbackPortalPage />} />
      <Route path="student/*" element={<StudentPages />} />
      <Route path="admin" element={<FeedbackAdminPortalPage />} />
      <Route path="admin/dashboard" element={<Dashboard />} />
      <Route path="admin/sessions" element={<FeedbackSessions />} />
      <Route path="admin/question-bank" element={<QuestionBank />} />
      <Route path="admin/templates" element={<FeedbackTemplates />} />
      <Route path="admin/assignments" element={<FeedbackAssignmentPage />} />
      <Route path="admin/responses" element={<StudentResponses />} />
      <Route path="admin/reports" element={<ReportsAnalytics />} />
      <Route path="admin/notifications" element={<Notifications />} />
      <Route path="admin/settings" element={<Settings />} />
    </Routes>
  );
}
