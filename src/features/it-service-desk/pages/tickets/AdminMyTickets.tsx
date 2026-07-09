import { useMemo } from 'react';
import { FormPage } from 'shared/new-components';
import { TicketTable } from '../../components';
import { initialTickets, mockCurrentUser } from '../../data';
import { itsmUrls } from '../../urls';

export default function AdminMyTickets() {
  const myTickets = useMemo(
    () => initialTickets.filter(t => t.requesterId === mockCurrentUser.id),
    []
  );

  return (
    <FormPage
      title="My Tickets"
      description="Tickets created by you."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'My Tickets' },
      ]}
    >
      <TicketTable
        data={myTickets}
        title={`My Tickets (${myTickets.length})`}
      />
    </FormPage>
  );
}
