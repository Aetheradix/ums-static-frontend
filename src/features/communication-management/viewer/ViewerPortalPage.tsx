import { PortalSelector } from 'shared/new-components';
import { commUrls } from '../urls';

export default function ViewerPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Read-only Viewer — Networking & Communication"
      moduleDescription="Read-only access to the communication dashboard and the full email and SMS delivery logs."
      backPath={commUrls.portal}
      backLabel="Communication Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'Volume overview and channel distribution.',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: commUrls.viewer.dashboard,
        },
        {
          title: 'Communication Logs',
          description: 'Browse the email and SMS delivery history (read-only).',
          icon: 'history',
          colorScheme: 'indigo',
          path: commUrls.viewer.logs,
        },
      ]}
    />
  );
}
