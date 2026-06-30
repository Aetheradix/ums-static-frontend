import { PortalSelector } from 'shared/new-components';

export default function AffiliationPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Affiliation Management System"
      moduleDescription="Manage college registration, approvals, and inspections."
      portals={[
        {
          title: 'Public',
          description: 'Public forms for college registration.',
          icon: 'public',
          colorScheme: 'green',
          path: '/affiliation-management-system/public',
        },
        {
          title: 'College Login',
          description: 'Manage college profile and inspections.',
          icon: 'domain',
          colorScheme: 'blue',
          path: '/affiliation-management-system/college-login',
        },
        {
          title: 'Admin Login',
          description: 'Manage approvals, settings, and reports.',
          icon: 'admin_panel_settings',
          colorScheme: 'red',
          path: '/affiliation-management-system/admin-login',
        },
      ]}
    />
  );
}
