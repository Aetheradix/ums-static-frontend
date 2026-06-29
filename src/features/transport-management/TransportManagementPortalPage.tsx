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
          path: '/transport-management/college-login/dashboard',
        },
        {
          title: 'Admin Login',
          description:
            'Manage transporters, vehicles, and global transport settings.',
          icon: 'admin_panel_settings',
          colorScheme: 'indigo',
          path: '/transport-management/admin-login/dashboard',
        },
      ]}
    />
  );
}
