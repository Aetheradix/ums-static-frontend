import { PortalSelector } from 'shared/new-components';
import { endowmentUrls } from '../urls';

export default function EndowmentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Endowment Management"
      moduleDescription="Manage endowment funds, donors, scholarships, and disbursements."
      backPath="/"
      backLabel="Back to Applications"
      portals={[
        {
          title: 'Master Configuration',
          description:
            'Configure Endowment Types, Award Types, and Eligibility.',
          icon: 'settings',
          colorScheme: 'purple',
          path: endowmentUrls.master.dashboard(),
        },
        {
          title: 'Admin Portal',
          description: 'Manage funds, donors, schemes, and disbursements.',
          icon: 'admin_panel_settings',
          colorScheme: 'green',
          path: endowmentUrls.admin.dashboard(),
        },
        {
          title: 'Student Portal',
          description: 'Browse eligible schemes and apply for awards.',
          icon: 'school',
          colorScheme: 'green',
          path: endowmentUrls.student.portal(),
        },
      ]}
    />
  );
}
