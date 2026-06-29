import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { initialTickets, TicketStatus } from '../../data';
import { itsmUrls } from '../../urls';

export default function AdminPendingApproval() {
  const [pending, setPending] = useState(() =>
    initialTickets.filter(t => t.status === TicketStatus.PENDING)
  );

  const handleApprove = (code: string) => {
    setPending(prev => prev.filter(t => t.code !== code));
  };

  const handleReject = (code: string) => {
    setPending(prev => prev.filter(t => t.code !== code));
  };

  return (
    <FormPage
      title="Pending Approval"
      description="Tickets awaiting your approval."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Pending Approval' },
      ]}
    >
      <FormCard title={`Pending Approval (${pending.length})`}>
        <GridPanel
          data={pending}
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
            { field: 'assignedAgent', header: 'Agent', width: '140px' },
            {
              header: 'Actions',
              width: '160px',
              cell: (t: any) => (
                <div className="flex gap-1">
                  <Button
                    label="Approve"
                    variant="success"
                    size="small"
                    onClick={() => handleApprove(t.code)}
                  />
                  <Button
                    label="Reject"
                    variant="danger"
                    size="small"
                    onClick={() => handleReject(t.code)}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
