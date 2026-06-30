import { PortalSelector } from 'shared/new-components';
import { rtiUrls } from '../urls';

export default function RTIAdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — RTI Management"
      moduleDescription="Register, track, and manage RTI applications across departments."
      backPath={rtiUrls.portal}
      backLabel="RTI Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'View stats, deadlines, department performance, and trends.',
          icon: 'dashboard',
          colorScheme: 'indigo',
          path: rtiUrls.admin.dashboard,
        },
        {
          title: 'Register RTI',
          description: 'Register new RTI applications with applicant details.',
          icon: 'post_add',
          colorScheme: 'blue',
          path: rtiUrls.admin.register,
        },
        {
          title: 'RTI Inbox',
          description:
            'View all RTIs with search, filters, and color-coded status.',
          icon: 'inbox',
          colorScheme: 'green',
          path: rtiUrls.admin.inbox,
        },
        {
          title: 'Pending Actions',
          description: 'Review department replies and issue final responses.',
          icon: 'pending_actions',
          colorScheme: 'orange',
          path: rtiUrls.admin.pendingActions,
        },
        {
          title: 'Appeals',
          description: 'Manage FAA and SAA appeals with review workflow.',
          icon: 'balance',
          colorScheme: 'purple',
          path: rtiUrls.admin.appeals,
        },
        {
          title: 'Reports & Analytics',
          description: 'Analyze RTI data with charts and export options.',
          icon: 'bar_chart',
          colorScheme: 'red',
          path: rtiUrls.admin.reports,
        },
        {
          title: 'Settings',
          description: 'Configure RTI parameters and system-wide settings.',
          icon: 'settings',
          colorScheme: 'gray',
          path: rtiUrls.admin.settings,
        },
      ]}
    />
  );
}
