import { useMemo } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { initialTickets, TicketStatus } from '../../data';
import { itsmUrls } from '../../urls';

export default function AgentPendingReply() {
  const agentName = 'Er. Amit Patel';
  const pendingReply = useMemo(
    () =>
      initialTickets.filter(
        t =>
          t.assignedAgent === agentName &&
          t.status === TicketStatus.WAITING_FOR_USER
      ),
    []
  );

  return (
    <FormPage
      title="Pending Reply"
      description="Tickets waiting for your response."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Pending Reply' },
      ]}
    >
      <FormCard title={`Pending Reply (${pendingReply.length})`}>
        <GridPanel
          data={pendingReply}
          columns={[
            { field: 'code', header: 'Code', width: '140px' },
            {
              field: 'title',
              header: 'Title',
              cell: (t: any) => (
                <span className="text-sm font-medium">{t.title}</span>
              ),
            },
            { field: 'requesterName', header: 'Requester', width: '140px' },
            { field: 'priority', header: 'Priority', width: '90px' },
            {
              header: 'Actions',
              width: '120px',
              cell: () => (
                <Button label="Reply" variant="primary" size="small" />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
