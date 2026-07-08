import { FormCard, FormPage } from 'shared/new-components';
import { civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const EXECUTION_ROUTING: Array<{
  route: string;
  when: string;
  process: string[];
  examples: string;
  color: string;
}> = [
  {
    route: 'Internal Execution',
    when: 'Works executed by departmental Labour & Materials',
    process: [
      'Engineer direct supervision',
      'Daily muster roll maintained',
      'Material issue vouchers',
      'MB entries by JE',
      'Bill certified by AE/EE',
    ],
    examples: 'Plastering, painting, small maintenance, whitewash',
    color: '#dbeafe',
  },
  {
    route: 'External Contractor (Tendering)',
    when: 'All capital works, major maintenance, renewal > ₹5L',
    process: [
      'BOQ compiled → AA → TS',
      'Budget locked → NIT published',
      'Bids evaluated → L1 awarded',
      'Work Order issued',
      'RA Bills on MB basis',
    ],
    examples: 'Building construction, road works, hostel blocks',
    color: '#dcfce7',
  },
  {
    route: 'Deposit Work (External Agency)',
    when: 'Government agency execution (PWD, CPWD, PIU, MPSEDC)',
    process: [
      'AA obtained',
      'Funds deposited with agency',
      'Fortnightly progress MIS received',
      'Agency submits UC (Utilization Certificate)',
      'Separate accounting',
    ],
    examples: 'State-funded highway works, CPWD construction, MPSEDC projects',
    color: '#fef3c7',
  },
];

export default function ExecutionRouter() {
  const internal = civilWorks.filter(w => w.executionRoute === 'Internal');
  const external = civilWorks.filter(
    w => w.executionRoute === 'External Agency'
  );

  return (
    <FormPage
      title="Execution Router"
      description="The ERP routes each work through one of three pathways based on category, estimated cost, and execution method."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'Execution Router' },
      ]}
    >
      {/* Route Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        {EXECUTION_ROUTING.map(r => (
          <div
            key={r.route}
            style={{
              background: r.color,
              borderRadius: '1rem',
              padding: '1.25rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.9375rem',
                marginBottom: '0.5rem',
              }}
            >
              {r.route}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.75rem',
              }}
            >
              {r.when}
            </div>
            <div
              style={{
                fontWeight: 600,
                fontSize: '0.75rem',
                marginBottom: '0.375rem',
                color: '#374151',
              }}
            >
              Process Steps:
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: '1rem',
                fontSize: '0.72rem',
                color: '#4b5563',
                lineHeight: 1.8,
              }}
            >
              {r.process.map(p => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div
              style={{
                marginTop: '0.75rem',
                fontSize: '0.72rem',
                color: '#6b7280',
                background: 'rgba(255,255,255,0.5)',
                borderRadius: '0.5rem',
                padding: '0.4rem 0.6rem',
              }}
            >
              <strong>Examples:</strong> {r.examples}
            </div>
          </div>
        ))}
      </div>

      {/* Current Work Routing */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.25rem',
        }}
      >
        <FormCard title={`Internal Execution Works (${internal.length})`}>
          <table className="civil-table">
            <thead>
              <tr>
                <th>Work ID</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {internal.map(w => (
                <tr key={w.id}>
                  <td>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        color: '#1d4ed8',
                      }}
                    >
                      {w.workId}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{w.name}</td>
                  <td>
                    <span
                      className={`civil-pill ${w.status === 'In Progress' ? 'blue' : w.status === 'Completed' ? 'green' : 'gray'}`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormCard>
        <FormCard title={`External / Deposit Works (${external.length})`}>
          <table className="civil-table">
            <thead>
              <tr>
                <th>Work ID</th>
                <th>Name</th>
                <th>Agency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {external.map(w => (
                <tr key={w.id}>
                  <td>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        color: '#1d4ed8',
                      }}
                    >
                      {w.workId}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{w.name}</td>
                  <td style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                    {w.externalAgency ?? 'PWD'}
                  </td>
                  <td>
                    <span
                      className="civil-pill amber"
                      style={{ fontSize: '0.65rem' }}
                    >
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormCard>
      </div>
    </FormPage>
  );
}
