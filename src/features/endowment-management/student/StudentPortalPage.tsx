import { PortalSelector } from 'shared/new-components';
import { endowmentUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Endowment Student Portal"
      moduleDescription="Apply for endowment schemes and track your applications."
      backPath={endowmentUrls.portal()}
      backLabel="Back to Endowment Portal"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Overview of your applications and awarded scholarships.',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: endowmentUrls.student.dashboard(),
        },
        {
          title: 'Browse Schemes',
          description: 'View open schemes and check your eligibility.',
          icon: 'search',
          colorScheme: 'teal',
          path: endowmentUrls.student.browseSchemes(),
        },
        {
          title: 'My Applications',
          description: 'Track the status of your scheme applications.',
          icon: 'folder_open',
          colorScheme: 'teal',
          path: endowmentUrls.student.myApplications(),
        },
        {
          title: 'My Awards',
          description: 'View selected awards and download certificates.',
          icon: 'workspace_premium',
          colorScheme: 'teal',
          path: endowmentUrls.student.myAwards(),
        },
      ]}
    />
  );
}
