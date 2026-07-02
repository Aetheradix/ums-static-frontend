import { useState } from 'react';
import { ToastService } from 'services';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function ThesisEndorsement() {
  const [remarks, setRemarks] = useState('');

  return (
    <FormPage
      title="Thesis Endorsement"
      description="Final departmental HOD endorsement for thesis before viva scheduling."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'HOD Portal', to: thesisUrls.hod.portal },
        { label: 'Thesis Endorsement' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Thesis: Sunita Chouhan">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div
              style={{
                padding: '1rem',
                background: '#eff6ff',
                borderRadius: 8,
                border: '1px solid #bfdbfe',
              }}
            >
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: '#1e40af',
                  marginBottom: '0.5rem',
                }}
              >
                Smart Healthcare IoT Architecture with Adaptive Edge
                Intelligence
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  color: '#374151',
                }}
              >
                <p>
                  <strong>Scholar:</strong> Sunita Chouhan
                </p>
                <p>
                  <strong>Supervisor:</strong> Dr. Sanjay Tanwani
                </p>
                <p>
                  <strong>Co-Supervisor:</strong> Dr. Preeti Saxena
                </p>
                <p>
                  <strong>Pages:</strong> 214
                </p>
                <p>
                  <strong>Similarity:</strong>{' '}
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>
                    4.8%
                  </span>
                </p>
                <p>
                  <strong>Publications:</strong> 3 (Scopus Indexed)
                </p>
                <p>
                  <strong>Program Duration:</strong> Jan 2022 — Aug 2026 (4.5
                  years)
                </p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                fontSize: '0.75rem',
                padding: '0.75rem',
                background: '#f0fdf4',
                borderRadius: 6,
                border: '1px solid #bbf7d0',
              }}
            >
              <p style={{ fontWeight: 700, color: '#16a34a', marginBottom: 4 }}>
                Supervisor Clearance Note:
              </p>
              <p style={{ color: '#14532d', fontStyle: 'italic' }}>
                "Thesis is comprehensive and represents a significant original
                contribution in IoT-Healthcare edge computing. Recommend for
                viva."
              </p>
            </div>
            <button
              type="button"
              onClick={() => ToastService.success('Downloading thesis PDF...')}
              style={{
                alignSelf: 'flex-start',
                padding: '0.375rem 0.875rem',
                border: '1px solid #6366f1',
                background: '#f5f3ff',
                color: '#4f46e5',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              📥 Download Thesis PDF
            </button>
          </div>
        </FormCard>

        <FormCard title="HOD Thesis Endorsement Form">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.75rem',
                padding: '0.75rem',
                background: '#f9fafb',
                borderRadius: 6,
              }}
            >
              <p style={{ fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                HOD Verification Checklist:
              </p>
              {[
                'Supervisor clearance certificate available',
                'Minimum 2 Scopus/WoS publications confirmed',
                'All milestones completed as per timeline',
                'Final plagiarism ≤ 10% verified',
                'No ongoing disciplinary proceedings',
              ].map((item, i) => (
                <label
                  key={i}
                  style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}
                >
                  <input type="checkbox" />
                  {item}
                </label>
              ))}
            </div>
            <TextArea
              label="HOD Endorsement Remarks *"
              value={remarks}
              onChange={setRemarks}
            />
            <button
              type="button"
              onClick={() => {
                if (!remarks) {
                  ToastService.error('Remarks required.');
                  return;
                }
                ToastService.success(
                  'Thesis endorsed by HOD. URC Cell notified for viva scheduling!'
                );
                setRemarks('');
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
              ✓ HOD Endorse — Authorize Viva Scheduling
            </button>
            <button
              type="button"
              onClick={() => {
                if (!remarks) {
                  ToastService.error('Remarks required.');
                  return;
                }
                ToastService.success(
                  'Thesis returned to scholar for corrections.'
                );
                setRemarks('');
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
              ✗ Return for Corrections
            </button>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
