import { Routes, Route, Navigate } from 'react-router-dom';
import ImportStudents from './admin/pages/ImportStudents';
import StudentList from './admin/pages/StudentList';
import LinkAbcAccount from './student/pages/LinkAbcAccount';
import StudentProfile from './student/profile/pages/StudentProfile';
import SubjectSelection from './student/pages/SubjectSelection';

import StudentDashboard from './student/pages/Dashboard';
import AdminDashboard from './admin/pages/Dashboard';
import MyCourses from './student/pages/MyCourses';
import MyGrades from './student/pages/MyGrades';
import TermReport from './student/pages/TermReport';

// New Student imports
import SemesterRegistration from './student/pages/SemesterRegistration';
import AcademicHistory from './student/pages/AcademicHistory';
import Grievance from './student/pages/Grievance';

// Faculty imports

import FacultyDashboard from './faculty/pages/Dashboard';
import InternalAssessment from './faculty/pages/InternalAssessment';
import StudentProgress from './faculty/pages/StudentProgress';

// Department imports

import DepartmentDashboard from './department/pages/Dashboard';
import BatchAllocation from './department/pages/BatchAllocation';
import SectionAllocation from './department/pages/SectionAllocation';
import SubjectMapping from './department/pages/SubjectMapping';
import SemesterPromotion from './department/pages/SemesterPromotion';

export default function StudentManagement() {
  return (
    <Routes>
      <Route
        path=""
        element={<Navigate to="/home/sub-menu/student-management" replace />}
      />
      <Route
        path="admin"
        element={<Navigate to="/home/sub-menu/student-admin" replace />}
      />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="admin/directory" element={<StudentList />} />
      <Route path="admin/import" element={<ImportStudents />} />

      <Route
        path="student"
        element={<Navigate to="/home/sub-menu/student-student" replace />}
      />
      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route path="student/link-abc" element={<LinkAbcAccount />} />
      <Route path="student/profile/*" element={<StudentProfile />} />
      <Route path="student/my-courses" element={<MyCourses />} />
      <Route path="student/my-grades" element={<MyGrades />} />
      <Route path="student/term-report" element={<TermReport />} />
      <Route path="student/subject-selection" element={<SubjectSelection />} />

      <Route
        path="student/semester-registration"
        element={<SemesterRegistration />}
      />
      <Route path="student/academic-history" element={<AcademicHistory />} />
      <Route path="student/grievance" element={<Grievance />} />

      {/* Faculty routes */}
      <Route
        path="faculty"
        element={<Navigate to="/home/sub-menu/student-faculty" replace />}
      />
      <Route path="faculty/dashboard" element={<FacultyDashboard />} />
      <Route
        path="faculty/internal-assessment"
        element={<InternalAssessment />}
      />
      <Route path="faculty/progress" element={<StudentProgress />} />

      {/* Department routes */}
      <Route
        path="department"
        element={<Navigate to="/home/sub-menu/student-department" replace />}
      />
      <Route path="department/dashboard" element={<DepartmentDashboard />} />
      <Route path="department/batch-allocation" element={<BatchAllocation />} />
      <Route
        path="department/section-allocation"
        element={<SectionAllocation />}
      />
      <Route path="department/subject-mapping" element={<SubjectMapping />} />
      <Route path="department/promotion" element={<SemesterPromotion />} />
    </Routes>
  );
}
