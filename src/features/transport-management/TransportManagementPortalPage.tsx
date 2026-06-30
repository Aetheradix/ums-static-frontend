import { PortalSelector } from 'shared/new-components';

export default function TransportManagementPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Transport Management"
      moduleDescription="Manage college transport, routes, and vehicles."
      portals={[
        {
          title: 'College Login',
          description: 'College transport configuration and setup.',
          icon: 'domain',
          colorScheme: 'orange',
          path: '/transport-management/college-login',
        },

        {
          title: 'Student Login',
          description:
            'Track bus, apply for transport leave, and view pickup details.',
          icon: 'person',
          colorScheme: 'green',
          path: '/transport-management/student-login',
        },
        {
          title: 'Admin Login',
          description:
            'Manage transporters, vehicles, and global transport settings.',
          icon: 'admin_panel_settings',
          colorScheme: 'indigo',
          path: '/transport-management/admin-login',
        },
      ]}
    />
  );
}
