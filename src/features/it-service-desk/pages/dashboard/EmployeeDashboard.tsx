import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { LinkButton } from 'shared/components/buttons';
import { KpiCard, TicketStatusBadge, PriorityBadge } from '../../components';
import { initialTickets, TicketStatus } from '../../data';
import { itsmUrls } from '../../urls';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const requesterId = 'USR-EMP-001';
  const myTickets = useMemo(
    () => initialTickets.filter(t => t.requesterId === requesterId),
    []
  );

  const openTickets = myTickets.filter(
    t =>
      t.status === TicketStatus.OPEN ||
      t.status === TicketStatus.ASSIGNED ||
      t.status === TicketStatus.IN_PROGRESS
  ).length;
  const closedTickets = myTickets.filter(
    t => t.status === TicketStatus.CLOSED
  ).length;
  const pendingTickets = myTickets.filter(
    t =>
      t.status === TicketStatus.PENDING ||
      t.status === TicketStatus.WAITING_FOR_USER
  ).length;

  const recentReplies = myTickets
    .filter(t => t.comments.length > 0)
    .slice(0, 5);

  return (
    <FormPage
      title="My Service Desk"
      description="Track your support tickets and submit new requests."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'My Dashboard' },
      ]}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="My Open Tickets"
          value={openTickets}
          color="blue"
          icon="pending"
        />
        <KpiCard
          label="Closed Tickets"
          value={closedTickets}
          color="green"
          icon="check_circle"
        />
        <KpiCard
          label="Pending"
          value={pendingTickets}
          color="orange"
          icon="hourglass_empty"
        />
        <KpiCard
          label="Total Tickets"
          value={myTickets.length}
          color="purple"
          icon="confirmation_number"
        />
      </div>

      <div className="flex gap-3 mb-6">
        <LinkButton
          to={itsmUrls.createTicket}
          label="Create New Ticket"
          icon="add_circle"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormCard title="My Tickets">
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
              { field: 'assignedAgent', header: 'Agent', width: '130px' },
            ]}
          />
        </FormCard>
        <FormCard title="Recent Replies">
          <div className="space-y-3">
            {recentReplies.map(ticket => {
              const lastReply = ticket.comments[ticket.comments.length - 1];
              return (
                <div
                  key={ticket.code}
                  className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    navigate(`/it-service-desk/ticket/${ticket.code}`)
                  }
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-gray-500">
                      {ticket.code}
                    </span>
                    <span className="text-xs text-gray-400">
                      {lastReply.timestamp}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {ticket.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {lastReply.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    by {lastReply.author}
                  </p>
                </div>
              );
            })}
            {recentReplies.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No recent replies.
              </p>
            )}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
