import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { milestones } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

const MY_MILESTONES = milestones.filter(m => m.scholarId === 'sch-1');

const STATUS_COLOR: Record<string, { bg: string; text: string; dot: string }> =
  {
    Completed: { bg: '#f0fdf4', text: '#166534', dot: '#22c55e' },
    'In Progress': { bg: '#eff6ff', text: '#1e40af', dot: '#3b82f6' },
    Pending: { bg: '#f9fafb', text: '#6b7280', dot: '#d1d5db' },
    Overdue: { bg: '#fef2f2', text: '#991b1b', dot: '#ef4444' },
  };

export default function MilestoneTracker() {
  const completed = MY_MILESTONES.filter(m => m.status === 'Completed').length;
  const inProgress = MY_MILESTONES.filter(
    m => m.status === 'In Progress'
  ).length;
  const pending = MY_MILESTONES.filter(m => m.status === 'Pending').length;
  const overdue = MY_MILESTONES.filter(m => m.status === 'Overdue').length;
  const progress = Math.round((completed / MY_MILESTONES.length) * 100);

  return (
    <FormPage
      title="Milestone Tracker"
      description="Track your PhD research journey milestones from Topic Registration to Viva Defense."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Milestone Tracker' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Completed"
          value={completed}
          icon="check_circle"
          colorScheme="green"
          subtitle={`${progress}% of journey done`}
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon="pending_actions"
          colorScheme="blue"
          subtitle="Currently active"
        />
        <StatCard
          title="Pending"
          value={pending}
          icon="schedule"
          subtitle="Future milestones"
        />
        <StatCard
          title="Overdue"
          value={overdue}
          icon="warning"
          colorScheme="red"
          subtitle="Immediate attention needed"
        />
      </div>

      <FormCard title="Research Journey Progress">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            alignItems: 'center',
          }}
        >
          <span
            style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}
          >
            Overall Completion
          </span>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#16a34a' }}>
            {progress}%
          </span>
        </div>
        <div
          style={{
            height: 8,
            background: '#e5e7eb',
            borderRadius: 4,
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
              borderRadius: 4,
              transition: 'width 0.5s ease',
            }}
          />
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {MY_MILESTONES.map((m, i) => {
            const sc = STATUS_COLOR[m.status];
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1rem',
                  background: sc.bg,
                  borderRadius: 8,
                  border: `1px solid ${sc.dot}30`,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: sc.dot,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {m.status === 'Completed' ? '✓' : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#1f2937',
                      }}
                    >
                      {m.name}
                    </p>
                    <span
                      className={`dbt-status-pill ${m.status === 'Completed' ? 'approved' : m.status === 'In Progress' ? 'submitted' : m.status === 'Overdue' ? 'rejected' : 'draft'}`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: 2 }}>
                    <span style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                      Due: {m.dueDate}
                    </span>
                    {m.completionDate && (
                      <span
                        style={{
                          fontSize: '0.688rem',
                          color: '#16a34a',
                          fontWeight: 600,
                        }}
                      >
                        Completed: {m.completionDate}
                      </span>
                    )}
                    {m.remarks && (
                      <span
                        style={{
                          fontSize: '0.688rem',
                          color: '#dc2626',
                          fontWeight: 600,
                        }}
                      >
                        {m.remarks}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </FormCard>
    </FormPage>
  );
}
