import { Route, Routes } from 'react-router-dom';
import QuizManagement from './pages/QuizManagement';
import AssignmentSubmissions from './pages/AssignmentSubmissions';

export default function Assessment() {
  return (
    <Routes>
      <Route path="quiz-management/*" element={<QuizManagement />} />
      <Route
        path="assignment-submissions/*"
        element={<AssignmentSubmissions />}
      />
    </Routes>
  );
}
