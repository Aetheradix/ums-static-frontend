import { PortalSelector } from 'shared/new-components';
import { endowmentUrls } from '../urls';

export default function MasterConfigurationPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Endowment Master Configuration"
      moduleDescription="Configure master data for endowment funds, awards, and eligibility."
      backPath={endowmentUrls.portal()}
      backLabel="Back to Endowment Portal"
      portals={[
        {
          title: 'Endowment Types',
          description: 'Manage types of endowments (e.g. Chair, Scholarship).',
          icon: 'category',
          colorScheme: 'purple',
          path: endowmentUrls.master.types(),
        },
      ]}
    />
  );
}
