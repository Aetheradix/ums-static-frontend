import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { type FeedbackRecord, feedbackRecords } from '../../mocks';
import { tdmUrls } from '../../urls';

const renderStars = (rating: number) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: 2,
        color: '#f59e0b',
        fontSize: '0.875rem',
      }}
    >
      {[1, 2, 3, 4, 5].map(i => (
        <i
          key={i}
          className={
            i <= rating
              ? 'pi pi-star-fill'
              : i - 0.5 <= rating
                ? 'pi pi-star-half-fill'
                : 'pi pi-star'
          }
        />
      ))}
    </div>
  );
};

type PopupState = { mode: 'closed' } | { mode: 'view'; item: FeedbackRecord };

export default function FeedbackManagementPage() {
  const [data] = useState(feedbackRecords);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const close = () => setPopup({ mode: 'closed' });

  return (
    <FormPage
      title="Feedback & Ratings"
      description="View participant feedback for training programmes and trainer performance."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Feedback' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            {
              field: 'training',
              header: 'Training & Trainer',
              cell: item => (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <span style={{ fontWeight: 600 }}>{item.trainingTitle}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Trainer: {item.trainerName}
                  </span>
                </div>
              ),
            },
            {
              field: 'participant',
              header: 'Participant',
              cell: item => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.813rem', color: '#111827' }}>
                    {item.participantName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.department}
                  </span>
                </div>
              ),
            },
            {
              field: 'overallRating',
              header: 'Overall Rating',
              cell: item => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                    {item.overallRating.toFixed(1)}
                  </span>
                  {renderStars(item.overallRating)}
                </div>
              ),
            },
            {
              field: 'metrics',
              header: 'Detailed Metrics',
              cell: item => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    fontSize: '0.688rem',
                    color: '#4b5563',
                  }}
                >
                  <span>
                    Content: {item.contentQuality}/5 | Comm:{' '}
                    {item.communicationRating}/5
                  </span>
                  <span>
                    Knowledge: {item.knowledgeRating}/5 | Practical:{' '}
                    {item.practicalRating}/5
                  </span>
                </div>
              ),
            },
            {
              field: 'comments',
              header: 'Comments',
              cell: item => (
                <div
                  style={{
                    fontSize: '0.75rem',
                    maxWidth: 200,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={item.comments}
                >
                  "{item.comments}"
                </div>
              ),
            },
            {
              field: 'actions',
              header: 'Actions',
              sortable: false,
              cell: item => (
                <Button
                  size="small"
                  icon="eye"
                  variant="outlined"
                  label=""
                  onClick={() => setPopup({ mode: 'view', item })}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Export Feedback"
              icon="download"
              variant="outlined"
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title="Feedback Details"
        size="default"
      >
        {popup.mode === 'view' && (
          <FormGrid columns={1}>
            <TextBox
              label="Training Title"
              value={popup.item.trainingTitle}
              readOnly
            />
            <TextBox label="Trainer" value={popup.item.trainerName} readOnly />
            <TextBox
              label="Participant"
              value={popup.item.participantName}
              readOnly
            />
            <div
              style={{
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: 8,
                marginTop: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <span style={{ fontWeight: 600 }}>Overall Rating</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700 }}>
                    {popup.item.overallRating.toFixed(1)}
                  </span>
                  {renderStars(popup.item.overallRating)}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>Content Quality</span>
                  <span>{popup.item.contentQuality} / 5</span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>Communication</span>
                  <span>{popup.item.communicationRating} / 5</span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>Subject Knowledge</span>
                  <span>{popup.item.knowledgeRating} / 5</span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>Practical Applicability</span>
                  <span>{popup.item.practicalRating} / 5</span>
                </div>
              </div>
            </div>
            <TextBox label="Comments" value={popup.item.comments} readOnly />
          </FormGrid>
        )}
      </FormPopup>
    </FormPage>
  );
}
