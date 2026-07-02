import { PortalSelector } from 'shared/new-components';
import { eventUrls } from '../urls';

export default function VolunteerPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Volunteer — Event & Ticketing Management"
      moduleDescription="Scan tickets and check attendees in at the event entrance."
      backPath={eventUrls.portal}
      backLabel="Event & Ticketing Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'Check-in progress across events.',
          icon: 'dashboard',
          colorScheme: 'green',
          path: eventUrls.volunteer.dashboard,
        },
        {
          title: 'Check-In',
          description: 'Scan and check attendees in as they arrive.',
          icon: 'how_to_reg',
          colorScheme: 'blue',
          path: eventUrls.volunteer.checkIn,
        },
      ]}
    />
  );
}
