import { useMemo } from 'react';
import { FormPage } from 'shared/new-components';
import { TicketTable } from '../../components';
import { initialTickets } from '../../data';
import { itsmUrls } from '../../urls';

export default function AgentMyAssignedTickets() {
  const agentName = 'Er. Amit Patel';
  const myTickets = useMemo(
    () => initialTickets.filter(t => t.assignedAgent === agentName),
    []
  );

  return (
    <FormPage
      title="My Assigned Tickets"
      description={`Tickets assigned to ${agentName}.`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'My Assigned' },
      ]}
    >
      <TicketTable
        data={myTickets}
        title={`Assigned to Me (${myTickets.length})`}
      />
    </FormPage>
  );
}
