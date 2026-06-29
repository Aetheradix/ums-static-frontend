import { useState } from 'react';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { documentsMaster, type Document } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const getVerifiedColor = (v?: string) => {
  if (v === 'Verified') return { bg: '#d1fae5', text: '#065f46' };
  if (v === 'Rejected') return { bg: '#fee2e2', text: '#b91c1c' };
  return { bg: '#fef3c7', text: '#b45309' };
};

function DocCard({ doc }: { doc: Document }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      ToastService.success(`${doc.label} uploaded successfully.`);
    }, 800);
  };

  const vc = doc.verified ? getVerifiedColor(doc.verified) : null;

  return (
    <div className={`dbt-doc-card ${doc.uploaded ? 'uploaded' : ''}`}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i
            className={`pi pi-file-pdf`}
            style={{
              color: doc.uploaded ? '#16a34a' : '#9ca3af',
              fontSize: '1.25rem',
            }}
          />
          <div>
            <p
              style={{
                fontSize: '0.813rem',
                fontWeight: 600,
                color: '#111827',
              }}
            >
              {doc.label}
            </p>
            {doc.mandatory && (
              <p
                style={{
                  fontSize: '0.625rem',
                  color: '#ef4444',
                  fontWeight: 600,
                }}
              >
                REQUIRED
              </p>
            )}
          </div>
        </div>
        {doc.verified && vc && (
          <span
            style={{
              padding: '0.125rem 0.5rem',
              borderRadius: 4,
              fontSize: '0.625rem',
              fontWeight: 700,
              background: vc.bg,
              color: vc.text,
            }}
          >
            {doc.verified}
          </span>
        )}
      </div>

      {/* File info */}
      {doc.uploaded && doc.fileName ? (
        <div
          style={{
            padding: '0.5rem',
            background: 'rgba(22,163,74,0.06)',
            borderRadius: 6,
            border: '1px solid #bbf7d0',
          }}
        >
          <p style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 500 }}>
            {doc.fileName}
          </p>
          <p style={{ fontSize: '0.625rem', color: '#6b7280', marginTop: 2 }}>
            {doc.size} · Uploaded {doc.uploadedOn}
          </p>
        </div>
      ) : (
        <div
          style={{
            border: '1px dashed #d1d5db',
            borderRadius: 6,
            padding: '0.75rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            No file uploaded
          </p>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleUpload}
          style={{
            flex: 1,
            padding: '0.375rem 0.625rem',
            border: '1px solid #3b82f6',
            borderRadius: 6,
            background: '#eff6ff',
            color: '#1d4ed8',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
          disabled={uploading}
        >
          {uploading ? 'Uploading…' : doc.uploaded ? 'Replace' : 'Upload'}
        </button>
        {doc.uploaded && (
          <>
            <button
              type="button"
              onClick={() =>
                ToastService.success('Opening document preview...')
              }
              style={{
                padding: '0.375rem 0.625rem',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                background: '#fff',
                color: '#374151',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => ToastService.error('File removed.')}
              style={{
                padding: '0.375rem 0.625rem',
                border: '1px solid #fca5a5',
                borderRadius: 6,
                background: '#fff',
                color: '#b91c1c',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function StudentDocuments() {
  const docs = documentsMaster;
  const uploaded = docs.filter(d => d.uploaded).length;
  const mandatory = docs.filter(d => d.mandatory).length;
  const mandatoryUploaded = docs.filter(d => d.mandatory && d.uploaded).length;

  return (
    <FormPage
      title="Upload Documents"
      description="Upload all required documents for your scholarship application."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'Upload Documents' },
      ]}
    >
      {/* Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        {[
          {
            label: 'Total Documents',
            value: docs.length,
            color: '#2563eb',
            bg: '#dbeafe',
          },
          {
            label: 'Uploaded',
            value: uploaded,
            color: '#16a34a',
            bg: '#d1fae5',
          },
          {
            label: 'Mandatory',
            value: mandatory,
            color: '#d97706',
            bg: '#fef3c7',
          },
          {
            label: 'Mandatory Uploaded',
            value: mandatoryUploaded,
            color: mandatoryUploaded === mandatory ? '#16a34a' : '#b91c1c',
            bg: mandatoryUploaded === mandatory ? '#d1fae5' : '#fee2e2',
          },
        ].map(s => (
          <div
            key={s.label}
            style={{
              padding: '0.875rem',
              borderRadius: 10,
              background: s.bg,
              textAlign: 'center',
              border: `1px solid ${s.color}22`,
            }}
          >
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>
              {s.value}
            </p>
            <p
              style={{
                fontSize: '0.688rem',
                color: s.color,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <FormCard
        title={`Upload Progress — ${uploaded}/${docs.length} documents`}
        className="mb-4"
      >
        <div className="dbt-bar-track" style={{ height: 10 }}>
          <div
            className="dbt-bar-fill"
            style={{
              width: `${(uploaded / docs.length) * 100}%`,
              background: '#16a34a',
            }}
          />
        </div>
        <p
          style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}
        >
          {mandatoryUploaded < mandatory && (
            <span style={{ color: '#b91c1c', fontWeight: 600 }}>
              ⚠ {mandatory - mandatoryUploaded} mandatory document(s) still
              pending upload.
            </span>
          )}
          {mandatoryUploaded === mandatory && (
            <span style={{ color: '#16a34a', fontWeight: 600 }}>
              ✓ All mandatory documents uploaded.
            </span>
          )}
        </p>
      </FormCard>

      {/* Mandatory Docs */}
      <FormCard title="Mandatory Documents" className="mb-4">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {docs
            .filter(d => d.mandatory)
            .map(doc => (
              <DocCard key={doc.id} doc={doc} />
            ))}
        </div>
      </FormCard>

      {/* Optional Docs */}
      <FormCard title="Optional Documents (upload if applicable)">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {docs
            .filter(d => !d.mandatory)
            .map(doc => (
              <DocCard key={doc.id} doc={doc} />
            ))}
        </div>
      </FormCard>
    </FormPage>
  );
}
