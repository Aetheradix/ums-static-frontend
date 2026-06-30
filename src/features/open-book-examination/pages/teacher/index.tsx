import { Navigate, Route, Routes } from 'react-router-dom';
import AnswerViewer from './AnswerViewer';
import BulkImport from './BulkImport';
import TeacherDashboard from './Dashboard';
import EvaluationDashboard from './EvaluationDashboard';
import EvaluationProgress from './EvaluationProgress';
import ExamForm from './ExamForm';
import Exams from './Exams';
import PaperBuilder from './PaperBuilder';
import QuestionBank from './QuestionBank';
import QuestionForm from './QuestionForm';
import Resources from './Resources';
import RevaluationRequests from './RevaluationRequests';
import Rubrics from './Rubrics';
import StudentApprovals from './StudentApprovals';

export default function TeacherPages() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<TeacherDashboard />} />
      <Route path="exams" element={<Exams />} />
      <Route path="exams/create" element={<ExamForm />} />
      <Route path="exams/:id/edit" element={<ExamForm />} />
      <Route path="question-bank" element={<QuestionBank />} />
      <Route path="question-bank/create" element={<QuestionForm />} />
      <Route path="question-bank/:id/edit" element={<QuestionForm />} />
      <Route path="question-bank/import" element={<BulkImport />} />
      <Route path="paper-builder/:examId" element={<PaperBuilder />} />
      <Route path="resources" element={<Resources />} />
      <Route path="approvals" element={<StudentApprovals />} />
      <Route path="evaluation" element={<EvaluationDashboard />} />
      <Route path="evaluation/progress" element={<EvaluationProgress />} />
      <Route path="evaluation/:attemptId" element={<AnswerViewer />} />
      <Route path="rubrics" element={<Rubrics />} />
      <Route path="re-evaluation" element={<RevaluationRequests />} />
      <Route path="re-evaluation/:id" element={<RevaluationRequests />} />
    </Routes>
  );
}
