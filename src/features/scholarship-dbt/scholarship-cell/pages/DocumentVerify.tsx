import { useState } from 'react';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { documentsMaster } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const DOCS = documentsMaster.filter(d => d.uploaded);

export default function CellDocumentVerify() {
  const [statuses, setStatuses] = useState<
    Record<string, 'Verified' | 'Rejected' | 'Pending'>
  >(Object.fromEntries(DOCS.map(d => [d.id, d.verified ?? 'Pending'])));
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  const update = (id: string, val: 'Verified' | 'Rejected') => {
    setStatuses(s => ({ ...s, [id]: val }));
    ToastService.success(`Document ${val.toLowerCase()}.`);
  };

  const verified = Object.values(statuses).filter(v => v === 'Verified').length;
  const rejected = Object.values(statuses).filter(v => v === 'Rejected').length;
  const pending = DOCS.length - verified - rejected;

  return (
    <FormPage
      title="Document Verification"
      description="Verify all uploaded documents for scholarship cell approval."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Scholarship Cell', to: dbtUrls.cell.portal },
        { label: 'Document Verification' },
      ]}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          maxWidth: 480,
        }}
      >
        {[
          { l: 'Pending', v: pending, c: '#d97706', bg: '#fef3c7' },
          { l: 'Verified', v: verified, c: '#16a34a', bg: '#d1fae5' },
          { l: 'Rejected', v: rejected, c: '#b91c1c', bg: '#fee2e2' },
        ].map(s => (
          <div
            key={s.l}
            style={{
              padding: '0.875rem',
              borderRadius: 8,
              background: s.bg,
              textAlign: 'center',
              border: `1px solid ${s.c}22`,
            }}
          >
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: s.c }}>
              {s.v}
            </p>
            <p style={{ fontSize: '0.688rem', color: s.c, fontWeight: 600 }}>
              {s.l}
            </p>
          </div>
        ))}
      </div>

      <FormCard title={`Documents — ${DOCS.length} uploaded`}>
        {DOCS.map(doc => {
          const status = statuses[doc.id];
          return (
            <div
              key={doc.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
                borderRadius: 8,
                border: `1px solid ${status === 'Verified' ? '#bbf7d0' : status === 'Rejected' ? '#fca5a5' : '#e5e7eb'}`,
                background:
                  status === 'Verified'
                    ? '#f0fdf4'
                    : status === 'Rejected'
                      ? '#fef2f2'
                      : '#fff',
                marginBottom: '0.625rem',
                flexWrap: 'wrap',
              }}
            >
              <i
                className="pi pi-file-pdf"
                style={{
                  fontSize: '1.5rem',
                  color: '#ef4444',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div style={{ flex: 1, minWidth: 160 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      {doc.label}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {doc.fileName} · {doc.size} · {doc.uploadedOn}
                    </p>
                  </div>
                  <span className={`dbt-status-pill ${status.toLowerCase()}`}>
                    {status}
                  </span>
                </div>
                {/* Reject Reason */}
                {status !== 'Rejected' ? null : (
                  <input
                    placeholder="Rejection reason..."
                    value={remarks[doc.id] ?? ''}
                    onChange={e =>
                      setRemarks(r => ({ ...r, [doc.id]: e.target.value }))
                    }
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '0.375rem 0.625rem',
                      border: '1px solid #fca5a5',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      outline: 'none',
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '0.375rem',
                  flexShrink: 0,
                  alignSelf: 'flex-start',
                }}
              >
                <button
                  type="button"
                  onClick={() => ToastService.success('Opening preview...')}
                  style={{
                    padding: '0.375rem 0.625rem',
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
                    padding: '0.375rem 0.625rem',
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
                    padding: '0.375rem 0.625rem',
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
      </FormCard>
    </FormPage>
  );
}
