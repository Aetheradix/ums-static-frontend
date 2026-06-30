import { PortalSelector } from 'shared/new-components';
import { smsUrls } from '../urls';

export default function SecurityPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Security Management System"
      moduleDescription="Access the Security Management System based on your role."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Super Admin',
          description:
            'Full system access — masters, incidents, helplines, guidelines, awareness programs, reports and settings.',
          icon: 'admin_panel_settings',
          colorScheme: 'red',
          path: smsUrls.superAdmin.portal,
        },
        {
          title: 'Security Admin',
          description:
            'Manage incidents, assign officers, track investigations and generate reports.',
          icon: 'security',
          colorScheme: 'blue',
          path: smsUrls.securityAdmin.portal,
        },
        {
          title: 'Security Officer',
          description:
            'View assigned cases, conduct investigations, update resolution and close incidents.',
          icon: 'shield',
          colorScheme: 'orange',
          path: smsUrls.officer.portal,
        },
        {
          title: 'Employee Portal',
          description:
            'Report incidents, track your cases, view helplines, guidelines and awareness programs.',
          icon: 'groups',
          colorScheme: 'green',
          path: smsUrls.employee.portal,
        },
        {
          title: 'Student Portal',
          description:
            'Report incidents, track status, view university helplines and safety guidelines.',
          icon: 'school',
          colorScheme: 'purple',
          path: smsUrls.student.portal,
        },
      ]}
    />
  );
}
