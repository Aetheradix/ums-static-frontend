import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormPage, StatusBadge } from 'shared/new-components';
import { studentApplications, type StudentApplication } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const PENDING = studentApplications.filter(a => a.status === 'Submitted');

export default function TeacherPending() {
  const [selected, setSelected] = useState<StudentApplication | null>(null);
  const [remarks, setRemarks] = useState('');

  const handleApprove = () => {
    if (!remarks.trim()) {
      ToastService.error('Add remarks before approving.');
      return;
    }
    ToastService.success(`Application ${selected?.appNo} approved.`);
    setSelected(null);
    setRemarks('');
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      ToastService.error('Provide rejection reason.');
      return;
    }
    ToastService.error(`Application ${selected?.appNo} rejected.`);
    setSelected(null);
    setRemarks('');
  };

  return (
    <FormPage
      title="Pending Applications — Verification"
      description="Review and verify pending student scholarship applications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Teacher Portal', to: dbtUrls.teacher.portal },
        { label: 'Pending Verification' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1fr 1.2fr' }}
      >
        {/* Left: Table */}
        <FormCard title={`Pending (${PENDING.length})`}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {PENDING.map(app => (
              <div
                key={app.id}
                onClick={() => {
                  setSelected(app);
                  setRemarks('');
                }}
                style={{
                  padding: '0.875rem',
                  borderRadius: 8,
                  border: `1px solid ${selected?.id === app.id ? '#3b82f6' : '#e5e7eb'}`,
                  cursor: 'pointer',
                  background: selected?.id === app.id ? '#eff6ff' : '#fff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.813rem',
                      fontWeight: 700,
                      color: '#111827',
                    }}
                  >
                    {app.studentName}
                  </p>
                  <StatusBadge label={app.status} variant="pending" />
                </div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginTop: 2,
                  }}
                >
                  {app.enrollmentNo} · {app.course}
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#374151',
                    marginTop: 1,
                  }}
                >
                  {app.schemeName.slice(0, 50)}...
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.375rem',
                  }}
                >
                  <span style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                    Attendance:{' '}
                    <strong
                      style={{
                        color: app.attendancePct >= 75 ? '#16a34a' : '#b91c1c',
                      }}
                    >
                      {app.attendancePct}%
                    </strong>
                  </span>
                  <span style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                    CGPA: <strong>{app.cgpa}</strong>
                  </span>
                  <span style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                    ₹{app.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            {PENDING.length === 0 && (
              <div className="dbt-empty">
                <i className="pi pi-check" />
                <p>All applications verified!</p>
              </div>
            )}
          </div>
        </FormCard>

        {/* Right: Detail + Action */}
        {selected ? (
          <FormCard title={`Verify — ${selected.appNo}`}>
            {/* Student Info */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              {[
                ['Student', selected.studentName],
                ['Enrollment No.', selected.enrollmentNo],
                ['Course & Branch', `${selected.course} — ${selected.branch}`],
                ['Semester', selected.semester],
                ['Category', selected.category],
                ['Annual Income', `₹${selected.annualIncome.toLocaleString()}`],
                ['Scheme', selected.schemeName],
                ['Amount', `₹${selected.amount.toLocaleString()}`],
              ].map(([l, v]) => (
                <div key={l} className="dbt-info-field">
                  <p className="dbt-info-label">{l}</p>
                  <p className="dbt-info-value">{v}</p>
                </div>
              ))}
            </div>

            {/* Eligibility Check */}
            <div
              style={{
                padding: '0.75rem',
                background: '#f9fafb',
                borderRadius: 8,
                marginBottom: '1rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
              >
                Eligibility Check
              </p>
              {[
                [
                  'Attendance (≥75%)',
                  selected.attendancePct >= 75,
                  `${selected.attendancePct}%`,
                ],
                ['CGPA (≥6.0)', selected.cgpa >= 6.0, String(selected.cgpa)],
                ['No Backlogs', true, 'Passed'],
                ['Valid Category', true, selected.category],
                [
                  'NPCI Seeded',
                  selected.npciSeeded,
                  selected.npciSeeded ? 'Active' : 'Pending',
                ],
              ].map(([label, pass, val]) => (
                <div
                  key={String(label)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.25rem 0',
                    borderBottom: '1px dashed #f3f4f6',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {String(label)}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: pass ? '#16a34a' : '#b91c1c',
                    }}
                  >
                    {pass ? '✓' : '✗'} {String(val)}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <TextArea
              label="Remarks (required)"
              value={remarks}
              onChange={setRemarks}
              rows={3}
              placeholder="Enter verification remarks..."
              required
            />
            <div
              style={{
                display: 'flex',
                gap: '0.625rem',
                marginTop: '0.875rem',
              }}
            >
              <Button
                label="Approve & Forward"
                variant="primary"
                icon="check"
                onClick={handleApprove}
              />
              <Button
                label="Reject"
                variant="danger"
                icon="times"
                onClick={handleReject}
              />
            </div>
          </FormCard>
        ) : (
          <FormCard>
            <div className="dbt-empty">
              <i className="pi pi-search" />
              <p>Select a student application from the list to verify.</p>
            </div>
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
