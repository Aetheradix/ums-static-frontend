import { PortalSelector } from 'shared/new-components';
import { estateUrls } from '../urls';

export default function EstatePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Estate Management System"
      moduleDescription="Manage university properties, infrastructure, buildings, roads, and maintenance operations."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Full estate administration — manage buildings, floors, rooms, roads, maintenance, and settings.',
          icon: 'admin_panel_settings',
          colorScheme: 'blue',
          path: estateUrls.admin.portal,
        },
        {
          title: 'View Only Portal',
          description:
            'View estate details, building records, and infrastructure reports without edit access.',
          icon: 'visibility',
          colorScheme: 'green',
          path: estateUrls.admin.dashboard,
        },
      ]}
    />
  );
}
