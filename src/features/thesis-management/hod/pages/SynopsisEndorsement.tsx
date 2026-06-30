import { useState } from 'react';
import { ToastService } from 'services';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function SynopsisEndorsement() {
  const [remarksR, setRemarksR] = useState('');
  const [remarksP, setRemarksP] = useState('');

  return (
    <FormPage
      title="Synopsis Endorsement"
      description="Provide departmental HOD endorsement for scholar synopsis before URC Cell registration."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'HOD Portal', to: thesisUrls.hod.portal },
        { label: 'Synopsis Endorsement' },
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {[
          {
            scholar: 'Rajesh Kumar Sahu',
            title:
              'Optimizing Low-Resource Translation for Central Indian Dialects',
            supervisor: 'Dr. Sanjay Tanwani',
            pages: 42,
            similarity: 8.5,
            supvRemark: 'Cleared — sound methodology.',
            remarks: remarksR,
            setRemarks: setRemarksR,
          },
          {
            scholar: 'Priya Verma',
            title:
              'Homomorphic Encryption for Privacy-Preserving Cloud Audit Logs',
            supervisor: 'Dr. Sanjay Tanwani',
            pages: 38,
            similarity: 6.2,
            supvRemark: 'Endorsed — solid cryptographic grounding.',
            remarks: remarksP,
            setRemarks: setRemarksP,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="dbt-bottom-row"
            style={{ gridTemplateColumns: '1.2fr 1fr' }}
          >
            <FormCard title={`Synopsis: ${item.scholar}`}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem',
                  fontSize: '0.813rem',
                }}
              >
                <p
                  style={{
                    fontStyle: 'italic',
                    color: '#374151',
                    fontWeight: 600,
                  }}
                >
                  "{item.title}"
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span
                      style={{
                        minWidth: 100,
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      Supervisor:
                    </span>
                    <span>{item.supervisor}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span
                      style={{
                        minWidth: 100,
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      Pages:
                    </span>
                    <span>{item.pages}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span
                      style={{
                        minWidth: 100,
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      Similarity:
                    </span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>
                      {item.similarity}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span
                      style={{
                        minWidth: 100,
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      Supv. Remark:
                    </span>
                    <span style={{ color: '#16a34a' }}>{item.supvRemark}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    ToastService.success('Downloading synopsis PDF...')
                  }
                  style={{
                    alignSelf: 'flex-start',
                    padding: '0.25rem 0.75rem',
                    border: '1px solid #6366f1',
                    background: '#f5f3ff',
                    color: '#4f46e5',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  📥 Download Synopsis
                </button>
              </div>
            </FormCard>
            <FormCard title="HOD Endorsement">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <TextArea
                  label="HOD Endorsement Remarks *"
                  value={item.remarks}
                  onChange={item.setRemarks}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!item.remarks) {
                      ToastService.error('Remarks required.');
                      return;
                    }
                    ToastService.success(
                      `Synopsis for ${item.scholar} endorsed by HOD. Forwarded to URC Cell.`
                    );
                    item.setRemarks('');
                  }}
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
                  ✓ HOD Endorse — Forward to URC Cell
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!item.remarks) {
                      ToastService.error('Remarks required.');
                      return;
                    }
                    ToastService.success(
                      `Synopsis for ${item.scholar} returned to supervisor.`
                    );
                    item.setRemarks('');
                  }}
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
                  ✗ Return to Supervisor
                </button>
              </div>
            </FormCard>
          </div>
        ))}
      </div>
    </FormPage>
  );
}
