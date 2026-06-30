import { mockEmailCampaigns } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import { Button } from 'primereact/button';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function EmailCampaigns() {
  const columns = [
    { field: 'id', header: 'Campaign ID' },
    { field: 'name', header: 'Campaign Name' },
    {
      field: 'status',
      header: 'Status',
      body: (row: any) => (
        <StatusBadge
          label={row.status}
          variant={
            row.status === 'Sent'
              ? 'approved'
              : row.status === 'Scheduled'
                ? 'pending'
                : 'neutral'
          }
        />
      ),
    },
    { field: 'sentTo', header: 'Recipients' },
    { field: 'openRate', header: 'Open Rate' },
    { field: 'sentOn', header: 'Date' },
  ];

  return (
    <FormPage
      title="Email Campaigns"
      description="Create, manage and track bulk email communications for alumni"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Admin Portal', to: alumniUrls.admin.portal },
        { label: 'Email Campaigns' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <GridPanel
            searchBox
            toolbar={<Button label="Create New Campaign" icon="pi pi-plus" />}
            data={mockEmailCampaigns}
            columns={columns as any}
            editCaption="View / Edit"
            removeCaption="Delete"
            onEdit={() => {}}
            onRemove={() => {}}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
