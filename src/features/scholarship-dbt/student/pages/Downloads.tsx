import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

interface Download {
  id: string;
  title: string;
  type: string;
  date: string;
  size: string;
  available: boolean;
}

const DOWNLOADS: Download[] = [
  {
    id: 'd1',
    title: 'Bonafide Certificate (Scholarship)',
    type: 'Certificate',
    date: '01 Jul 2025',
    size: '0.4 MB',
    available: true,
  },
  {
    id: 'd2',
    title: 'NSP Acknowledgement Slip',
    type: 'Receipt',
    date: '15 Sep 2025',
    size: '0.2 MB',
    available: true,
  },
  {
    id: 'd3',
    title: 'Scholarship Sanction Order',
    type: 'Sanction Letter',
    date: '—',
    size: '—',
    available: false,
  },
  {
    id: 'd4',
    title: 'DBT Payment Receipt — ₹25,000',
    type: 'Payment Receipt',
    date: '25 Sep 2025',
    size: '0.3 MB',
    available: true,
  },
  {
    id: 'd5',
    title: 'Income Certificate (Verified Copy)',
    type: 'Document',
    date: '20 Sep 2025',
    size: '0.8 MB',
    available: true,
  },
  {
    id: 'd6',
    title: 'Caste Certificate (Verified Copy)',
    type: 'Document',
    date: '20 Sep 2025',
    size: '0.6 MB',
    available: true,
  },
  {
    id: 'd7',
    title: 'NPCI Seeding Confirmation Letter',
    type: 'Letter',
    date: '22 Sep 2025',
    size: '0.2 MB',
    available: true,
  },
  {
    id: 'd8',
    title: 'Aadhaar Verification Certificate',
    type: 'Certificate',
    date: '15 Sep 2025',
    size: '0.1 MB',
    available: true,
  },
  {
    id: 'd9',
    title: 'Scholarship Rejection Letter',
    type: 'Letter',
    date: '—',
    size: '—',
    available: false,
  },
  {
    id: 'd10',
    title: 'Fee Adjustment Statement',
    type: 'Statement',
    date: '—',
    size: '—',
    available: false,
  },
];

const TYPE_COLOR: Record<string, string> = {
  Certificate: '#2563eb',
  Receipt: '#16a34a',
  'Sanction Letter': '#7c3aed',
  'Payment Receipt': '#059669',
  Document: '#d97706',
  Letter: '#0891b2',
  Statement: '#be185d',
};

export default function StudentDownloads() {
  return (
    <FormPage
      title="Downloads"
      description="Download your scholarship documents, certificates and payment receipts."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'Downloads' },
      ]}
    >
      <FormCard
        title={`Available Downloads (${DOWNLOADS.filter(d => d.available).length} of ${DOWNLOADS.length})`}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          {DOWNLOADS.map(doc => (
            <div
              key={doc.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.875rem 1rem',
                borderRadius: 8,
                border: `1px solid ${doc.available ? '#e5e7eb' : '#f3f4f6'}`,
                background: doc.available ? '#fff' : '#f9fafb',
                opacity: doc.available ? 1 : 0.6,
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <i
                  className="pi pi-file-pdf"
                  style={{
                    fontSize: '1.5rem',
                    color: doc.available ? '#ef4444' : '#9ca3af',
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: doc.available ? '#111827' : '#9ca3af',
                    }}
                  >
                    {doc.title}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                      marginTop: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        padding: '0.1rem 0.375rem',
                        borderRadius: 4,
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        background: (TYPE_COLOR[doc.type] || '#6b7280') + '1a',
                        color: TYPE_COLOR[doc.type] || '#6b7280',
                      }}
                    >
                      {doc.type}
                    </span>
                    {doc.date !== '—' && (
                      <span style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                        {doc.date}
                      </span>
                    )}
                    {doc.size !== '—' && (
                      <span style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                        {doc.size}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {doc.available ? (
                <button
                  type="button"
                  onClick={() =>
                    ToastService.success(`${doc.title} downloaded.`)
                  }
                  style={{
                    padding: '0.375rem 0.875rem',
                    border: '1px solid #3b82f6',
                    borderRadius: 6,
                    background: '#eff6ff',
                    color: '#2563eb',
                    fontSize: '0.813rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    flexShrink: 0,
                  }}
                >
                  <i className="pi pi-download" />
                  Download
                </button>
              ) : (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    fontStyle: 'italic',
                    flexShrink: 0,
                  }}
                >
                  Not Available
                </span>
              )}
            </div>
          ))}
        </div>
      </FormCard>
    </FormPage>
  );
}
