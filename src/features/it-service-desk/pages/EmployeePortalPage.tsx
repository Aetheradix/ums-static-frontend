import { PortalSelector } from 'shared/new-components';
import { itsmUrls } from '../urls';

export default function EmployeePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Employee Portal"
      moduleDescription="Raise support tickets and track their resolution."
      backPath={itsmUrls.portal}
      backLabel="IT Service Desk"
      portals={[
        {
          title: 'Dashboard',
          description: 'Your tickets overview and quick actions.',
          icon: 'dashboard',
          colorScheme: 'orange',
          path: itsmUrls.employee.dashboard,
        },
        {
          title: 'My Tickets',
          description: 'View and track all your tickets.',
          icon: 'confirmation_number',
          colorScheme: 'blue',
          path: itsmUrls.employee.myTickets,
        },
        {
          title: 'Create Ticket',
          description: 'Submit a new support request.',
          icon: 'add_circle',
          colorScheme: 'green',
          path: itsmUrls.createTicket,
        },
      ]}
    />
  );
}
