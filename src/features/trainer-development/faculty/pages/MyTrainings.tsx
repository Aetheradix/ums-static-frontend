import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { trainingPrograms } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<string, 'approved' | 'pending' | 'rejected' | 'neutral' | 'ongoing'> = {
  'Completed': 'approved',
  'Ongoing': 'ongoing',
  'Scheduled': 'pending',
  'Planned': 'neutral',
  'Cancelled': 'rejected',
};

type PopupState = { mode: 'closed' } | { mode: 'view'; item: any } | { mode: 'browse' };

export default function MyTrainingsPage() {
  const [data] = useState(trainingPrograms.slice(0, 5));
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const close = () => setPopup({ mode: 'closed' });

  return (
    <FormPage
      title="My Training Programmes"
      description="View your past, ongoing and upcoming training programmes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Faculty Portal', to: tdmUrls.faculty.portal },
        { label: 'My Trainings' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            {
              field: 'title', header: 'Programme Details',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontWeight: 600 }}>{item.title}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.category} • {item.type} • {item.mode}
                  </span>
                </div>
              ),
            },
            {
              field: 'schedule', header: 'Schedule',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: '0.813rem', color: '#374151' }}>{item.startDate} to {item.endDate}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.duration} hours</span>
                </div>
              ),
            },
            {
              field: 'trainer', header: 'Trainer',
            },
            {
              field: 'status', header: 'Status',
              cell: (item) => (
                <StatusBadge label={item.status} variant={STATUS_VARIANTS[item.status] as any} />
              ),
            },
            {
              field: 'actions', header: 'Actions', sortable: false,
              cell: (item) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" icon="eye" variant="outlined" label="" tooltip="View Details" onClick={() => setPopup({ mode: 'view', item })} />
                  <Button size="small" icon="download" variant="outlined" label="" tooltip="Download Certificate" />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button label="Browse Programmes" icon="search" variant="primary" onClick={() => setPopup({ mode: 'browse' })} />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={popup.mode === 'view' ? 'Training Programme Details' : popup.mode === 'browse' ? 'Browse Programmes' : ''}
        size="lg"
      >
        {popup.mode === 'view' && (
          <FormGrid columns={2}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Programme Title</p>
              <p style={{ fontWeight: 600, margin: 0 }}>{popup.item.title}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Category & Mode</p>
              <p style={{ margin: 0 }}>{popup.item.category} • {popup.item.mode}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Schedule</p>
              <p style={{ margin: 0 }}>{popup.item.startDate} to {popup.item.endDate}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Status</p>
              <StatusBadge label={popup.item.status} variant={STATUS_VARIANTS[popup.item.status] as any} />
            </div>
          </FormGrid>
        )}
        {popup.mode === 'browse' && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#9ca3af' }}>search</span>
            <p>Programme browser functionality will be integrated here.</p>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
