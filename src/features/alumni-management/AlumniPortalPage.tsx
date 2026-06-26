import { PortalSelector } from 'shared/new-components';
import { alumniUrls } from './urls';

export default function AlumniPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Alumni Services"
      moduleDescription="Manage alumni records, communications, and more."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Manage alumni registrations, directory, communications, reports, and settings.',
          icon: 'admin_panel_settings',
          colorScheme: 'teal',
          path: alumniUrls.admin.portal,
        },
        {
          title: 'User Portal',
          description:
            'View and manage your alumni profile, qualifications, and contributions.',
          icon: 'person',
          colorScheme: 'blue',
          path: alumniUrls.user.portal,
        },
      ]}
    />
  );
}
