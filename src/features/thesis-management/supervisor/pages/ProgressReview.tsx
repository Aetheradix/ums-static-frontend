import { useState } from 'react';
import { ToastService } from 'services';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { progressReports } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Report = (typeof progressReports)[0];

export default function ProgressReview() {
  const [list, setList] = useState<Report[]>(progressReports);
  const [selected, setSelected] = useState<Report | null>(null);
  const [remarks, setRemarks] = useState('');

  const handleAction = (action: 'Approved' | 'Returned') => {
    if (!selected) return;
    if (!remarks) {
      ToastService.error('Remarks are required.');
      return;
    }
    setList(prev =>
      prev.map(r =>
        r.id === selected.id
          ? { ...r, status: action, supervisorRemarks: remarks }
          : r
      )
    );
    ToastService.success(
      `Progress report ${action.toLowerCase()} with remarks.`
    );
    setSelected(null);
    setRemarks('');
  };

  const statusColor: Record<string, string> = {
    Approved: 'approved',
    Submitted: 'submitted',
    Returned: 'rejected',
    Draft: 'draft',
  };

  return (
    <FormPage
      title="Progress Review"
      description="Review and evaluate scholar semester and monthly progress reports."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Supervisor Portal', to: thesisUrls.supervisor.portal },
        { label: 'Progress Review' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Submitted Progress Reports">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Scholar</th>
                  <th>Type</th>
                  <th>Period</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>Rajesh Sahu</td>
                    <td>{r.type}</td>
                    <td>{r.period}</td>
                    <td style={{ fontSize: '0.75rem' }}>{r.submittedOn}</td>
                    <td>
                      <span
                        className={`dbt-status-pill ${statusColor[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status === 'Submitted' && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(r);
                            setRemarks('');
                          }}
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
                          Evaluate
                        </button>
                      )}
                      {r.status !== 'Submitted' && (
                        <span
                          style={{ fontSize: '0.688rem', color: '#9ca3af' }}
                        >
                          {r.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard
          title={
            selected ? 'Evaluate Progress Report' : 'Select Report to Evaluate'
          }
        >
          {!selected ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 200,
                color: '#9ca3af',
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>📊</span>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                Click "Evaluate" on a submitted report
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  padding: '0.875rem',
                  background: '#f8fafc',
                  borderRadius: 8,
                }}
              >
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#374151',
                  }}
                >
                  Period: {selected.period}
                </p>
                <p
                  style={{
                    fontSize: '0.688rem',
                    color: '#6b7280',
                    marginTop: 4,
                  }}
                >
                  <strong>Work Done:</strong>{' '}
                  {selected.workCompleted.substring(0, 100)}...
                </p>
              </div>
              <TextArea
                label="Supervisor Evaluation Remarks *"
                value={remarks}
                onChange={setRemarks}
              />
              <button
                type="button"
                onClick={() => handleAction('Approved')}
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
                ✓ Approve Report
              </button>
              <button
                type="button"
                onClick={() => handleAction('Returned')}
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
                ✗ Return for Resubmission
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                style={{
                  padding: '0.5rem',
                  background: '#fff',
                  color: '#6b7280',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
