import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { trainingPrograms } from '../../mocks';
import { tdmUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'view'; item: any }
  | { mode: 'apply'; item: any };

export default function ApplyTrainingPage() {
  const [data] = useState(
    trainingPrograms.filter(
      t => t.status === 'Planned' || t.status === 'Scheduled'
    )
  );
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const close = () => setPopup({ mode: 'closed' });

  return (
    <FormPage
      title="Apply for Training"
      description="Browse available training programmes and submit applications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Faculty Portal', to: tdmUrls.faculty.portal },
        { label: 'Apply' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            {
              field: 'title',
              header: 'Programme Title',
              cell: item => (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <span style={{ fontWeight: 600 }}>{item.title}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.category} • {item.mode}
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
              field: 'seats',
              header: 'Availability',
              cell: item => (
                <div style={{ fontSize: '0.813rem' }}>
                  <span
                    style={{
                      fontWeight: 600,
                      color:
                        item.maxParticipants - item.registeredCount < 5
                          ? '#ef4444'
                          : '#10b981',
                    }}
                  >
                    {item.maxParticipants - item.registeredCount} Seats Left
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Max: {item.maxParticipants}
                  </div>
                </div>
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
                    onClick={() => setPopup({ mode: 'view', item })}
                  />
                  <Button
                    size="small"
                    icon="check"
                    variant="primary"
                    label="Apply"
                    onClick={() => setPopup({ mode: 'apply', item })}
                  />
                </div>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'view'
            ? 'Programme Details'
            : popup.mode === 'apply'
              ? 'Confirm Application'
              : ''
        }
        size="default"
      >
        {popup.mode === 'view' && (
          <FormGrid columns={1}>
            <div>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  margin: '0 0 0.25rem 0',
                }}
              >
                Programme Title
              </p>
              <p style={{ fontWeight: 600, margin: 0 }}>{popup.item.title}</p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  margin: '0 0 0.25rem 0',
                }}
              >
                Description
              </p>
              <p style={{ margin: 0 }}>
                Join this comprehensive training programme to enhance your
                skills in {popup.item.category}.
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    margin: '0 0 0.25rem 0',
                  }}
                >
                  Mode
                </p>
                <p style={{ margin: 0 }}>{popup.item.mode}</p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    margin: '0 0 0.25rem 0',
                  }}
                >
                  Schedule
                </p>
                <p style={{ margin: 0 }}>
                  {popup.item.startDate} to {popup.item.endDate}
                </p>
              </div>
            </div>
          </FormGrid>
        )}
        {popup.mode === 'apply' && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '3rem',
                color: '#10b981',
                marginBottom: '1rem',
              }}
            >
              check_circle
            </span>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>
              Apply for {popup.item.title}?
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Your request will be sent to the reporting manager for approval.
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '2rem',
              }}
            >
              <Button label="Cancel" variant="outlined" onClick={close} />
              <Button
                label="Confirm Application"
                variant="primary"
                icon="check"
                onClick={close}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
