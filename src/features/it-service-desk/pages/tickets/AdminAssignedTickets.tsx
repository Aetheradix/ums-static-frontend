import { useMemo } from 'react';
import { FormPage } from 'shared/new-components';
import { TicketTable } from '../../components';
import { initialTickets } from '../../data';
import { itsmUrls } from '../../urls';

export default function AdminAssignedTickets() {
  const assigned = useMemo(
    () =>
      initialTickets.filter(
        t => t.assignedAgent !== 'Unassigned' && t.assignedAgent !== ''
      ),
    []
  );

  return (
    <FormPage
      title="Assigned Tickets"
      description="All tickets assigned to agents."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Assigned Tickets' },
      ]}
    >
      <TicketTable data={assigned} title={`Assigned (${assigned.length})`} />
    </FormPage>
  );
}
