import { PortalSelector } from 'shared/new-components';
import { legalUrls } from '../urls';

export default function DataEntryPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Data Entry Operator — Legal Case Management"
      moduleDescription="Register and update legal case records under the legal cell's supervision."
      backPath={legalUrls.portal}
      backLabel="Legal Case Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'Snapshot of the caseload you help maintain.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: legalUrls.dataEntry.dashboard,
        },
        {
          title: 'Register Case',
          description: 'Enter a new legal case into the register.',
          icon: 'note_add',
          colorScheme: 'green',
          path: legalUrls.dataEntry.caseNew,
        },
        {
          title: 'Case Register',
          description: 'Browse existing cases you have entered.',
          icon: 'gavel',
          colorScheme: 'purple',
          path: legalUrls.dataEntry.cases,
        },
      ]}
    />
  );
}
