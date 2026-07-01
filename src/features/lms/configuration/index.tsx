import { Route, Routes, Navigate } from 'react-router-dom';
import CourseStructureMapping from './pages/CourseStructureMapping';
import FacultyMapping from './pages/FacultyMapping';
import StudentEnrollment from './pages/StudentEnrollment';
import CourseAssignment from './pages/CourseAssignment';
import BatchMapping from './pages/BatchMapping';

export default function Configuration() {
  return (
    <Routes>
      <Route index element={<Navigate to="course-structure" replace />} />
      <Route path="course-structure/*" element={<CourseStructureMapping />} />
      <Route path="faculty-mapping/*" element={<FacultyMapping />} />
      <Route path="student-enrollment/*" element={<StudentEnrollment />} />
      <Route path="course-assignment/*" element={<CourseAssignment />} />
      <Route path="batch-mapping/*" element={<BatchMapping />} />
    </Routes>
  );
}
