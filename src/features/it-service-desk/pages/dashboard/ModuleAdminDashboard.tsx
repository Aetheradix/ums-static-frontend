import { useMemo } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { KpiCard, TicketStatusBadge, PriorityBadge } from '../../components';
import { initialTickets, TicketStatus } from '../../data';
import { itsmUrls } from '../../urls';

export default function ModuleAdminDashboard() {
  const tickets = useMemo(
    () =>
      initialTickets.filter(
        t =>
          t.module === 'Software & Licenses' ||
          t.module === 'Workstation Hardware'
      ),
    []
  );

  const open = tickets.filter(
    t => t.status === TicketStatus.OPEN || t.status === TicketStatus.ASSIGNED
  ).length;
  const closed = tickets.filter(t => t.status === TicketStatus.CLOSED).length;
  const pending = tickets.filter(
    t =>
      t.status === TicketStatus.PENDING ||
      t.status === TicketStatus.WAITING_FOR_USER
  ).length;
  const slaViolated = tickets.filter(t => t.slaViolated).length;
  const resolved = tickets.filter(
    t => t.status === TicketStatus.RESOLVED
  ).length;

  return (
    <FormPage
      title="Module Admin Dashboard"
      description="Tickets and metrics for your assigned ERP modules."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Module Admin Dashboard' },
      ]}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <KpiCard
          label="Total Tickets"
          value={tickets.length}
          color="blue"
          icon="confirmation_number"
        />
        <KpiCard label="Open" value={open} color="indigo" icon="pending" />
        <KpiCard
          label="Pending"
          value={pending}
          color="orange"
          icon="hourglass_empty"
        />
        <KpiCard
          label="Resolved"
          value={resolved}
          color="green"
          icon="verified"
        />
        <KpiCard
          label="Closed"
          value={closed}
          color="green"
          icon="check_circle"
        />
        <KpiCard
          label="SLA Violated"
          value={slaViolated}
          color="red"
          icon="warning"
        />
      </div>

      <FormCard title="Module Tickets">
        <GridPanel
          data={tickets}
          columns={[
            { field: 'code', header: 'Code', width: '140px' },
            {
              field: 'title',
              header: 'Title',
              cell: (t: any) => (
                <span className="text-sm font-medium">{t.title}</span>
              ),
            },
            { field: 'service', header: 'Service', width: '150px' },
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
            { field: 'assignedAgent', header: 'Agent', width: '140px' },
            { field: 'createdDate', header: 'Created', width: '150px' },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
