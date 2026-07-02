import { PortalSelector } from 'shared/new-components';
import { commUrls } from '../urls';

export default function CommunicationPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Networking & Communication Management"
      moduleDescription="Send bulk email and SMS to employees and students, manage groups and mailing lists, and review the full communication log."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Communication Admin',
          description:
            'Full control — compose bulk email and SMS, manage groups and mailing lists, configure gateways and review logs.',
          icon: 'campaign',
          colorScheme: 'red',
          path: commUrls.admin.portal,
        },
        {
          title: 'Read-only Viewer',
          description:
            'Read-only access to the communication dashboard and delivery logs.',
          icon: 'visibility',
          colorScheme: 'teal',
          path: commUrls.viewer.portal,
        },
      ]}
    />
  );
}
