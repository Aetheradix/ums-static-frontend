import { Navigate, Route, Routes } from 'react-router-dom';
import AcademicSessions from './AcademicSessions';
import AdmitCards from './AdmitCards';
import AuditLogs from './AuditLogs';
import Courses from './Courses';
import AdminDashboard from './Dashboard';
import Eligibility from './Eligibility';
import Evaluators from './Evaluators';
import ExamTypes from './ExamTypes';
import GradeCards from './GradeCards';
import Moderation from './Moderation';
import OpenBookPolicies from './OpenBookPolicies';
import Programs from './Programs';
import ResultPublishing from './ResultPublishing';
import RevaluationManagement from './RevaluationManagement';
import SubmissionMonitor from './SubmissionMonitor';
import SystemConfig from './SystemConfig';
import Users from './Users';

export default function AdminPages() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="academic-sessions" element={<AcademicSessions />} />
      <Route path="programs" element={<Programs />} />
      <Route path="courses" element={<Courses />} />
      <Route path="exam-types" element={<ExamTypes />} />
      <Route path="open-book-policies" element={<OpenBookPolicies />} />
      <Route path="users" element={<Users />} />
      <Route path="eligibility" element={<Eligibility />} />
      <Route path="admit-cards" element={<AdmitCards />} />
      <Route path="evaluators" element={<Evaluators />} />
      <Route path="submission-monitor" element={<SubmissionMonitor />} />
      <Route path="moderation" element={<Moderation />} />
      <Route path="result-publishing" element={<ResultPublishing />} />
      <Route path="revaluation" element={<RevaluationManagement />} />
      <Route path="config" element={<SystemConfig />} />
      <Route path="audit-logs" element={<AuditLogs />} />
      <Route path="grade-cards" element={<GradeCards />} />
    </Routes>
  );
}
