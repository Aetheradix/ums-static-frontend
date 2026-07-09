import { useMemo } from 'react';
import { FormPage } from 'shared/new-components';
import { TicketTable } from '../../components';
import { initialTickets } from '../../data';
import { itsmUrls } from '../../urls';

export default function AgentOverdue() {
  const agentName = 'Er. Amit Patel';
  const overdue = useMemo(
    () =>
      initialTickets.filter(
        t => t.assignedAgent === agentName && t.slaViolated
      ),
    []
  );

  return (
    <FormPage
      title="Overdue Tickets"
      description="Tickets past their SLA deadline."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Overdue' },
      ]}
    >
      <TicketTable data={overdue} title={`Overdue (${overdue.length})`} />
    </FormPage>
  );
}
