import { FormCard, FormPage } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const APP = studentApplications[0];

const TRACK_STEPS = [
  {
    label: 'Application Submitted',
    desc: `Submitted on ${APP.submittedDate}`,
    date: APP.submittedDate,
    done: true,
    active: false,
  },
  {
    label: 'Teacher Verification',
    desc: 'Dr. Anil Sharma verified academic records',
    date: '18 Sep 2025',
    done: true,
    active: false,
  },
  {
    label: 'Scholarship Cell Verification',
    desc: 'Documents verified by scholarship cell',
    date: '20 Sep 2025',
    done: true,
    active: false,
  },
  {
    label: 'Finance Office Verification',
    desc: 'Pending fee adjustment calculation',
    date: '—',
    done: false,
    active: true,
  },
  {
    label: 'Admin Approval',
    desc: 'Awaiting admin sanction order',
    date: '—',
    done: false,
    active: false,
  },
  {
    label: 'Government Portal Sync (NSP)',
    desc: 'Pending sync with National Scholarship Portal',
    date: '—',
    done: false,
    active: false,
  },
  {
    label: 'Government Verification',
    desc: 'Awaiting NSP eligibility verification',
    date: '—',
    done: false,
    active: false,
  },
  {
    label: 'Scholarship Sanctioned',
    desc: 'Sanction order to be generated',
    date: '—',
    done: false,
    active: false,
  },
  {
    label: 'DBT Payment Processed',
    desc: 'APBS payment initiation pending',
    date: '—',
    done: false,
    active: false,
  },
  {
    label: 'Amount Credited to Bank',
    desc: `Via APBS to ${APP.bankName}`,
    date: '—',
    done: false,
    active: false,
  },
];

export default function StudentTrack() {
  return (
    <FormPage
      title="Track Application Status"
      description="Follow your scholarship application approval journey step by step."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'Track Application' },
      ]}
    >
      <div style={{ maxWidth: 760 }}>
        {/* Application Reference */}
        <FormCard className="mb-4">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '0.688rem',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                }}
              >
                Tracking
              </p>
              <p
                style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}
              >
                {APP.appNo}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {APP.schemeName}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                className="dbt-status-pill"
                style={{
                  background: '#ede9fe',
                  color: '#7c3aed',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.875rem',
                }}
              >
                {APP.status}
              </span>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#16a34a',
                  marginTop: '0.5rem',
                }}
              >
                Amount: ₹{APP.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </FormCard>

        {/* Compact Progress */}
        <FormCard className="mb-4">
          <div
            style={{
              marginBottom: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Progress
            </span>
            <span
              style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed' }}
            >
              30% — Step 3 of 10
            </span>
          </div>
          <div className="dbt-bar-track" style={{ height: 10 }}>
            <div
              className="dbt-bar-fill"
              style={{
                width: '30%',
                background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
              }}
            />
          </div>
        </FormCard>

        {/* Full Timeline */}
        <FormCard title="Approval Journey Timeline">
          <div className="dbt-timeline">
            {TRACK_STEPS.map((step, i) => (
              <div key={step.label} className="dbt-timeline-step">
                <div className="dbt-timeline-icon-wrap">
                  <div
                    className="dbt-timeline-icon"
                    style={{
                      background: step.done
                        ? '#dcfce7'
                        : step.active
                          ? '#dbeafe'
                          : '#f3f4f6',
                      color: step.done
                        ? '#16a34a'
                        : step.active
                          ? '#2563eb'
                          : '#9ca3af',
                      width: 36,
                      height: 36,
                    }}
                  >
                    {step.done ? (
                      <i
                        className="pi pi-check"
                        style={{ fontSize: '0.875rem' }}
                      />
                    ) : step.active ? (
                      <i
                        className="pi pi-spin pi-spinner"
                        style={{ fontSize: '0.875rem' }}
                      />
                    ) : (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        {i + 1}
                      </span>
                    )}
                  </div>
                  {i < TRACK_STEPS.length - 1 && (
                    <div
                      className="dbt-timeline-line"
                      style={{ background: step.done ? '#16a34a' : '#e5e7eb' }}
                    />
                  )}
                </div>
                <div className="dbt-timeline-body">
                  <p
                    className="dbt-timeline-title"
                    style={{
                      color: step.done
                        ? '#16a34a'
                        : step.active
                          ? '#2563eb'
                          : '#9ca3af',
                    }}
                  >
                    {step.label}
                    {step.active && (
                      <span
                        style={{
                          marginLeft: '0.5rem',
                          fontSize: '0.625rem',
                          background: '#dbeafe',
                          color: '#2563eb',
                          padding: '0.1rem 0.4rem',
                          borderRadius: 4,
                          fontWeight: 700,
                        }}
                      >
                        IN PROGRESS
                      </span>
                    )}
                  </p>
                  <p className="dbt-timeline-subtitle">{step.desc}</p>
                  <p className="dbt-timeline-date">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
