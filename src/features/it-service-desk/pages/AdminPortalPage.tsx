import { PortalSelector } from 'shared/new-components';
import { itsmUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Service Desk Admin Portal"
      moduleDescription="Complete module control: manage tickets, agents, SLA rules, reports, activity logs, and system settings."
      backPath={itsmUrls.portal}
      backLabel="IT Service Desk"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Full KPI overview: tickets, SLA, agent workload, and trends.',
          icon: 'dashboard',
          colorScheme: 'indigo',
          path: itsmUrls.admin.dashboard,
        },
        {
          title: 'Ticket Queue',
          description: 'All tickets with advanced filters.',
          icon: 'list_alt',
          colorScheme: 'blue',
          path: itsmUrls.admin.ticketQueue,
        },
        {
          title: 'My Tickets',
          description: 'Tickets created by you.',
          icon: 'confirmation_number',
          colorScheme: 'teal',
          path: itsmUrls.admin.myTickets,
        },
        {
          title: 'Assigned Tickets',
          description: 'Tickets assigned to other agents.',
          icon: 'assignment_ind',
          colorScheme: 'purple',
          path: itsmUrls.admin.assignedTickets,
        },
        {
          title: 'Pending Approval',
          description: 'Tickets awaiting your approval.',
          icon: 'pending_actions',
          colorScheme: 'orange',
          path: itsmUrls.admin.pendingApproval,
        },
        {
          title: 'Closed Tickets',
          description: 'All resolved and closed tickets.',
          icon: 'check_circle',
          colorScheme: 'green',
          path: itsmUrls.admin.closedTickets,
        },
        {
          title: 'Spam',
          description: 'Flagged and spam tickets.',
          icon: 'report',
          colorScheme: 'red',
          path: itsmUrls.admin.spam,
        },
        {
          title: 'Reports',
          description: 'Analytics by agent, module, SLA, priority, and more.',
          icon: 'bar_chart',
          colorScheme: 'amber',
          path: itsmUrls.admin.reports,
        },
        {
          title: 'Activity Logs',
          description: 'Complete audit trail of all ticket events.',
          icon: 'history',
          colorScheme: 'pink',
          path: itsmUrls.admin.activityLogs,
        },
        {
          title: 'Knowledge Base',
          description: 'Manage KB articles and categories.',
          icon: 'menu_book',
          colorScheme: 'teal',
          path: itsmUrls.knowledgeBase,
        },
        {
          title: 'Settings',
          description: 'Configure services, SLA, agents, and notifications.',
          icon: 'settings',
          colorScheme: 'gray',
          path: itsmUrls.admin.settings,
        },
      ]}
    />
  );
}
