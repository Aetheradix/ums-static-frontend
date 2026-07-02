import { useState } from 'react';
import { ToastService } from 'services';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { scholars } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function PlagiarismReview() {
  const [remarks, setRemarks] = useState('');
  const [selected, setSelected] = useState(scholars[0]);

  const handleClear = () => {
    if (!remarks) {
      ToastService.error('Please enter remarks before clearing.');
      return;
    }
    ToastService.success(
      `Plagiarism cleared for ${selected.name}. Forwarded to HOD.`
    );
    setRemarks('');
  };

  const handleFlag = () => {
    if (!remarks) {
      ToastService.error('Please enter remarks before flagging.');
      return;
    }
    ToastService.success(
      `Plagiarism flagged for ${selected.name}. Scholar notified for resubmission.`
    );
    setRemarks('');
  };

  return (
    <FormPage
      title="Plagiarism Review"
      description="Review Turnitin similarity reports for all assigned scholars and clear or flag for revision."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Supervisor Portal', to: thesisUrls.supervisor.portal },
        { label: 'Plagiarism Review' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Scholar Plagiarism Reports">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Scholar</th>
                  <th>Proposal Version</th>
                  <th>Similarity %</th>
                  <th>Status</th>
                  <th>Checked On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {scholars.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.name.split(' ')[0]}</td>
                    <td>V1.{Math.floor(Math.random() * 3) + 1}</td>
                    <td
                      style={{
                        color: s.similarity <= 10 ? '#16a34a' : '#dc2626',
                        fontWeight: 700,
                      }}
                    >
                      {s.similarity}%
                    </td>
                    <td>
                      <span
                        className={`dbt-status-pill ${s.similarity <= 10 ? 'approved' : 'rejected'}`}
                      >
                        {s.similarity <= 10 ? 'Cleared' : 'Flagged'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      12 Mar 2025
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelected(s)}
                        style={{
                          padding: '0.2rem 0.5rem',
                          border: '1px solid #6366f1',
                          background: '#f5f3ff',
                          color: '#4f46e5',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.688rem',
                          fontWeight: 600,
                        }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard title={`Review: ${selected.name}`}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                background: selected.similarity <= 10 ? '#f0fdf4' : '#fef2f2',
                borderRadius: 10,
                border: `1px solid ${selected.similarity <= 10 ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: selected.similarity <= 10 ? '#16a34a' : '#dc2626',
                }}
              >
                {selected.similarity}%
              </div>
              <div
                style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 4 }}
              >
                Turnitin Similarity Index
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <span
                  className={`dbt-status-pill ${selected.similarity <= 10 ? 'approved' : 'rejected'}`}
                >
                  {selected.similarity <= 10
                    ? '✓ Below Threshold'
                    : '✗ Above 10% Threshold'}
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                fontSize: '0.75rem',
                padding: '0.75rem',
                background: '#f9fafb',
                borderRadius: 6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Journal/Book Matches</span>
                <span style={{ fontWeight: 600 }}>3.2%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Internet Sources</span>
                <span style={{ fontWeight: 600 }}>2.8%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Student Papers</span>
                <span style={{ fontWeight: 600 }}>1.1%</span>
              </div>
            </div>
            <TextArea
              label="Supervisor Remarks"
              value={remarks}
              onChange={setRemarks}
            />
            <button
              type="button"
              onClick={handleClear}
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
              ✓ Clear Plagiarism — Forward to HOD
            </button>
            <button
              type="button"
              onClick={handleFlag}
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
              ✗ Flag — Return to Scholar for Revision
            </button>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
