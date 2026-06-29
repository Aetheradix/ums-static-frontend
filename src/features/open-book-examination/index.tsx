import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPages from './pages/admin';
import ReportPages from './pages/reports';
import StudentPages from './pages/student';
import TeacherPages from './pages/teacher';

export default function OpenBookExamPages() {
  return (
    <Routes>
      <Route index element={<Navigate to="admin/dashboard" replace />} />
      <Route path="admin/*" element={<AdminPages />} />
      <Route path="teacher/*" element={<TeacherPages />} />
      <Route path="student/*" element={<StudentPages />} />
      <Route path="reports/*" element={<ReportPages />} />
    </Routes>
  );
}
