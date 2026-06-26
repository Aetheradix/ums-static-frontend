import { Routes, Route } from 'react-router-dom';
import ImportStudents from './admin/pages/ImportStudents';
import StudentList from './admin/pages/StudentList';
import LinkAbcAccount from './student/pages/LinkAbcAccount';
import StudentProfile from './student/profile/pages/StudentProfile';
import SubjectSelection from 'features/admission-portal/pages/SubjectSelection';
import StudentPortalPage from './student/StudentPortalPage';
import StudentManagementPortalPage from './StudentManagementPortalPage';

export default function StudentManagement() {
  return (
    <Routes>
      <Route path="" element={<StudentManagementPortalPage />} />
      <Route path="admin" element={<StudentList />} />
      <Route path="admin/import" element={<ImportStudents />} />
      <Route path="student" element={<StudentPortalPage />} />
      <Route path="student/link-abc" element={<LinkAbcAccount />} />
      <Route path="student/profile/*" element={<StudentProfile />} />
      <Route
        path="student/subject-selection"
        element={<SubjectSelection token="mock-token" />}
      />
    </Routes>
  );
}
