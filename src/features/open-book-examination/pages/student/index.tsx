import { Navigate, Route, Routes } from 'react-router-dom';
import StudentDashboard from './Dashboard';
import ExamInstructions from './ExamInstructions';
import ExamResources from './ExamResources';
import Receipt from './Receipt';
import Registration from './Registration';
import ResultDetail from './ResultDetail';
import Results from './Results';
import Revaluation from './Revaluation';
import Schedule from './Schedule';
import TakeExam from './TakeExam';

export default function StudentPages() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="registration" element={<Registration />} />
      <Route path="schedule" element={<Schedule />} />
      <Route path="exam/:id/instructions" element={<ExamInstructions />} />
      <Route path="exam/:id/resources" element={<ExamResources />} />
      <Route path="exam/:id/take" element={<TakeExam />} />
      <Route path="exam/:id/receipt" element={<Receipt />} />
      <Route path="results" element={<Results />} />
      <Route path="results/:id" element={<ResultDetail />} />
      <Route path="revaluation" element={<Revaluation />} />
    </Routes>
  );
}
