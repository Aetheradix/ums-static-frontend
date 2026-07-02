import { PortalSelector } from 'shared/new-components';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Login"
      moduleDescription="Manage approvals, settings, and reports."
      backPath="/home/sub-menu/affiliation-management-system"
      portals={[
        {
          title: 'College Registration Approvals',
          description: 'Manage college registration Approvals.',
          icon: 'edit_location',
          colorScheme: 'green',
          path: '/affiliation-management-system/registration-approval',
        },
        {
          title: 'Approval Status Report',
          description: 'View approval status of affiliations.',
          icon: 'check_circle',
          colorScheme: 'green',
          path: '/affiliation-management-system/approval-status-report',
        },
        {
          title: 'Inspection Status Report',
          description: 'View the history of inspections.',
          icon: 'policy',
          colorScheme: 'blue',
          path: '/affiliation-management-system/inspection-status-report',
        },
        {
          title: 'Affiliation Settings',
          description: 'Manage affiliation settings',
          icon: 'settings',
          colorScheme: 'red',
          path: '/home/sub-menu/affiliation-settings',
        },
        {
          title: 'Manage Renewals',
          description: 'Track and approve college renewals.',
          icon: 'event_repeat',
          colorScheme: 'purple',
          path: '/affiliation-management-system/college-renewal-admin/upcoming',
        },
      ]}
    />
  );
}
