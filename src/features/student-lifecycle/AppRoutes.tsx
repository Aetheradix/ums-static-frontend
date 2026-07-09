import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UniversityLoader } from 'shared/components/progress';

// Portals entry selectors
import StudentPortalPage from './portal/StudentPortalPage';
import FacultyPortalPage from './portal/FacultyPortalPage';
import AdminPortalPage from './portal/AdminPortalPage';

// Student Portal Pages
const StudentDashboard = React.lazy(() => import('./student/pages/Dashboard'));
const StudentAdmission = React.lazy(() => import('./student/pages/Admission'));
const StudentCourses = React.lazy(() => import('./student/pages/Courses'));
const StudentRegistration = React.lazy(
  () => import('./student/pages/Registration')
);
const StudentAssessment = React.lazy(
  () => import('./student/pages/Assessment')
);
const StudentExaminations = React.lazy(
  () => import('./student/pages/Examinations')
);
const StudentResults = React.lazy(() => import('./student/pages/Results'));
const StudentDegreeAudit = React.lazy(
  () => import('./student/pages/DegreeAudit')
);
const StudentServices = React.lazy(() => import('./student/pages/Services'));
const StudentFees = React.lazy(() => import('./student/pages/Fees'));
const StudentProfile = React.lazy(() => import('./student/pages/Profile'));
const StudentNotifications = React.lazy(
  () => import('./student/pages/Notifications')
);

// Faculty Portal Pages
const FacultyDashboard = React.lazy(() => import('./faculty/pages/Dashboard'));
const FacultyClassList = React.lazy(() => import('./faculty/pages/ClassList'));
const FacultyAttendance = React.lazy(
  () => import('./faculty/pages/Attendance')
);
const FacultyMarksEntry = React.lazy(
  () => import('./faculty/pages/MarksEntry')
);

// Admin Portal Pages
const AdminDashboard = React.lazy(() => import('./admin/pages/Dashboard'));
const AdminUsers = React.lazy(() => import('./admin/pages/Users'));
const AdminStudents = React.lazy(() => import('./admin/pages/Students'));
const AdminMasters = React.lazy(() => import('./admin/pages/Masters'));
const AdminFees = React.lazy(() => import('./admin/pages/Fees'));
const AdminAnnouncements = React.lazy(
  () => import('./admin/pages/Announcements')
);
const AdminReports = React.lazy(() => import('./admin/pages/Reports'));
const AdminRoles = React.lazy(() => import('./admin/pages/Roles'));
const AdminSettings = React.lazy(() => import('./admin/pages/Settings'));

export default function AppRoutes() {
  return (
    <Suspense
      fallback={<UniversityLoader text="Loading lifecycle modules..." />}
    >
      <Routes>
        {/* Redirect /student-lifecycle → canonical SubMenu entry point */}
        <Route
          index
          element={<Navigate to="/home/sub-menu/student-lifecycle" replace />}
        />

        {/* Student Portal Routes */}
        <Route path="student">
          <Route index element={<StudentPortalPage />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="admission" element={<StudentAdmission />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="registration" element={<StudentRegistration />} />
          <Route path="assessment" element={<StudentAssessment />} />
          <Route path="examinations" element={<StudentExaminations />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="degree-audit" element={<StudentDegreeAudit />} />
          <Route path="services" element={<StudentServices />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="notifications" element={<StudentNotifications />} />
        </Route>

        {/* Faculty Portal Routes */}
        <Route path="faculty">
          <Route index element={<FacultyPortalPage />} />
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="class-list" element={<FacultyClassList />} />
          <Route path="attendance" element={<FacultyAttendance />} />
          <Route path="marks-entry" element={<FacultyMarksEntry />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route path="admin">
          <Route index element={<AdminPortalPage />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="masters" element={<AdminMasters />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="roles" element={<AdminRoles />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
