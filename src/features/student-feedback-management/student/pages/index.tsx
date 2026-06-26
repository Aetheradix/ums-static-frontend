import { Route, Routes } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import StudentFeedbackForm from './StudentFeedbackForm';

export default function StudentPages() {
  return (
    <Routes>
      <Route index element={<StudentDashboard />} />
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="form/:sessionId" element={<StudentFeedbackForm />} />
    </Routes>
  );
}
