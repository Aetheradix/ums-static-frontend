import { Routes, Route } from 'react-router-dom';
import ImportStudents from './admin/pages/ImportStudents';
import StudentList from './admin/pages/StudentList';
import LinkAbcAccount from './student/pages/LinkAbcAccount';
import StudentProfile from './student/profile/pages/StudentProfile';
import SubjectSelection from 'features/admission-portal/pages/SubjectSelection';
import StudentPortalPage from './student/StudentPortalPage';
import StudentManagementPortalPage from './StudentManagementPortalPage';
import StudentDashboard from './student/pages/Dashboard';
import AdminDashboard from './admin/pages/Dashboard';
import MyCourses from './student/pages/MyCourses';
import MyGrades from './student/pages/MyGrades';
import TermReport from './student/pages/TermReport';

export default function StudentManagement() {
  return (
    <Routes>
      <Route path="" element={<StudentManagementPortalPage />} />
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="admin/directory" element={<StudentList />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="admin/import" element={<ImportStudents />} />
      <Route path="student" element={<StudentPortalPage />} />
      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route path="student/link-abc" element={<LinkAbcAccount />} />
      <Route path="student/profile/*" element={<StudentProfile />} />
      <Route path="student/my-courses" element={<MyCourses />} />
      <Route path="student/my-grades" element={<MyGrades />} />
      <Route path="student/term-report" element={<TermReport />} />
      <Route
        path="student/subject-selection"
        element={<SubjectSelection token="mock-token" />}
      />
    </Routes>
  );
}
