import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function SynopsisSubmission() {
  return (
    <FormPage
      title="Synopsis Submission"
      description="Upload your research synopsis document for supervisor and HOD review and endorsement."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Synopsis Submission' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Synopsis Status"
          value="Not Submitted"
          icon="assignment"
          colorScheme="orange"
          subtitle="Draft pending"
        />
        <StatCard
          title="Supervisor Review"
          value="Awaiting"
          icon="pending_actions"
          colorScheme="blue"
          subtitle="Post submission"
        />
        <StatCard
          title="HOD Endorsement"
          value="Awaiting"
          icon="account_balance"
          colorScheme="purple"
          subtitle="After supervisor"
        />
        <StatCard
          title="Cell Registration"
          value="Awaiting"
          icon="corporate_fare"
          colorScheme="teal"
          subtitle="After HOD"
        />
      </div>

      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <FormCard title="Upload Synopsis Document">
          <div
            style={{
              padding: '2rem',
              border: '2px dashed #cbd5e1',
              borderRadius: 10,
              textAlign: 'center',
              background: '#f8fafc',
              marginBottom: '1rem',
            }}
          >
            <i
              className="pi pi-file-pdf"
              style={{ fontSize: '3rem', color: '#ef4444' }}
            />
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginTop: '0.75rem',
              }}
            >
              Drag & drop Synopsis PDF or Browse
            </p>
            <p style={{ fontSize: '0.688rem', color: '#9ca3af', marginTop: 2 }}>
              PDF only · Max 10 MB
            </p>
            <Button
              label="Browse Synopsis File"
              variant="primary"
              onClick={() => ToastService.success('Synopsis PDF selected!')}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => ToastService.success('Synopsis saved as draft.')}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #cbd5e1',
                background: '#fff',
                borderRadius: 6,
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.813rem',
              }}
            >
              Save Draft
            </button>
            <button
              onClick={() =>
                ToastService.success(
                  'Synopsis submitted to supervisor review queue!'
                )
              }
              style={{
                flex: 1,
                padding: '0.5rem',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.813rem',
              }}
            >
              Submit Synopsis
            </button>
          </div>
        </FormCard>

        <FormCard title="Synopsis Workflow Status">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
            }}
          >
            {[
              {
                step: 1,
                label: 'Scholar Submits Synopsis',
                status: 'pending',
                note: 'Upload PDF document',
              },
              {
                step: 2,
                label: 'Supervisor Technical Review',
                status: 'locked',
                note: 'Content and methodology check',
              },
              {
                step: 3,
                label: 'HOD Department Endorsement',
                status: 'locked',
                note: 'Department specialization check',
              },
              {
                step: 4,
                label: 'Research Cell Registration',
                status: 'locked',
                note: 'URC code issuance',
              },
              {
                step: 5,
                label: 'Synopsis Seminar Scheduled',
                status: 'locked',
                note: 'Defense presentation date',
              },
            ].map(s => (
              <div
                key={s.step}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.625rem',
                  background: s.status === 'pending' ? '#fffbeb' : '#f9fafb',
                  borderRadius: 6,
                  border: `1px solid ${s.status === 'pending' ? '#fde68a' : '#e5e7eb'}`,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: s.status === 'pending' ? '#f59e0b' : '#e5e7eb',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {s.step}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '0.813rem',
                      fontWeight: 600,
                      color: '#1f2937',
                    }}
                  >
                    {s.label}
                  </p>
                  <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                    {s.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
