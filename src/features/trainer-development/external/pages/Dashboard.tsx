import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard, GridPanel, StatusBadge } from 'shared/new-components';
import { trainingPrograms, trainingSessions } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<string, 'approved' | 'pending' | 'rejected' | 'neutral' | 'ongoing'> = {
  'Completed': 'approved',
  'Ongoing': 'ongoing',
  'Scheduled': 'pending',
  'Planned': 'neutral',
  'Cancelled': 'rejected',
};

export default function ExternalDashboard() {
  const navigate = useNavigate();

  // Mock stats for external trainer
  const myTrainings = trainingPrograms.slice(2, 4); // Just mock data
  const upcomingSessions = trainingSessions.slice(0, 3); // Just mock data

  return (
    <FormPage
      title="External Trainer Dashboard"
      description="Overview of your assigned training programmes, upcoming sessions, and honorarium."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'External Portal', to: tdmUrls.external.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard title="Total Programmes" value="8" icon="assignment" colorScheme="blue" subtitle="Since joining" />
        <StatCard title="Upcoming Sessions" value="3" icon="event" colorScheme="green" subtitle="Next 30 days" />
        <StatCard title="Average Rating" value="4.8" icon="star" colorScheme="orange" subtitle="From 120 participants" />
        <StatCard title="Pending Payment" value="₹12,000" icon="account_balance_wallet" colorScheme="purple" subtitle="Honorarium" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <FormCard title="Assigned Training Programmes" headerAction={<button type="button" onClick={() => navigate(tdmUrls.external.assignedTrainings)} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.813rem' }}>View All</button>}>
          <GridPanel
            data={myTrainings}
            columns={[
              {
                field: 'title', header: 'Programme',
                cell: (item) => (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{item.title}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.department} • {item.mode}</span>
                  </div>
                ),
              },
              { field: 'startDate', header: 'Start Date' },
              {
                field: 'status', header: 'Status',
                cell: (item) => <StatusBadge label={item.status} variant={STATUS_VARIANTS[item.status] as any} />
              },
            ]}
          />
        </FormCard>

        <FormCard title="Upcoming Sessions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingSessions.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingBottom: '1rem', borderBottom: idx < upcomingSessions.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                <span style={{ fontSize: '0.813rem', fontWeight: 600, color: '#111827' }}>{s.topic}</span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{s.trainingTitle}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.688rem', background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, color: '#4b5563' }}><i className="pi pi-calendar" style={{ fontSize: '0.6rem', marginRight: 4 }}/>{s.date}</span>
                  <span style={{ fontSize: '0.688rem', background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, color: '#4b5563' }}><i className="pi pi-clock" style={{ fontSize: '0.6rem', marginRight: 4 }}/>{s.startTime}</span>
                </div>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
