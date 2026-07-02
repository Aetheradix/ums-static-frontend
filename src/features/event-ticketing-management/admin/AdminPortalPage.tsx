import { PortalSelector } from 'shared/new-components';
import { eventUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Event Administrator — Event & Ticketing Management"
      moduleDescription="Create and approve events, manage ticketing, review registrations and generate attendance reports."
      backPath={eventUrls.portal}
      backLabel="Event & Ticketing Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Events, registrations, revenue and attendance overview with charts.',
          icon: 'dashboard',
          colorScheme: 'red',
          path: eventUrls.admin.dashboard,
        },
        {
          title: 'Events',
          description:
            'Browse, create, edit and drill into all university events.',
          icon: 'event',
          colorScheme: 'blue',
          path: eventUrls.admin.events,
        },
        {
          title: 'Registrations',
          description:
            'Review attendee registrations, payment status and check-in state.',
          icon: 'groups',
          colorScheme: 'purple',
          path: eventUrls.admin.registrations,
        },
        {
          title: 'Reports',
          description:
            'Events by status and category, revenue and attendance analytics.',
          icon: 'assessment',
          colorScheme: 'amber',
          path: eventUrls.admin.reports,
        },
      ]}
    />
  );
}
