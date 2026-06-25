import { PortalSelector } from 'shared/new-components';
import { academicsUrls } from '../urls';

export default function AcademicsPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Academic Management"
      moduleDescription="Access the academic management system based on your role."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Manage programmes, courses, enrollment, and academic settings.',
          icon: 'admin_panel_settings',
          colorScheme: 'blue',
          path: academicsUrls.admin.portal,
        },
        {
          title: 'Student Portal',
          description: 'View enrolled courses, grades, and term reports.',
          icon: 'school',
          colorScheme: 'green',
          path: academicsUrls.student.portal,
        },
        {
          title: 'Faculty Portal',
          description: 'Manage courses, enter marks and evaluation data.',
          icon: 'groups',
          colorScheme: 'purple',
          path: academicsUrls.faculty.portal,
        },
      ]}
    />
  );
}
