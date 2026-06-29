import { PortalSelector } from 'shared/new-components';
import { activitiesUrls } from '../urls';

export default function ActivitiesPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Activities & Clubs"
      moduleDescription="Manage clubs, events, and memberships or join new clubs."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Student Portal',
          description: 'Join clubs, view events, and participate.',
          icon: 'person',
          colorScheme: 'blue',
          path: activitiesUrls.student.dashboard,
        },
        {
          title: 'Admin Portal',
          description: 'Manage clubs, events, and memberships.',
          icon: 'admin_panel_settings',
          colorScheme: 'purple',
          path: activitiesUrls.admin.portal,
        },
      ]}
    />
  );
}
