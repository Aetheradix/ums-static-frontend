import { ToastService } from 'services';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { milestones } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function MilestoneMonitoring() {
  const overdue = milestones.filter(m => m.status === 'Overdue');
  const inProgress = milestones.filter(m => m.status === 'In Progress');

  return (
    <FormPage
      title="Milestone Monitoring"
      description="Monitor all scholar milestones with overdue alerts and send automated notifications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Research Cell', to: thesisUrls.cell.portal },
        { label: 'Milestone Monitoring' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Total Milestones"
          value={milestones.length}
          icon="flag"
          colorScheme="blue"
          subtitle="Across all scholars"
        />
        <StatCard
          title="Completed"
          value={milestones.filter(m => m.status === 'Completed').length}
          icon="check_circle"
          colorScheme="green"
          subtitle="Successfully done"
        />
        <StatCard
          title="In Progress"
          value={inProgress.length}
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Currently active"
        />
        <StatCard
          title="Overdue"
          value={overdue.length}
          icon="timer_off"
          colorScheme="red"
          subtitle="Immediate action needed"
        />
      </div>

      {overdue.length > 0 && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            background: '#fef2f2',
            borderRadius: 10,
            border: '1px solid #fecaca',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: 800,
                color: '#b91c1c',
              }}
            >
              ⚠️ Overdue Milestones — Immediate Action Required
            </p>
            <button
              type="button"
              onClick={() =>
                ToastService.success(
                  'Alert notifications sent to all overdue scholars.'
                )
              }
              style={{
                padding: '0.375rem 0.875rem',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.75rem',
              }}
            >
              Send Alerts to All
            </button>
          </div>
          {overdue.map(m => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.625rem',
                background: '#fff',
                borderRadius: 6,
                marginBottom: '0.5rem',
                border: '1px solid #fecaca',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '0.813rem',
                    fontWeight: 700,
                    color: '#1f2937',
                  }}
                >
                  {m.name}
                </p>
                <p style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                  Due: {m.dueDate} · {m.remarks}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  ToastService.success(
                    `Alert sent to scholar for milestone: ${m.name}`
                  )
                }
                style={{
                  padding: '0.25rem 0.625rem',
                  border: '1px solid #ef4444',
                  background: '#fff',
                  color: '#b91c1c',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Send Alert
              </button>
            </div>
          ))}
        </div>
      )}

      <FormCard title="All Milestone Status">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Scholar</th>
                <th>Milestone</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>Rajesh Sahu</td>
                  <td>{m.name}</td>
                  <td>{m.dueDate}</td>
                  <td>
                    <span
                      className={`dbt-status-pill ${m.status === 'Completed' ? 'approved' : m.status === 'In Progress' ? 'submitted' : m.status === 'Overdue' ? 'rejected' : 'draft'}`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td
                    style={{
                      fontSize: '0.688rem',
                      color: m.status === 'Overdue' ? '#dc2626' : '#6b7280',
                    }}
                  >
                    {m.remarks || m.completionDate || '—'}
                  </td>
                  <td>
                    {m.status === 'Overdue' && (
                      <button
                        type="button"
                        onClick={() =>
                          ToastService.success(
                            'Escalation sent to HOD and Supervisor.'
                          )
                        }
                        style={{
                          padding: '0.2rem 0.5rem',
                          border: '1px solid #f59e0b',
                          background: '#fffbeb',
                          color: '#d97706',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.688rem',
                          fontWeight: 600,
                        }}
                      >
                        Escalate
                      </button>
                    )}
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
