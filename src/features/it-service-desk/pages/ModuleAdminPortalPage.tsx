import { PortalSelector } from 'shared/new-components';
import { itsmUrls } from '../urls';

export default function ModuleAdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Module Admin Portal"
      moduleDescription="Manage tickets and settings for your assigned ERP modules."
      backPath={itsmUrls.portal}
      backLabel="IT Service Desk"
      portals={[
        {
          title: 'Dashboard',
          description: 'Module-scoped ticket KPIs and metrics.',
          icon: 'dashboard',
          colorScheme: 'green',
          path: itsmUrls.moduleAdmin.dashboard,
        },
        {
          title: 'Ticket Queue',
          description: 'Tickets from your assigned modules.',
          icon: 'list_alt',
          colorScheme: 'teal',
          path: itsmUrls.moduleAdmin.ticketQueue,
        },
        {
          title: 'My Tickets',
          description: 'Tickets created by you.',
          icon: 'confirmation_number',
          colorScheme: 'blue',
          path: itsmUrls.moduleAdmin.myTickets,
        },
        {
          title: 'Pending Approval',
          description: 'Tickets awaiting module-level approval.',
          icon: 'pending_actions',
          colorScheme: 'orange',
          path: itsmUrls.moduleAdmin.pendingApproval,
        },
        {
          title: 'Closed Tickets',
          description: 'Resolved and closed module tickets.',
          icon: 'check_circle',
          colorScheme: 'green',
          path: itsmUrls.moduleAdmin.closedTickets,
        },
        {
          title: 'Settings',
          description: 'Module-level configuration.',
          icon: 'settings',
          colorScheme: 'gray',
          path: itsmUrls.moduleAdmin.settings,
        },
      ]}
    />
  );
}
