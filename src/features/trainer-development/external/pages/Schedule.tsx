import { useState } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { trainingSessions } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<string, 'approved' | 'pending' | 'rejected' | 'neutral'> = {
  'Completed': 'approved',
  'Ongoing': 'pending',
  'Scheduled': 'neutral',
  'Cancelled': 'rejected',
};

export default function SchedulePage() {
  const [data] = useState(trainingSessions);

  return (
    <FormPage
      title="Training Schedule"
      description="View your upcoming session schedule, venue and timing details."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'External Portal', to: tdmUrls.external.portal },
        { label: 'Schedule' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            {
              field: 'date', header: 'Date & Time',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600 }}>{item.date}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.startTime} - {item.endTime}</span>
                </div>
              ),
            },
            {
              field: 'topic', header: 'Session Topic',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.813rem', color: '#111827' }}>{item.topic}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.trainingTitle}</span>
                </div>
              ),
            },
            {
              field: 'venue', header: 'Venue / Link',
              cell: (item) => <span style={{ fontWeight: 600, color: '#3b82f6' }}>{item.venue}</span>
            },
            {
              field: 'status', header: 'Status',
              cell: (item) => (
                <StatusBadge label={item.status} variant={STATUS_VARIANTS[item.status]} />
              ),
            },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
