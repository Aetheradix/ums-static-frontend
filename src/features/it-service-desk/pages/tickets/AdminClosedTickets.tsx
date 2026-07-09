import { useMemo } from 'react';
import { FormPage } from 'shared/new-components';
import { TicketTable } from '../../components';
import { initialTickets, TicketStatus } from '../../data';
import { itsmUrls } from '../../urls';

export default function AdminClosedTickets() {
  const closed = useMemo(
    () => initialTickets.filter(t => t.status === TicketStatus.CLOSED),
    []
  );

  return (
    <FormPage
      title="Closed Tickets"
      description="All resolved and closed tickets."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Closed Tickets' },
      ]}
    >
      <TicketTable data={closed} title={`Closed (${closed.length})`} />
    </FormPage>
  );
}
