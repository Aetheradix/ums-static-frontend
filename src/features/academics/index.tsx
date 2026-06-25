import { Route, Routes } from 'react-router';
import AcademicSessions from './admin/pages/AcademicSessions';
import Dashboard from './admin/pages/Dashboard';
import Courses from './admin/pages/Courses';
import Evaluation from './admin/pages/Evaluation';
import GradingScales from './admin/pages/GradingScales';
import Programmes from './admin/pages/Programmes';
import StudentEnrollment from './admin/pages/StudentEnrollment';
import AdminPortalPage from './admin/AdminPortalPage';
import FacultyPortalPage from './faculty/FacultyPortalPage';
import MarkEntry from './faculty/pages/MarkEntry';
import FacultyMyCourses from './faculty/pages/MyCourses';
import AcademicsPortalPage from './portal/AcademicsPortalPage';
import StudentPortalPage from './student/StudentPortalPage';
import MyCourses from './student/pages/MyCourses';
import MyGrades from './student/pages/MyGrades';
import TermReport from './student/pages/TermReport';

export default function Academics() {
  return (
    <Routes>
      <Route index element={<AcademicsPortalPage />} />
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/dashboard" element={<Dashboard />} />
      <Route path="admin/programmes" element={<Programmes />} />
      <Route path="admin/courses" element={<Courses />} />
      <Route path="admin/enrollment" element={<StudentEnrollment />} />
      <Route path="admin/academic-sessions" element={<AcademicSessions />} />
      <Route path="admin/evaluation" element={<Evaluation />} />
      <Route path="admin/grading" element={<GradingScales />} />
      <Route path="student" element={<StudentPortalPage />} />
      <Route path="student/my-courses" element={<MyCourses />} />
      <Route path="student/my-grades" element={<MyGrades />} />
      <Route path="student/term-report" element={<TermReport />} />
      <Route path="faculty" element={<FacultyPortalPage />} />
      <Route path="faculty/my-courses" element={<FacultyMyCourses />} />
      <Route path="faculty/mark-entry" element={<MarkEntry />} />
    </Routes>
  );
}
