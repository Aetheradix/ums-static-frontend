import { Navigate, Route, Routes } from 'react-router';
import AcademicSessions from './admin/pages/AcademicSessions';
import Courses from './admin/pages/Courses';
import Dashboard from './admin/pages/Dashboard';
import Evaluation from './admin/pages/Evaluation';
import GradingScales from './admin/pages/GradingScales';
import Programmes from './admin/pages/Programmes';
import StudentEnrollment from './admin/pages/StudentEnrollment';
import FacultyAttendance from './faculty/pages/Attendance';
import MarkEntry from './faculty/pages/MarkEntry';
import FacultyMyCourses from './faculty/pages/MyCourses';
import StudentAttendance from './student/pages/Attendance';
import StudentTimetable from './student/pages/Timetable';

export default function Academics() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to="/home/sub-menu/academics" replace />}
      />
      <Route
        path="admin"
        element={<Navigate to="/home/sub-menu/academics-admin" replace />}
      />
      <Route path="admin/dashboard" element={<Dashboard />} />
      <Route path="admin/programmes" element={<Programmes />} />
      <Route path="admin/courses" element={<Courses />} />
      <Route path="admin/enrollment" element={<StudentEnrollment />} />
      <Route path="admin/academic-sessions" element={<AcademicSessions />} />
      <Route path="admin/evaluation" element={<Evaluation />} />
      <Route path="admin/grading" element={<GradingScales />} />

      <Route
        path="faculty"
        element={<Navigate to="/home/sub-menu/academics-faculty" replace />}
      />
      <Route path="faculty/my-courses" element={<FacultyMyCourses />} />
      <Route path="faculty/mark-entry" element={<MarkEntry />} />
      <Route path="faculty/attendance" element={<FacultyAttendance />} />

      <Route
        path="student"
        element={<Navigate to="/home/sub-menu/academics-student" replace />}
      />
      <Route path="student/attendance" element={<StudentAttendance />} />
      <Route path="student/timetable" element={<StudentTimetable />} />
    </Routes>
  );
}
