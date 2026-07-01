import { useState } from 'react';
import { ToastService } from 'services';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function SynopsisReview() {
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('Submitted');

  const handleEndorse = () => {
    if (!remarks) {
      ToastService.error('Enter endorsement remarks first.');
      return;
    }
    setStatus('Endorsed');
    ToastService.success(
      'Synopsis endorsed and forwarded to HOD for departmental approval.'
    );
    setRemarks('');
  };

  const handleReturn = () => {
    if (!remarks) {
      ToastService.error('Enter return remarks first.');
      return;
    }
    setStatus('Returned');
    ToastService.success(
      'Synopsis returned to scholar with revision comments.'
    );
    setRemarks('');
  };

  return (
    <FormPage
      title="Synopsis Review"
      description="Review and technically evaluate scholar synopsis before forwarding to HOD for endorsement."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Supervisor Portal', to: thesisUrls.supervisor.portal },
        { label: 'Synopsis Review' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <FormCard title="Pending Synopsis Submissions">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div
              style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                background: '#f8fafc',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#1f2937',
                  }}
                >
                  Rajesh Kumar Sahu
                </p>
                <span
                  className={`dbt-status-pill ${status === 'Endorsed' ? 'approved' : status === 'Returned' ? 'rejected' : 'submitted'}`}
                >
                  {status}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#374151',
                  fontStyle: 'italic',
                  marginBottom: '0.5rem',
                }}
              >
                "Optimizing Low-Resource Translation for Central Indian Dialects
                using Hybrid Transformer Ensembles"
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.25rem',
                  fontSize: '0.688rem',
                  color: '#6b7280',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>Submitted:</span> 15 Jun
                  2026
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>Pages:</span> 42
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>Similarity:</span>{' '}
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>
                    8.5%
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>Publications:</span> 2
                </div>
              </div>
              <div
                style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}
              >
                <button
                  type="button"
                  onClick={() =>
                    ToastService.success('Downloading synopsis PDF...')
                  }
                  style={{
                    padding: '0.25rem 0.625rem',
                    border: '1px solid #6366f1',
                    background: '#f5f3ff',
                    color: '#4f46e5',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </FormCard>

        <FormCard title="Technical Evaluation Form">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {[
              { label: 'Research Gap Clearly Identified', checked: true },
              { label: 'Methodology is Sound & Reproducible', checked: true },
              { label: 'Related Work Section is Comprehensive', checked: true },
              { label: 'Objectives Align with Research Title', checked: true },
              { label: 'Proposed Timeline is Realistic', checked: false },
            ].map((item, i) => (
              <label
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >
                <input type="checkbox" defaultChecked={item.checked} />
                {item.label}
              </label>
            ))}
            <TextArea
              label="Supervisor Technical Remarks *"
              value={remarks}
              onChange={setRemarks}
            />
            <button
              type="button"
              onClick={handleEndorse}
              style={{
                padding: '0.5rem',
                background: '#22c55e',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ✓ Endorse Synopsis — Forward to HOD
            </button>
            <button
              type="button"
              onClick={handleReturn}
              style={{
                padding: '0.5rem',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ✗ Return for Revision
            </button>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
