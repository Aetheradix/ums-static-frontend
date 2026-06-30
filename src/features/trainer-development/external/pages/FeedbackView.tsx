import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { feedbackRecords } from '../../mocks';
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

type PopupState = { mode: 'closed' } | { mode: 'view'; item: any };

export default function ExternalFeedbackViewPage() {
  const [data] = useState(
    feedbackRecords.filter(
      f =>
        f.trainerName.includes('Rajesh') ||
        f.trainerName.includes('Amit') ||
        f.trainerName.includes('Vikram')
    )
  ); // Include Vikram for external trainer mockup
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const close = () => setPopup({ mode: 'closed' });

  return (
    <FormPage
      title="Feedback & Ratings"
      description="View participant feedback and ratings for your sessions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'External Portal', to: tdmUrls.external.portal },
        { label: 'Feedback' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            {
              field: 'training',
              header: 'Training Programme',
              cell: item => (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <span style={{ fontWeight: 600 }}>{item.trainingTitle}</span>
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
                    fontStyle: 'italic',
                    color: '#374151',
                  }}
                >
                  "{item.comments}"
                </div>
              ),
            },
            {
              field: 'actions',
              header: 'Actions',
              sortable: false,
              width: '80px',
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
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title="Feedback Details"
        size="default"
      >
        {popup.mode === 'view' && popup.item && (
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
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '0.25rem',
                }}
              >
                {popup.item.trainingTitle}
              </div>
              <div style={{ fontSize: '0.813rem', color: '#64748b' }}>
                Submitted on: {popup.item.date} by {popup.item.participantName}{' '}
                ({popup.item.department})
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                <span style={{ color: '#475569', fontSize: '0.875rem' }}>
                  Overall Rating
                </span>
                <span style={{ fontWeight: 600 }}>
                  {popup.item.overallRating.toFixed(1)} / 5
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                <span style={{ color: '#475569', fontSize: '0.875rem' }}>
                  Content Quality
                </span>
                <span style={{ fontWeight: 600 }}>
                  {popup.item.contentQuality} / 5
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                <span style={{ color: '#475569', fontSize: '0.875rem' }}>
                  Communication
                </span>
                <span style={{ fontWeight: 600 }}>
                  {popup.item.communicationRating} / 5
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                <span style={{ color: '#475569', fontSize: '0.875rem' }}>
                  Knowledge
                </span>
                <span style={{ fontWeight: 600 }}>
                  {popup.item.knowledgeRating} / 5
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                <span style={{ color: '#475569', fontSize: '0.875rem' }}>
                  Practical Appl.
                </span>
                <span style={{ fontWeight: 600 }}>
                  {popup.item.practicalRating} / 5
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                <span style={{ color: '#475569', fontSize: '0.875rem' }}>
                  Trainer Rating
                </span>
                <span style={{ fontWeight: 600 }}>
                  {popup.item.trainerRating} / 5
                </span>
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '0.5rem',
                }}
              >
                Participant Comments
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#475569',
                  fontStyle: 'italic',
                  background: '#f1f5f9',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                }}
              >
                "{popup.item.comments}"
              </div>
            </div>
            {popup.item.suggestions && (
              <div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '0.5rem',
                  }}
                >
                  Suggestions for Improvement
                </div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: '#475569',
                    background: '#fffbeb',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #fde68a',
                  }}
                >
                  {popup.item.suggestions}
                </div>
              </div>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
