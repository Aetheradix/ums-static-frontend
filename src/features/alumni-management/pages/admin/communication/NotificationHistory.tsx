import { mockNotificationHistory } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function NotificationHistory() {
  const columns = [
    { field: 'id', header: 'Log ID' },
    { field: 'recipient', header: 'Recipient Email' },
    { field: 'subject', header: 'Subject' },
    { field: 'channel', header: 'Channel' },
    { field: 'sentAt', header: 'Sent At' },
    {
      field: 'status',
      header: 'Delivery Status',
      body: (row: any) => (
        <StatusBadge
          label={row.status}
          variant={row.status === 'Delivered' ? 'approved' : 'rejected'}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Notification History"
      description="Full history of all emails and notifications sent to alumni"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Admin Portal', to: alumniUrls.admin.portal },
        { label: 'Notification History' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <GridPanel
            searchBox
            data={mockNotificationHistory}
            columns={columns as any}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
