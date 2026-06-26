import { PortalSelector } from 'shared/new-components';
import { academicsUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Portal — Academics"
      moduleDescription="View your courses, grades, and academic progress."
      backPath={academicsUrls.portal}
      backLabel="Academic Management"
      portals={[
        {
          title: 'My Courses',
          description: 'View all courses you are currently enrolled in.',
          icon: 'book',
          colorScheme: 'blue',
          path: academicsUrls.student.myCourses,
        },
        {
          title: 'My Grades',
          description: 'Check your marks and grades for all subjects.',
          icon: 'grade',
          colorScheme: 'green',
          path: academicsUrls.student.myGrades,
        },
        {
          title: 'Term Report',
          description: 'View your semester performance summary and SGPA.',
          icon: 'description',
          colorScheme: 'purple',
          path: academicsUrls.student.termReport,
        },
      ]}
    />
  );
}
