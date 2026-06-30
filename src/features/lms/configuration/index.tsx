import { Route, Routes, Navigate } from 'react-router-dom';
import CourseStructureMapping from './pages/CourseStructureMapping';
import FacultyMapping from './pages/FacultyMapping';
import StudentEnrollment from './pages/StudentEnrollment';

export default function Configuration() {
  return (
    <Routes>
      <Route index element={<Navigate to="course-structure" replace />} />
      <Route path="course-structure/*" element={<CourseStructureMapping />} />
      <Route path="faculty-mapping/*" element={<FacultyMapping />} />
      <Route path="student-enrollment/*" element={<StudentEnrollment />} />
    </Routes>
  );
}
