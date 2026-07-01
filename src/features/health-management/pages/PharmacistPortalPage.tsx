import { PortalSelector } from 'shared/new-components';
import { hmsUrls } from '../urls';

export default function PharmacistPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Pharmacist Portal"
      moduleDescription="Dispense medicines and manage medical stock inventory."
      backPath={hmsUrls.portal}
      backLabel="Health Services"
      portals={[
        {
          title: 'Dispensary',
          description: 'Dispense prescribed medicines.',
          icon: 'medication',
          colorScheme: 'purple',
          path: hmsUrls.dispensary,
        },
        {
          title: 'Medical Stock',
          description: 'Manage medicine inventory and expiry tracking.',
          icon: 'inventory_2',
          colorScheme: 'indigo',
          path: hmsUrls.stock,
        },
      ]}
    />
  );
}
