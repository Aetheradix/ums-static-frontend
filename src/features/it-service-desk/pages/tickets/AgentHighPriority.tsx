import { useMemo } from 'react';
import { FormPage } from 'shared/new-components';
import { TicketTable } from '../../components';
import { initialTickets } from '../../data';
import { itsmUrls } from '../../urls';

export default function AgentHighPriority() {
  const agentName = 'Er. Amit Patel';
  const highPriority = useMemo(
    () =>
      initialTickets.filter(
        t =>
          t.assignedAgent === agentName &&
          (t.priority === 'Critical' || t.priority === 'High')
      ),
    []
  );

  return (
    <FormPage
      title="High Priority Tickets"
      description="Critical and high priority tickets requiring immediate attention."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'High Priority' },
      ]}
    >
      <TicketTable
        data={highPriority}
        title={`High Priority (${highPriority.length})`}
      />
    </FormPage>
  );
}
