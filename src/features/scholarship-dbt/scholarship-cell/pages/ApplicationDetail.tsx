import {
  FormCard,
  FormGrid,
  FormPage,
  StatusBadge,
} from 'shared/new-components';
import { documentsMaster, studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const APP = studentApplications[0];

export default function CellApplicationDetail() {
  return (
    <FormPage
      title="Application Detail"
      description={`Viewing: ${APP.appNo} — ${APP.studentName}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Scholarship Cell', to: dbtUrls.cell.portal },
        { label: 'Applications', to: dbtUrls.cell.applications },
        { label: 'Detail' },
      ]}
    >
      {/* Header */}
      <FormCard className="mb-4">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
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
              Application
            </p>
            <p style={{ fontSize: '1.125rem', fontWeight: 800 }}>{APP.appNo}</p>
            <p style={{ color: '#6b7280', fontSize: '0.813rem' }}>
              {APP.schemeName}
            </p>
          </div>
          <div
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            <p style={{ fontSize: '1rem', fontWeight: 800, color: '#16a34a' }}>
              ₹{APP.amount.toLocaleString()}
            </p>
            <StatusBadge label={APP.status} variant="pending" />
          </div>
        </div>
      </FormCard>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
        }}
      >
        <div>
          <FormCard title="Student Details" className="mb-4">
            <FormGrid columns={2}>
              {[
                ['Name', APP.studentName],
                ['Enrollment', APP.enrollmentNo],
                ['Course', APP.course],
                ['Branch', APP.branch],
                ['Semester', APP.semester],
                ['Department', APP.department],
                ['Category', APP.category],
                ['Annual Income', `₹${APP.annualIncome.toLocaleString()}`],
              ].map(([l, v]) => (
                <div key={l} className="dbt-info-field">
                  <p className="dbt-info-label">{l}</p>
                  <p className="dbt-info-value">{v}</p>
                </div>
              ))}
            </FormGrid>
          </FormCard>

          <FormCard title="Bank & Aadhaar">
            <FormGrid columns={2}>
              {[
                ['Bank Name', APP.bankName],
                ['IFSC', APP.ifsc],
                ['Account', 'XXXXXX12'],
                ['NPCI Seeded', APP.npciSeeded ? 'Yes ✓' : 'No'],
                ['Aadhaar', APP.aadhaarNo],
                ['Attendance', `${APP.attendancePct}%`],
                ['CGPA', String(APP.cgpa)],
                ['Submitted', APP.submittedDate],
              ].map(([l, v]) => (
                <div key={l} className="dbt-info-field">
                  <p className="dbt-info-label">{l}</p>
                  <p
                    className="dbt-info-value"
                    style={{
                      color:
                        l === 'NPCI Seeded' && APP.npciSeeded
                          ? '#16a34a'
                          : undefined,
                    }}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </FormGrid>
          </FormCard>
        </div>

        <div>
          <FormCard title="Documents" className="mb-4">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
              }}
            >
              {documentsMaster
                .filter(d => d.uploaded)
                .slice(0, 8)
                .map(doc => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem 0.625rem',
                      borderRadius: 6,
                      background: '#f9fafb',
                      border: '1px solid #f3f4f6',
                    }}
                  >
                    <span style={{ fontSize: '0.813rem', color: '#374151' }}>
                      {doc.label}
                    </span>
                    <span
                      className={`dbt-status-pill ${(doc.verified ?? 'pending').toLowerCase()}`}
                      style={{ fontSize: '0.625rem' }}
                    >
                      {doc.verified ?? 'Pending'}
                    </span>
                  </div>
                ))}
            </div>
          </FormCard>

          <FormCard title="Approval Audit Trail">
            <div className="dbt-timeline">
              {[
                {
                  step: 'Application Submitted',
                  by: APP.studentName,
                  date: APP.submittedDate,
                  done: true,
                },
                {
                  step: 'Teacher Verified',
                  by: 'Dr. Anil Sharma',
                  date: '18 Sep 2025',
                  done: true,
                },
                {
                  step: 'Cell Verification',
                  by: 'Scholarship Cell',
                  date: '20 Sep 2025',
                  done: true,
                },
                {
                  step: 'Finance Verification',
                  by: '—',
                  date: '—',
                  done: false,
                },
                { step: 'Admin Approval', by: '—', date: '—', done: false },
              ].map((s, i, arr) => (
                <div key={s.step} className="dbt-timeline-step">
                  <div className="dbt-timeline-icon-wrap">
                    <div
                      className="dbt-timeline-icon"
                      style={{
                        background: s.done ? '#dcfce7' : '#f3f4f6',
                        color: s.done ? '#16a34a' : '#9ca3af',
                      }}
                    >
                      {s.done ? (
                        <i
                          className="pi pi-check"
                          style={{ fontSize: '0.75rem' }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.625rem' }}>{i + 1}</span>
                      )}
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        className="dbt-timeline-line"
                        style={{ background: s.done ? '#16a34a' : '#e5e7eb' }}
                      />
                    )}
                  </div>
                  <div className="dbt-timeline-body">
                    <p
                      className="dbt-timeline-title"
                      style={{ color: s.done ? '#111827' : '#9ca3af' }}
                    >
                      {s.step}
                    </p>
                    <p
                      className="dbt-timeline-subtitle"
                      style={{ color: '#6b7280' }}
                    >
                      By: {s.by}
                    </p>
                    <p className="dbt-timeline-date">{s.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
