import { PortalSelector } from 'shared/new-components';
import { lmsUrls } from '../urls';

export default function LmsPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Leave Management System"
      moduleDescription="Access the leave management system based on your role."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Manage leave types, policies, attendance, biometric, LTC and generate reports.',
          icon: 'admin_panel_settings',
          colorScheme: 'blue',
          path: lmsUrls.admin.portal,
        },
        {
          title: 'Teacher Portal',
          description:
            'Apply leaves, track requests, manage student leave approvals.',
          icon: 'groups',
          colorScheme: 'green',
          path: lmsUrls.teacher.portal,
        },
        {
          title: 'Student Portal',
          description:
            'Apply for leave, track attendance, view leave balance and biometric records.',
          icon: 'school',
          colorScheme: 'purple',
          path: lmsUrls.student.portal,
        },
      ]}
    />
  );
}
