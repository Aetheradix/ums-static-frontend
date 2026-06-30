import { useMemo } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { KpiCard, TicketStatusBadge, PriorityBadge } from '../../components';
import { initialTickets, TicketStatus } from '../../data';
import { itsmUrls } from '../../urls';

export default function AgentDashboard() {
  const agentName = 'Er. Amit Patel';
  const myTickets = useMemo(
    () => initialTickets.filter(t => t.assignedAgent === agentName),
    []
  );

  const highPriority = myTickets.filter(
    t => t.priority === 'Critical' || t.priority === 'High'
  ).length;
  const pendingReply = myTickets.filter(
    t => t.status === TicketStatus.WAITING_FOR_USER
  ).length;
  const overdue = myTickets.filter(t => t.slaViolated).length;
  const inProgress = myTickets.filter(
    t => t.status === TicketStatus.IN_PROGRESS
  ).length;
  const assigned = myTickets.filter(
    t => t.status === TicketStatus.ASSIGNED
  ).length;

  const todayWork = myTickets.filter(t =>
    t.createdDate.includes('Today')
  ).length;

  const resolvedTickets = myTickets.filter(
    t => t.status === TicketStatus.RESOLVED || t.status === TicketStatus.CLOSED
  );
  const avgResMs = resolvedTickets.reduce((acc, t) => {
    const m = t.resolutionTime?.match(/(\d+)h\s*(\d+)m/);
    return m ? acc + parseInt(m[1]) * 60 + parseInt(m[2]) : acc;
  }, 0);
  const avgH = Math.floor(avgResMs / resolvedTickets.length / 60);
  const avgM = Math.round((avgResMs / resolvedTickets.length) % 60);

  return (
    <FormPage
      title="Agent Dashboard"
      description={`Welcome back, ${agentName}. Your current workload and performance metrics.`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Agent Dashboard' },
      ]}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <KpiCard
          label="My Tickets"
          value={myTickets.length}
          color="blue"
          icon="confirmation_number"
        />
        <KpiCard
          label="High Priority"
          value={highPriority}
          color="red"
          icon="priority_high"
        />
        <KpiCard
          label="Pending Reply"
          value={pendingReply}
          color="orange"
          icon="reply"
        />
        <KpiCard label="Overdue" value={overdue} color="red" icon="warning" />
        <KpiCard
          label="In Progress"
          value={inProgress}
          color="indigo"
          icon="engineering"
        />
        <KpiCard
          label="Assigned"
          value={assigned}
          color="purple"
          icon="assignment_ind"
        />
        <KpiCard
          label="Today's Work"
          value={todayWork}
          color="green"
          icon="today"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <KpiCard
          label="Avg Resolution Time"
          value={`${avgH || 0}h ${avgM || 0}m`}
          color="teal"
          icon="timer"
        />
        <KpiCard
          label="SLA Compliance"
          value={
            myTickets.length > 0
              ? `${Math.round(((myTickets.length - overdue) / myTickets.length) * 100)}%`
              : 'N/A'
          }
          color="green"
          icon="verified"
        />
      </div>

      <FormCard title="My Assigned Tickets">
        <GridPanel
          data={myTickets}
          columns={[
            { field: 'code', header: 'Code', width: '140px' },
            {
              field: 'title',
              header: 'Title',
              cell: (t: any) => (
                <span className="text-sm font-medium">{t.title}</span>
              ),
            },
            {
              header: 'Status',
              width: '130px',
              cell: (t: any) => <TicketStatusBadge status={t.status} />,
            },
            {
              header: 'Priority',
              width: '100px',
              cell: (t: any) => <PriorityBadge priority={t.priority} />,
            },
            { field: 'requesterName', header: 'Requester', width: '140px' },
            { field: 'slaDeadline', header: 'SLA', width: '160px' },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
