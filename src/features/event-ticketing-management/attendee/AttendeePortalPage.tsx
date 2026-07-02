import { PortalSelector } from 'shared/new-components';
import { eventUrls } from '../urls';

export default function AttendeePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Attendee — Event & Ticketing Management"
      moduleDescription="Browse upcoming events, register and view your tickets with QR passes."
      backPath={eventUrls.portal}
      backLabel="Event & Ticketing Management"
      portals={[
        {
          title: 'Browse Events',
          description: 'Discover upcoming university events and register.',
          icon: 'event',
          colorScheme: 'purple',
          path: eventUrls.attendee.browse,
        },
        {
          title: 'My Tickets',
          description: 'View your booked tickets and QR passes.',
          icon: 'confirmation_number',
          colorScheme: 'blue',
          path: eventUrls.attendee.tickets,
        },
      ]}
    />
  );
}
