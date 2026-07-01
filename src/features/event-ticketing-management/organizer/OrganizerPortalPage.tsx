import { PortalSelector } from 'shared/new-components';
import { eventUrls } from '../urls';

export default function OrganizerPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Organizer — Event & Ticketing Management"
      moduleDescription="Create and manage your own events and monitor their registrations."
      backPath={eventUrls.portal}
      backLabel="Event & Ticketing Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'Snapshot of the events you organize.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: eventUrls.organizer.dashboard,
        },
        {
          title: 'Create Event',
          description: 'Set up a new event with schedule, venue and ticketing.',
          icon: 'note_add',
          colorScheme: 'green',
          path: eventUrls.organizer.eventNew,
        },
        {
          title: 'My Events',
          description: 'Browse and edit the events you have created.',
          icon: 'event',
          colorScheme: 'purple',
          path: eventUrls.organizer.events,
        },
      ]}
    />
  );
}
