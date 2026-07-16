import { useMemo } from 'react';
import { FormPage } from 'shared/new-components';
import { TicketTable } from '../../components';
import { initialTickets } from '../../data';
import { itsmUrls } from '../../urls';

export default function EmployeeMyTickets() {
  const requesterId = 'USR-EMP-001';
  const myTickets = useMemo(
    () => initialTickets.filter(t => t.requesterId === requesterId),
    []
  );

  return (
    <FormPage
      title="My Tickets"
      description="View and track all your support tickets."
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
