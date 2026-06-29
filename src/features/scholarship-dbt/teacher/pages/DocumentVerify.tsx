import { useState } from 'react';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { documentsMaster } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const DOCS_TO_REVIEW = documentsMaster.filter(d => d.uploaded);

export default function TeacherDocumentVerify() {
  const [statuses, setStatuses] = useState<
    Record<string, 'Verified' | 'Rejected' | 'Pending'>
  >(
    Object.fromEntries(DOCS_TO_REVIEW.map(d => [d.id, d.verified ?? 'Pending']))
  );

  const update = (id: string, val: 'Verified' | 'Rejected') => {
    setStatuses(s => ({ ...s, [id]: val }));
    ToastService.success(`Document marked as ${val}.`);
  };

  const verifiedCount = Object.values(statuses).filter(
    v => v === 'Verified'
  ).length;
  const rejectedCount = Object.values(statuses).filter(
    v => v === 'Rejected'
  ).length;

  return (
    <FormPage
      title="Document Verification"
      description="Preview and verify student uploaded documents for scholarship eligibility."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Teacher Portal', to: dbtUrls.teacher.portal },
        { label: 'Document Verification' },
      ]}
    >
      {/* Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          maxWidth: 500,
        }}
      >
        {[
          {
            label: 'Pending Review',
            value: DOCS_TO_REVIEW.length - verifiedCount - rejectedCount,
            color: '#d97706',
            bg: '#fef3c7',
          },
          {
            label: 'Verified',
            value: verifiedCount,
            color: '#16a34a',
            bg: '#d1fae5',
          },
          {
            label: 'Rejected',
            value: rejectedCount,
            color: '#b91c1c',
            bg: '#fee2e2',
          },
        ].map(s => (
          <div
            key={s.label}
            style={{
              padding: '0.75rem',
              borderRadius: 8,
              background: s.bg,
              textAlign: 'center',
              border: `1px solid ${s.color}22`,
            }}
          >
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: s.color }}>
              {s.value}
            </p>
            <p
              style={{ fontSize: '0.688rem', color: s.color, fontWeight: 600 }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <FormCard title={`Uploaded Documents — ${DOCS_TO_REVIEW.length} files`}>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}
        >
          {DOCS_TO_REVIEW.map(doc => {
            const status = statuses[doc.id];
            return (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem',
                  borderRadius: 8,
                  border: `1px solid ${status === 'Verified' ? '#bbf7d0' : status === 'Rejected' ? '#fca5a5' : '#e5e7eb'}`,
                  background:
                    status === 'Verified'
                      ? '#f0fdf4'
                      : status === 'Rejected'
                        ? '#fef2f2'
                        : '#fff',
                  flexWrap: 'wrap',
                }}
              >
                <i
                  className="pi pi-file-pdf"
                  style={{
                    fontSize: '1.5rem',
                    color: '#ef4444',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 140 }}>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    {doc.label}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {doc.fileName} · {doc.size} · {doc.uploadedOn}
                  </p>
                </div>
                <span className={`dbt-status-pill ${status.toLowerCase()}`}>
                  {status}
                </span>
                <div
                  style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      ToastService.success('Opening document preview...')
                    }
                    style={{
                      padding: '0.25rem 0.625rem',
                      border: '1px solid #3b82f6',
                      borderRadius: 4,
                      background: '#eff6ff',
                      color: '#2563eb',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => update(doc.id, 'Verified')}
                    style={{
                      padding: '0.25rem 0.625rem',
                      border: '1px solid #16a34a',
                      borderRadius: 4,
                      background: '#f0fdf4',
                      color: '#15803d',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    disabled={status === 'Verified'}
                  >
                    ✓ Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => update(doc.id, 'Rejected')}
                    style={{
                      padding: '0.25rem 0.625rem',
                      border: '1px solid #ef4444',
                      borderRadius: 4,
                      background: '#fef2f2',
                      color: '#b91c1c',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    disabled={status === 'Rejected'}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </FormCard>
    </FormPage>
  );
}
