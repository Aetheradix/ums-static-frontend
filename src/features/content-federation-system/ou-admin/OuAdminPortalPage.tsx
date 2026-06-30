import { PortalSelector } from 'shared/new-components';
import { cfsUrls } from '../urls';

export default function OuAdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="CFS OU Admin Portal"
      moduleDescription="Create, manage, and submit content for your Organizational Unit."
      backPath={cfsUrls.root}
      backLabel="Portals"
      portals={[
        {
          title: 'Dashboard',
          description: 'My OU Metrics & Overview',
          icon: 'dashboard',
          colorScheme: 'green',
          path: cfsUrls.ouAdmin.dashboard,
        },
        {
          title: 'Add Content',
          description: 'Draft new content submission',
          icon: 'add_circle',
          colorScheme: 'teal',
          path: cfsUrls.ouAdmin.addContent,
        },
        {
          title: 'My Content',
          description: 'Track drafts and submissions',
          icon: 'file_copy',
          colorScheme: 'indigo',
          path: cfsUrls.ouAdmin.myContent,
        },
        {
          title: 'Tracking',
          description: 'Track content lifecycles',
          icon: 'timeline',
          colorScheme: 'purple',
          path: cfsUrls.tracking.list,
        },
      ]}
    />
  );
}
