import { useMemo } from 'react';
import { FormPage } from 'shared/new-components';
import { TicketTable } from '../../components';
import { initialTickets, TicketStatus } from '../../data';
import { itsmUrls } from '../../urls';

export default function ModuleAdminClosedTickets() {
  const closed = useMemo(
    () =>
      initialTickets.filter(
        t =>
          t.status === TicketStatus.CLOSED &&
          (t.module === 'Software & Licenses' ||
            t.module === 'Workstation Hardware')
      ),
    []
  );

  return (
    <FormPage
      title="Closed Tickets"
      description="Resolved and closed module tickets."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Closed Tickets' },
      ]}
    >
      <TicketTable data={closed} title={`Closed (${closed.length})`} />
    </FormPage>
  );
}
