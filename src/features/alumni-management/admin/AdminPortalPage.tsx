import { PortalSelector } from 'shared/new-components';
import { alumniUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Alumni Services"
      moduleDescription="Manage all alumni data, communications, and configurations."
      backPath={alumniUrls.root}
      backLabel="Alumni Services"
      portals={[
        {
          title: 'Dashboard',
          description: 'View key statistics and alumni activity at a glance.',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: alumniUrls.admin.dashboard,
        },
        {
          title: 'Registered Alumni',
          description: 'Review newly registered alumni awaiting verification.',
          icon: 'person_add',
          colorScheme: 'blue',
          path: alumniUrls.admin.registrationManagement.dashboard,
        },
        {
          title: 'Verified Alumni',
          description: 'Browse the main directory of all verified alumni.',
          icon: 'verified_user',
          colorScheme: 'green',
          path: alumniUrls.admin.verifiedAlumni,
        },
        {
          title: 'Communication',
          description: 'Send email campaigns and manage account activation.',
          icon: 'mail',
          colorScheme: 'purple',
          path: alumniUrls.admin.communication.emailCampaigns,
        },
        {
          title: 'Reports',
          description: 'Generate and view standard alumni reports.',
          icon: 'bar_chart',
          colorScheme: 'orange',
          path: alumniUrls.admin.reports,
        },
        {
          title: 'Settings',
          description:
            'Configure OU mapping, contribution areas, and registration rules.',
          icon: 'settings',
          colorScheme: 'red',
          path: alumniUrls.admin.settings.ouMapping,
        },
      ]}
    />
  );
}
