import { PortalSelector } from 'shared/new-components';
import { eventUrls } from '../urls';

export default function EventTicketingPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Event & Ticketing Management System"
      moduleDescription="Plan university events end-to-end — ticketing, registrations, QR check-in and attendance analytics."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Event Administrator',
          description:
            'Full control — create events, manage ticketing, review registrations and generate reports.',
          icon: 'admin_panel_settings',
          colorScheme: 'red',
          path: eventUrls.admin.portal,
        },
        {
          title: 'Organizer',
          description:
            'Create and manage your own events and monitor their registrations.',
          icon: 'campaign',
          colorScheme: 'blue',
          path: eventUrls.organizer.portal,
        },
        {
          title: 'Volunteer',
          description:
            'Scan tickets and check attendees in at the event entrance.',
          icon: 'how_to_reg',
          colorScheme: 'green',
          path: eventUrls.volunteer.portal,
        },
        {
          title: 'Attendee',
          description:
            'Browse upcoming events, register and view your tickets with QR passes.',
          icon: 'confirmation_number',
          colorScheme: 'purple',
          path: eventUrls.attendee.portal,
        },
      ]}
    />
  );
}
