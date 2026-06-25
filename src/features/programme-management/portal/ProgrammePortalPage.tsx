import { PortalSelector } from 'shared/new-components';
import { programmeUrls } from '../urls';

export default function ProgrammePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Programme Management"
      moduleDescription="Manage academic programmes, disciplines, and programme settings."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Admin Portal',
          description: 'Configure and manage all academic programme settings.',
          icon: 'admin_panel_settings',
          colorScheme: 'blue',
          path: programmeUrls.admin.portal,
        },
      ]}
    />
  );
}
