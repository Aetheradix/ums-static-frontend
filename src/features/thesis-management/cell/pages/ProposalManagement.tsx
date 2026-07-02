import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { scholars } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function ProposalManagement() {
  return (
    <FormPage
      title="Proposal Management"
      description="Review HOD-endorsed proposals, initiate plagiarism checks and process for research code allocation."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Research Cell', to: thesisUrls.cell.portal },
        { label: 'Proposal Management' },
      ]}
    >
      <FormCard title="HOD-Endorsed Proposals Queue">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Scholar</th>
                <th>Research Title</th>
                <th>HOD Approved</th>
                <th>Similarity</th>
                <th>Cell Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scholars.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700 }}>{s.name}</td>
                  <td style={{ fontSize: '0.75rem', maxWidth: 200 }}>
                    {s.specialization} — {s.researchArea}
                  </td>
                  <td
                    style={{
                      fontSize: '0.75rem',
                      color: '#16a34a',
                      fontWeight: 600,
                    }}
                  >
                    ✓ Yes
                  </td>
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
                      className={`dbt-status-pill ${s.phase === 'Proposal Approved' ? 'submitted' : s.phase.includes('Writing') || s.phase.includes('Viva') ? 'approved' : 'draft'}`}
                    >
                      {s.phase === 'Proposal Approved'
                        ? 'Pending Code'
                        : 'Code Issued'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        type="button"
                        onClick={() =>
                          ToastService.success(
                            `Research code allocated for ${s.name}.`
                          )
                        }
                        style={{
                          padding: '0.2rem 0.5rem',
                          border: '1px solid #22c55e',
                          background: '#f0fdf4',
                          color: '#16a34a',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.688rem',
                          fontWeight: 600,
                        }}
                      >
                        Allocate Code
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          ToastService.success(
                            `Plagiarism check initiated for ${s.name}.`
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
                          fontWeight: 600,
                        }}
                      >
                        Plagiarism Check
                      </button>
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
