import { Route, Routes } from 'react-router-dom';

// Portal Selector
import LearningPortalPage from './LearningPortalPage';

// Admin Portal
import AdminPortalPage from './admin/AdminPortalPage';
import AdminDashboard from './dashboard/pages/AdminDashboard';
import Masters from './masters';
import Configuration from './configuration';
import AdminReports from './admin/pages/Reports';

// Teacher Portal
import TeacherPortalPage from './teacher/TeacherPortalPage';
import TeacherDashboard from './teacher/pages/Dashboard';
import ContentManagementPortal from './teacher/pages/ContentManagementPortal';
import MyCourses from './teacher/pages/MyCourses';
import ManageMaterials from './teacher/pages/ManageMaterials';
import ModuleManagement from './content-management/pages/ModuleManagement';
import ContentUpload from './content-management/pages/ContentUpload';
import AssessmentPortal from './teacher/pages/AssessmentPortal';
import QuestionBank from './teacher/pages/QuestionBank';
import PublishResults from './teacher/pages/PublishResults';
import QuizManagement from './assessment/pages/QuizManagement';
import AssignmentSubmissions from './assessment/pages/AssignmentSubmissions';
import ProgressPortal from './teacher/pages/ProgressPortal';
import StudentProgressList from './teacher/pages/StudentProgressList';
import CourseProgress from './progress-tracking/pages/CourseProgress';
import ModuleCompletion from './teacher/pages/ModuleCompletion';
import CertificatePortal from './teacher/pages/CertificatePortal';
import GenerateCertificate from './certification/pages/GenerateCertificate';
import ViewCertificate from './certification/pages/ViewCertificate';
import TeacherReports from './teacher/pages/Reports';

// Student Portal
import StudentPortalPage from './student/StudentPortalPage';
import StudentDashboard from './student/pages/Dashboard';
import MyLearning from './student/pages/MyLearning';
import StudentAssessments from './student/pages/StudentAssessments';
import StudentProgress from './student/pages/StudentProgress';
import StudentCertificates from './student/pages/StudentCertificates';
import StudentReports from './student/pages/Reports';

export default function Lms() {
  return (
    <Routes>
      <Route index element={<LearningPortalPage />} />

      {/* Admin Portal */}
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/dashboard/*" element={<AdminDashboard />} />
      <Route path="admin/masters/*" element={<Masters />} />
      <Route path="admin/configuration/*" element={<Configuration />} />
      <Route path="admin/reports/*" element={<AdminReports />} />

      {/* Teacher Portal */}
      <Route path="teacher" element={<TeacherPortalPage />} />
      <Route path="teacher/dashboard/*" element={<TeacherDashboard />} />
      <Route path="teacher/content" element={<ContentManagementPortal />} />
      <Route path="teacher/content/my-courses/*" element={<MyCourses />} />
      <Route path="teacher/content/modules/*" element={<ModuleManagement />} />
      <Route path="teacher/content/upload/*" element={<ContentUpload />} />
      <Route path="teacher/content/materials/*" element={<ManageMaterials />} />
      
      <Route path="teacher/assessment" element={<AssessmentPortal />} />
      <Route path="teacher/assessment/question-bank/*" element={<QuestionBank />} />
      <Route path="teacher/assessment/quizzes/*" element={<QuizManagement />} />
      <Route path="teacher/assessment/assignments/*" element={<AssignmentSubmissions />} />
      <Route path="teacher/assessment/publish/*" element={<PublishResults />} />

      <Route path="teacher/progress" element={<ProgressPortal />} />
      <Route path="teacher/progress/students/*" element={<StudentProgressList />} />
      <Route path="teacher/progress/courses/*" element={<CourseProgress />} />
      <Route path="teacher/progress/modules/*" element={<ModuleCompletion />} />

      <Route path="teacher/certificate" element={<CertificatePortal />} />
      <Route path="teacher/certificate/recommend/*" element={<GenerateCertificate />} />
      <Route path="teacher/certificate/status/*" element={<ViewCertificate />} />
      <Route path="teacher/reports/*" element={<TeacherReports />} />

      {/* Student Portal */}
      <Route path="student" element={<StudentPortalPage />} />
      <Route path="student/dashboard/*" element={<StudentDashboard />} />
      <Route path="student/my-learning/*" element={<MyLearning />} />
      <Route path="student/assessments/*" element={<StudentAssessments />} />
      <Route path="student/progress/*" element={<StudentProgress />} />
      <Route path="student/certificates/*" element={<StudentCertificates />} />
      <Route path="student/reports/*" element={<StudentReports />} />
    </Routes>
  );
}
