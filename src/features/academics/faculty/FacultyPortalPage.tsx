import { PortalSelector } from 'shared/new-components';
import { academicsUrls } from '../urls';

export default function FacultyPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Faculty Portal — Academics"
      moduleDescription="Manage courses and submit student marks."
      backPath={academicsUrls.portal}
      backLabel="Academic Management"
      portals={[
        {
          title: 'My Courses',
          description: 'View all courses assigned to you this semester.',
          icon: 'book',
          colorScheme: 'blue',
          path: academicsUrls.faculty.myCourses,
        },
        {
          title: 'Mark Entry',
          description: 'Enter and submit marks for students in your courses.',
          icon: 'edit_note',
          colorScheme: 'orange',
          path: academicsUrls.faculty.markEntry,
        },
      ]}
    />
  );
}
