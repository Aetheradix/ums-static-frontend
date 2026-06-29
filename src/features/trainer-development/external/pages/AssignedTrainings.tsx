import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { trainingPrograms } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<
  string,
  'approved' | 'pending' | 'rejected' | 'neutral'
> = {
  Completed: 'approved',
  Ongoing: 'pending',
  Scheduled: 'neutral',
  Planned: 'neutral',
  Cancelled: 'rejected',
};

type PopupState = { mode: 'closed' } | { mode: 'preview'; item: any };

export default function AssignedTrainingsPage() {
  const [data] = useState(trainingPrograms.slice(1, 4));
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const close = () => setPopup({ mode: 'closed' });

  return (
    <FormPage
      title="Assigned Trainings"
      description="View all training programmes assigned to you."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'External Portal', to: tdmUrls.external.portal },
        { label: 'Assigned Trainings' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            { field: 'trainingId', header: 'Training ID' },
            {
              field: 'title',
              header: 'Programme Details',
              cell: item => (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <span style={{ fontWeight: 600 }}>{item.title}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.department} • {item.mode}
                  </span>
                </div>
              ),
            },
            {
              field: 'schedule',
              header: 'Schedule',
              cell: item => (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <span style={{ fontSize: '0.813rem', color: '#374151' }}>
                    {item.startDate} to {item.endDate}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.duration} hours
                  </span>
                </div>
              ),
            },
            {
              field: 'participants',
              header: 'Participants',
              cell: item => (
                <span style={{ fontWeight: 600 }}>
                  {item.registeredCount} Enrolled
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: item => (
                <StatusBadge
                  label={item.status}
                  variant={STATUS_VARIANTS[item.status] as any}
                />
              ),
            },
            {
              field: 'actions',
              header: 'Actions',
              sortable: false,
              cell: item => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    icon="eye"
                    variant="outlined"
                    label=""
                    tooltip="View Details"
                    onClick={() => setPopup({ mode: 'preview', item })}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={popup.mode === 'preview' ? 'Training Programme Details' : ''}
        size="lg"
      >
        {popup.mode === 'preview' && popup.item && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              padding: '1rem 0',
            }}
          >
            <div
              style={{
                padding: '1.5rem',
                background: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
              }}
            >
              <h3
                style={{
                  margin: '0 0 1rem 0',
                  color: '#0f172a',
                  fontSize: '1.125rem',
                  lineHeight: '1.4',
                }}
              >
                {popup.item.title}
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Training ID
                  </div>
                  <div style={{ fontWeight: 500, color: '#334155' }}>
                    {popup.item.trainingId}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Department
                  </div>
                  <div style={{ fontWeight: 500, color: '#334155' }}>
                    {popup.item.department}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Mode
                  </div>
                  <div style={{ fontWeight: 500, color: '#334155' }}>
                    {popup.item.mode}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Venue / Platform
                  </div>
                  <div style={{ fontWeight: 500, color: '#334155' }}>
                    {popup.item.venue || popup.item.platform || 'TBD'}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
              }}
            >
              <div>
                <h4
                  style={{
                    margin: '0 0 0.75rem 0',
                    color: '#334155',
                    fontSize: '1rem',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '0.5rem',
                  }}
                >
                  Schedule details
                </h4>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Dates
                    </div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      {popup.item.startDate} to {popup.item.endDate}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Timings
                    </div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      {popup.item.startTime} - {popup.item.endTime}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Total Duration
                    </div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      {popup.item.duration} hours
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4
                  style={{
                    margin: '0 0 0.75rem 0',
                    color: '#334155',
                    fontSize: '1rem',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '0.5rem',
                  }}
                >
                  Status Overview
                </h4>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: '#64748b',
                        fontSize: '0.75rem',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Current Status
                    </div>
                    <div>
                      <StatusBadge
                        label={popup.item.status}
                        variant={STATUS_VARIANTS[popup.item.status] as any}
                      />
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Enrolled Participants
                    </div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      {popup.item.registeredCount} /{' '}
                      {popup.item.maxParticipants}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Target Category
                    </div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      {popup.item.category}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4
                style={{
                  margin: '0 0 0.75rem 0',
                  color: '#334155',
                  fontSize: '1rem',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                Objectives & Outcomes
              </h4>
              <div style={{ marginBottom: '0.75rem' }}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '0.25rem',
                  }}
                >
                  Objectives
                </div>
                <div style={{ color: '#334155', lineHeight: '1.5' }}>
                  {popup.item.objectives}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '0.25rem',
                  }}
                >
                  Expected Outcomes
                </div>
                <div style={{ color: '#334155', lineHeight: '1.5' }}>
                  {popup.item.outcomes}
                </div>
              </div>
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
