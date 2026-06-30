import { PortalSelector } from 'shared/new-components';
import { cfsUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="CFS Admin Portal"
      moduleDescription="Global content tracking, review overrides, and module settings."
      backPath={cfsUrls.root}
      backLabel="Portals"
      portals={[
        {
          title: 'Dashboard',
          description: 'CFS Metrics & Overview',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: cfsUrls.admin.dashboard,
        },
        {
          title: 'All Content',
          description: 'Global content tracking',
          icon: 'source',
          colorScheme: 'indigo',
          path: cfsUrls.admin.allContent,
        },
        {
          title: 'Tracking',
          description: 'Track content lifecycles',
          icon: 'timeline',
          colorScheme: 'teal',
          path: cfsUrls.tracking.list,
        },
        {
          title: 'Activity Logs',
          description: 'Audit logs tracking',
          icon: 'history',
          colorScheme: 'orange',
          path: cfsUrls.admin.activityLogs,
        },
        {
          title: 'Reports',
          description: 'Export and view reports',
          icon: 'analytics',
          colorScheme: 'purple',
          path: cfsUrls.admin.reports,
        },
        {
          title: 'Settings',
          description: 'Configure Categories & Workflows',
          icon: 'settings',
          colorScheme: 'red',
          path: cfsUrls.admin.settings.hub,
        },
      ]}
    />
  );
}
