import { PortalSelector } from 'shared/new-components';
import { essentialServicesUrls } from '../urls';

export default function EmployeePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Employee Portal — Essential Services"
      moduleDescription="Submit and track your requests for facility bookings."
      backPath={essentialServicesUrls.portal}
      backLabel="Essential Services"
      portals={[
        {
          title: 'My Bookings & Requests',
          description:
            'Submit new requests for parking, guest houses, transport, or conference halls, and view your ticket history.',
          icon: 'receipt_long',
          colorScheme: 'teal',
          path: essentialServicesUrls.employee.bookings,
        },
      ]}
    />
  );
}
