import { PortalSelector } from 'shared/new-components';
import { CONVOCATION_URLS } from '../urls';

export default function ConvocationPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Convocation Management"
      moduleDescription="Manage convocation events, registrations, passes, and degree dispatch"
      backPath="/"
      backLabel="Home"
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Create events, configure fees, verify student applications, and manage passes.',
          icon: 'admin_panel_settings',
          colorScheme: 'indigo',
          path: CONVOCATION_URLS.ADMIN.ROOT,
          badge: 'For University Staff',
        },
        {
          title: 'Student Portal',
          description:
            'Register for the ceremony, pay fees, upload documents, and download your pass.',
          icon: 'person',
          colorScheme: 'teal',
          path: CONVOCATION_URLS.STUDENT.ROOT,
          badge: 'For Graduating Students',
        },
      ]}
    />
  );
}
