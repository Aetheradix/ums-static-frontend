import { FormCard, FormPage } from 'shared/new-components';
import { scholars, milestones } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function DeptProgress() {
  const statusColor: Record<string, string> = {
    Active: 'approved',
    Inactive: 'draft',
    Completed: 'submitted',
    Withdrawn: 'rejected',
  };

  return (
    <FormPage
      title="Department Research Progress"
      description="Monitor all PhD scholars, phases, milestones and expected completion timelines."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'HOD Portal', to: thesisUrls.hod.portal },
        { label: 'Department Progress' },
      ]}
    >
      <FormCard title="Scholar Research Progress Overview">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Scholar</th>
                <th>Research Area</th>
                <th>Supervisor</th>
                <th>Phase</th>
                <th>Registration</th>
                <th>Expected</th>
                <th>Milestones Done</th>
                <th>Similarity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {scholars.map(s => {
                const ms = milestones.filter(m => m.scholarId === s.id);
                const done = ms.filter(m => m.status === 'Completed').length;
                return (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.name}</td>
                    <td style={{ fontSize: '0.75rem' }}>{s.researchArea}</td>
                    <td style={{ fontSize: '0.75rem' }}>
                      Dr.{' '}
                      {s.supervisor.split('. ')[1]?.split(' ')[0] || 'Tanwani'}
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>{s.phase}</td>
                    <td style={{ fontSize: '0.75rem' }}>
                      {s.registrationDate}
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>
                      {s.expectedCompletion}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#1e40af' }}>
                        {done}/{ms.length}
                      </span>
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
                        className={`dbt-status-pill ${statusColor[s.status]}`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
