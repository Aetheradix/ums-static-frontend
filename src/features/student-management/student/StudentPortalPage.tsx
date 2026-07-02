import { PortalSelector } from 'shared/new-components';
import { studentManagementUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Portal — Academics"
      moduleDescription="Manage your courses, attendance, exams, and academic history."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'My Dashboard',
          description: 'Academic overview',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: studentManagementUrls.student.dashboard,
        },
        {
          title: 'Academic Profile',
          description: 'View academic details',
          icon: 'person',
          colorScheme: 'indigo',
          path: studentManagementUrls.student.profile,
        },
        {
          title: 'Semester Registration',
          description: 'Register for next term',
          icon: 'how_to_reg',
          colorScheme: 'green',
          path: studentManagementUrls.student.semesterRegistration,
        },
        {
          title: 'Subject Selection',
          description: 'CBCS subject selection',
          icon: 'checklist',
          colorScheme: 'blue',
          path: studentManagementUrls.student.subjectSelection,
        },
        {
          title: 'My Courses',
          description: 'Current enrolled courses',
          icon: 'book',
          colorScheme: 'teal',
          path: studentManagementUrls.student.myCourses,
        },
        {
          title: 'Attendance',
          description: 'View attendance records',
          icon: 'event_available',
          colorScheme: 'orange',
          path: studentManagementUrls.student.attendance,
        },
        {
          title: 'Timetable',
          description: 'Class schedule',
          icon: 'calendar_month',
          colorScheme: 'purple',
          path: studentManagementUrls.student.timetable,
        },
        {
          title: 'LMS / Assignments',
          description: 'Learning management',
          icon: 'menu_book',
          colorScheme: 'blue',
          path: studentManagementUrls.student.lms,
        },
        {
          title: 'Term Report',
          description: 'View term report',
          icon: 'grade',
          colorScheme: 'orange',
          path: studentManagementUrls.student.termReport,
        },
        {
          title: 'Academic History',
          description: 'Complete record & ABC link',
          icon: 'history',
          colorScheme: 'teal',
          path: studentManagementUrls.student.academicHistory,
        },
        {
          title: 'Grievance',
          description: 'Submit grievances',
          icon: 'support_agent',
          colorScheme: 'red',
          path: studentManagementUrls.student.grievance,
        },
      ]}
    />
  );
}
