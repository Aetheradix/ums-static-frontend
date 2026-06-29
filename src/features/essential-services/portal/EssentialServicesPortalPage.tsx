import { PortalSelector } from 'shared/new-components';
import { essentialServicesUrls } from '../urls';

export default function EssentialServicesPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Essential Services Guide"
      moduleDescription="Access guest house lodging, reserve conference halls, request parking slots, and coordinate official transport."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Define approval flows, adjust system parameters, view bookings, and manage expenditures and logs.',
          icon: 'admin_panel_settings',
          colorScheme: 'indigo',
          path: essentialServicesUrls.admin.portal,
        },
        {
          title: 'Employee Portal',
          description:
            'Submit booking requests for self or guests, and track verification progress.',
          icon: 'badge',
          colorScheme: 'teal',
          path: essentialServicesUrls.employee.portal,
        },
      ]}
    />
  );
}
