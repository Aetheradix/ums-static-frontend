import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { initialTickets } from '../../data';
import { itsmUrls } from '../../urls';

export default function AdminSpam() {
  const [spam, setSpam] = useState(() => initialTickets.filter(t => t.isSpam));

  const handleDelete = (code: string) => {
    setSpam(prev => prev.filter(t => t.code !== code));
  };

  const handleNotSpam = (code: string) => {
    setSpam(prev => prev.filter(t => t.code !== code));
  };

  return (
    <FormPage
      title="Spam Tickets"
      description="Flagged and spam tickets."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Spam' },
      ]}
    >
      <FormCard title={`Spam (${spam.length})`}>
        <GridPanel
          data={spam}
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
            { field: 'createdDate', header: 'Created', width: '150px' },
            {
              header: 'Actions',
              width: '160px',
              cell: (t: any) => (
                <div className="flex gap-1">
                  <Button
                    label="Delete"
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(t.code)}
                  />
                  <Button
                    label="Not Spam"
                    variant="outlined"
                    size="small"
                    onClick={() => handleNotSpam(t.code)}
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
