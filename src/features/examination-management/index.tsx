import { Route, Routes } from 'react-router-dom';
import ApplicationsPages from './pages/admin/applications';
import AdminDashboard from './pages/admin/dashboard';
import DuplicateMarksheetPages from './pages/admin/duplicate-marksheet';
import EvaluatorPages from './pages/admin/evaluator';
import FeesPages from './pages/admin/fees';
import MarksPages from './pages/admin/marks';
import QuestionPaperPages from './pages/admin/question-paper';
import ReportsPages from './pages/admin/reports';
import ResultsPages from './pages/admin/results';
import RevaluationPages from './pages/admin/revaluation';
import SessionPages from './pages/admin/session';
import SetupPages from './pages/admin/setup';
import SupplementaryPages from './pages/admin/supplementary';
import StudentPages from './pages/student';

export default function ExaminationManagement() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="setup/*" element={<SetupPages />} />
      <Route path="fees/*" element={<FeesPages />} />
      <Route path="sessions/*" element={<SessionPages />} />
      <Route path="student-applications/*" element={<ApplicationsPages />} />
      <Route path="marks/*" element={<MarksPages />} />
      <Route path="results/*" element={<ResultsPages />} />
      <Route path="revaluation/*" element={<RevaluationPages />} />
      <Route path="supplementary/*" element={<SupplementaryPages />} />
      <Route
        path="duplicate-marksheet/*"
        element={<DuplicateMarksheetPages />}
      />
      <Route path="question-papers/*" element={<QuestionPaperPages />} />
      <Route path="evaluator/*" element={<EvaluatorPages />} />
      <Route path="reports/*" element={<ReportsPages />} />
      <Route path="student/*" element={<StudentPages />} />
    </Routes>
  );
}
