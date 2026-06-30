import { useNavigate } from 'react-router-dom';
import {
  FormCard,
  FormPage,
  StatCard,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  certificates,
  trainingPrograms,
  competencyMappings,
} from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<
  string,
  'approved' | 'pending' | 'rejected' | 'neutral' | 'ongoing'
> = {
  Completed: 'approved',
  Ongoing: 'ongoing',
  Scheduled: 'pending',
  Planned: 'neutral',
  Cancelled: 'rejected',
};

export default function FacultyDashboard() {
  const navigate = useNavigate();

  // Mock stats for the logged in faculty
  const myTrainings = trainingPrograms.slice(0, 4);
  const myCerts = certificates.filter(c => c.participantId === 'EMP-1042');
  const myGaps = competencyMappings.filter(
    c => c.employeeId === 'EMP-1042' && c.gap > 0
  ).length;

  return (
    <FormPage
      title="Faculty Training Dashboard"
      description="Track your competency progression, upcoming trainings, and certificates."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Faculty Portal', to: tdmUrls.faculty.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <StatCard
          title="Hours Attended"
          value="48h"
          icon="schedule"
          colorScheme="blue"
          subtitle="This academic year"
        />
        <StatCard
          title="Certificates Earned"
          value={myCerts.length}
          icon="workspace_premium"
          colorScheme="purple"
          subtitle="Total verified"
        />
        <StatCard
          title="Skill Gaps"
          value={myGaps}
          icon="psychology"
          colorScheme="red"
          subtitle="Action required"
        />
        <StatCard
          title="Upcoming Sessions"
          value="2"
          icon="event"
          colorScheme="green"
          subtitle="Next 30 days"
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
        }}
      >
        <FormCard
          title="My Training Programmes"
          headerAction={
            <button
              type="button"
              onClick={() => navigate(tdmUrls.faculty.myTrainings)}
              style={{
                color: '#3b82f6',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.813rem',
              }}
            >
              View All
            </button>
          }
        >
          <GridPanel
            data={myTrainings}
            columns={[
              {
                field: 'title',
                header: 'Programme',
                cell: item => (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{item.title}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {item.type} • {item.mode}
                    </span>
                  </div>
                ),
              },
              { field: 'startDate', header: 'Start Date' },
              {
                field: 'status',
                header: 'Status',
                cell: item => (
                  <StatusBadge
                    label={item.status}
                    variant={STATUS_VARIANTS[item.status] as any}
                  />
                ),
              },
            ]}
          />
        </FormCard>

        <FormCard title="Skill Gaps & Competency">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {competencyMappings
              .filter(c => c.employeeId === 'EMP-1042')
              .map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    paddingBottom: '1rem',
                    borderBottom: idx < 2 ? '1px solid #e5e7eb' : 'none',
                  }}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span
                      style={{
                        fontSize: '0.813rem',
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      {c.competency}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: c.gap > 0 ? '#ef4444' : '#10b981',
                      }}
                    >
                      {c.gap > 0 ? `Gap: ${c.gap} Lvl` : 'Achieved'}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        background: '#f3f4f6',
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          background: '#3b82f6',
                          width: `${(c.currentLevel / c.requiredLevel) * 100}%`,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      L{c.currentLevel}/L{c.requiredLevel}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
