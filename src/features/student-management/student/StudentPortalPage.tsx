import { PortalSelector } from 'shared/new-components';
import { studentManagementUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Portal — Academics"
      moduleDescription="View your courses, grades, and academic progress."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Student Profile',
          description: 'Manage your personal and academic profile.',
          icon: 'person',
          colorScheme: 'indigo',
          path: studentManagementUrls.student.profile,
        },

        {
          title: 'My Courses',
          description: 'View all courses you are currently enrolled in.',
          icon: 'book',
          colorScheme: 'blue',
          path: '/student-management/student/my-courses',
        },
        {
          title: 'My Grades',
          description: 'Check your marks and grades for all subjects.',
          icon: 'grade',
          colorScheme: 'green',
          path: '/student-management/student/my-grades',
        },
        {
          title: 'Term Report',
          description: 'View your semester performance summary and SGPA.',
          icon: 'description',
          colorScheme: 'purple',
          path: '/student-management/student/term-report',
        },
        {
          title: 'Link ABC Account',
          description: 'Connect your Academic Bank of Credits (ABC) account.',
          icon: 'link',
          colorScheme: 'teal',
          path: studentManagementUrls.student.linkAbc,
        },
        {
          title: 'Subject Selection',
          description: 'Choose your subjects and electives for the programme.',
          icon: 'checklist',
          colorScheme: 'orange',
          path: '/student-management/student/subject-selection',
        },
      ]}
    />
  );
}
