import { PortalSelector } from 'shared/new-components';
import { itsmUrls } from '../urls';

export default function AgentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Agent Portal"
      moduleDescription="Handle assigned tickets, manage priorities, and communicate with requesters."
      backPath={itsmUrls.portal}
      backLabel="IT Service Desk"
      portals={[
        {
          title: 'Dashboard',
          description: 'Your workload: assigned, overdue, and pending replies.',
          icon: 'dashboard',
          colorScheme: 'purple',
          path: itsmUrls.agent.dashboard,
        },
        {
          title: 'My Assigned Tickets',
          description: 'Tickets assigned to you.',
          icon: 'assignment_ind',
          colorScheme: 'blue',
          path: itsmUrls.agent.myAssigned,
        },
        {
          title: 'High Priority',
          description: 'Critical and high priority tickets.',
          icon: 'priority_high',
          colorScheme: 'red',
          path: itsmUrls.agent.highPriority,
        },
        {
          title: 'Pending Reply',
          description: 'Tickets waiting for your response.',
          icon: 'reply',
          colorScheme: 'orange',
          path: itsmUrls.agent.pendingReply,
        },
        {
          title: 'Overdue',
          description: 'Tickets past SLA deadline.',
          icon: 'warning',
          colorScheme: 'amber',
          path: itsmUrls.agent.overdue,
        },
      ]}
    />
  );
}
