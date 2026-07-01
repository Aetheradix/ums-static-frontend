import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { scholars } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function PlagiarismVerification() {
  return (
    <FormPage
      title="Plagiarism Verification"
      description="Initiate Turnitin checks, view similarity reports and mark official clearance status."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Research Cell', to: thesisUrls.cell.portal },
        { label: 'Plagiarism Verification' },
      ]}
    >
      <FormCard title="Plagiarism Check Status">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Scholar</th>
                <th>Version</th>
                <th>Similarity</th>
                <th>Status</th>
                <th>Checked By</th>
                <th>Checked On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scholars.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700 }}>{s.name}</td>
                  <td>V1.2</td>
                  <td
                    style={{
                      color: s.similarity <= 10 ? '#16a34a' : '#dc2626',
                      fontWeight: 800,
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
                  <td style={{ fontSize: '0.75rem' }}>Cell Officer</td>
                  <td style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    12 Mar 2025
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        type="button"
                        onClick={() =>
                          ToastService.success(
                            `Turnitin re-check initiated for ${s.name}.`
                          )
                        }
                        style={{
                          padding: '0.2rem 0.5rem',
                          border: '1px solid #6366f1',
                          background: '#f5f3ff',
                          color: '#4f46e5',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.688rem',
                        }}
                      >
                        Re-Check
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          ToastService.success(
                            `Downloading report for ${s.name}...`
                          )
                        }
                        style={{
                          padding: '0.2rem 0.5rem',
                          border: '1px solid #3b82f6',
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.688rem',
                        }}
                      >
                        Report
                      </button>
                      {s.similarity > 10 && (
                        <button
                          type="button"
                          onClick={() =>
                            ToastService.success(
                              `Return notification sent to ${s.name}.`
                            )
                          }
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #ef4444',
                            background: '#fff',
                            color: '#b91c1c',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.688rem',
                          }}
                        >
                          Return
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
