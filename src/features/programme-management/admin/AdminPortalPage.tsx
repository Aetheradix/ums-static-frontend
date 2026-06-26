import { PortalSelector } from 'shared/new-components';
import { programmeUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Programme Management"
      moduleDescription="Manage programmes and configure programme settings."
      backPath={programmeUrls.portal}
      backLabel="Programme Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'View programme stats, discipline splits, and quota distributions.',
          icon: 'dashboard',
          colorScheme: 'indigo',
          path: programmeUrls.admin.dashboard,
        },
        {
          title: 'Programmes',
          description: 'View, create, and manage academic programmes.',
          icon: 'menu_book',
          colorScheme: 'green',
          path: programmeUrls.admin.programmes,
        },
        {
          title: 'Settings',
          description: 'Configure disciplines, UGC degrees, quotas, and more.',
          icon: 'settings',
          colorScheme: 'orange',
          path: programmeUrls.admin.settings.portal,
        },
      ]}
    />
  );
}
