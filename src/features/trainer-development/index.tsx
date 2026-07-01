import { Route, Routes } from 'react-router-dom';

// Portal Pages
import TdmPortalPage from './portal/TdmPortalPage';

// Admin Portal
import AdminPortalPage from './admin/AdminPortalPage';
import AdminMastersPortalPage from './admin/AdminMastersPortalPage';
import AdminDashboard from './admin/pages/Dashboard';
import TrainingCategoryMaster from './admin/pages/masters/TrainingCategory';
import TrainingModeMaster from './admin/pages/masters/TrainingMode';
import CompetencyMaster from './admin/pages/masters/CompetencyMaster';
import CertificationMaster from './admin/pages/masters/CertificationMaster';
import VenueMaster from './admin/pages/masters/VenueMaster';
import TrainerRegistration from './admin/pages/TrainerRegistration';
import TrainingPlanning from './admin/pages/TrainingPlanning';

import TrainingSessions from './admin/pages/TrainingSessions';
import AdminAttendance from './admin/pages/Attendance';
import FeedbackManagement from './admin/pages/FeedbackManagement';
import PerformanceEvaluation from './admin/pages/PerformanceEvaluation';
import CertificateManagement from './admin/pages/CertificateManagement';
import ApprovalWorkflow from './admin/pages/ApprovalWorkflow';
import AdminReports from './admin/pages/Reports';
import AdminSettings from './admin/pages/Settings';

// Faculty Portal
import FacultyPortalPage from './faculty/FacultyPortalPage';
import FacultyDashboard from './faculty/pages/Dashboard';
import MyTrainings from './faculty/pages/MyTrainings';
import ApplyTraining from './faculty/pages/ApplyTraining';
import MyCertificates from './faculty/pages/MyCertificates';
import Competencies from './faculty/pages/Competencies';
import SelfAssessment from './faculty/pages/SelfAssessment';
import FacultyAttendance from './faculty/pages/Attendance';
import SubmitFeedback from './faculty/pages/Feedback';
import MyProfile from './faculty/pages/Profile';

// External Portal
import ExternalPortalPage from './external/ExternalPortalPage';
import ExternalDashboard from './external/pages/Dashboard';
import AssignedTrainings from './external/pages/AssignedTrainings';
import Schedule from './external/pages/Schedule';
import ExternalAttendance from './external/pages/Attendance';
import Materials from './external/pages/Materials';
import FeedbackView from './external/pages/FeedbackView';
import Honorarium from './external/pages/Honorarium';

export default function TrainerDevelopmentRoutes() {
  return (
    <Routes>
      <Route index element={<TdmPortalPage />} />

      {/* ── Admin ── */}
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="admin/masters" element={<AdminMastersPortalPage />} />
      <Route
        path="admin/masters/training-category"
        element={<TrainingCategoryMaster />}
      />
      <Route
        path="admin/masters/training-mode"
        element={<TrainingModeMaster />}
      />
      <Route path="admin/masters/competency" element={<CompetencyMaster />} />
      <Route
        path="admin/masters/certification"
        element={<CertificationMaster />}
      />
      <Route path="admin/masters/venue" element={<VenueMaster />} />
      <Route
        path="admin/trainer-registration"
        element={<TrainerRegistration />}
      />
      <Route path="admin/training-planning" element={<TrainingPlanning />} />

      <Route path="admin/training-sessions" element={<TrainingSessions />} />
      <Route path="admin/attendance" element={<AdminAttendance />} />
      <Route path="admin/feedback" element={<FeedbackManagement />} />
      <Route path="admin/performance" element={<PerformanceEvaluation />} />
      <Route path="admin/certificates" element={<CertificateManagement />} />
      <Route path="admin/approval-workflow" element={<ApprovalWorkflow />} />
      <Route path="admin/reports" element={<AdminReports />} />
      <Route path="admin/settings" element={<AdminSettings />} />

      {/* ── Faculty ── */}
      <Route path="faculty" element={<FacultyPortalPage />} />
      <Route path="faculty/dashboard" element={<FacultyDashboard />} />
      <Route path="faculty/my-trainings" element={<MyTrainings />} />
      <Route path="faculty/apply-training" element={<ApplyTraining />} />
      <Route path="faculty/my-certificates" element={<MyCertificates />} />
      <Route path="faculty/competencies" element={<Competencies />} />
      <Route path="faculty/self-assessment" element={<SelfAssessment />} />
      <Route path="faculty/attendance" element={<FacultyAttendance />} />
      <Route path="faculty/feedback" element={<SubmitFeedback />} />
      <Route path="faculty/profile" element={<MyProfile />} />

      {/* ── External Trainer ── */}
      <Route path="external" element={<ExternalPortalPage />} />
      <Route path="external/dashboard" element={<ExternalDashboard />} />
      <Route
        path="external/assigned-trainings"
        element={<AssignedTrainings />}
      />
      <Route path="external/schedule" element={<Schedule />} />
      <Route path="external/attendance" element={<ExternalAttendance />} />
      <Route path="external/materials" element={<Materials />} />
      <Route path="external/feedback" element={<FeedbackView />} />
      <Route path="external/honorarium" element={<Honorarium />} />
    </Routes>
  );
}
