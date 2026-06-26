import { Route, Routes } from 'react-router-dom';
import CourseStructureMapping from './pages/CourseStructureMapping';
import FacultyMapping from './pages/FacultyMapping';
import StudentEnrollment from './pages/StudentEnrollment';

export default function Configuration() {
  return (
    <Routes>
      <Route path="course-structure/*" element={<CourseStructureMapping />} />
      <Route path="faculty-mapping/*" element={<FacultyMapping />} />
      <Route path="student-enrollment/*" element={<StudentEnrollment />} />
    </Routes>
  );
}
