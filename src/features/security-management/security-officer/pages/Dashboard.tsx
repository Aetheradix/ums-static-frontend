import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { incidents } from '../../mocks';
import '../../super-admin/pages/Dashboard.css';
import { smsUrls } from '../../urls';

// Officer only sees incidents assigned to them
const OFFICER_NAME = 'Officer Rajesh Kumar';
const myIncidents = incidents.filter(i => i.assignedTo === OFFICER_NAME);
const pendingInvestigation = myIncidents.filter(
  i => i.status === 'Assigned' || i.status === 'Under Investigation'
);
const resolvedCases = myIncidents.filter(
  i => i.status === 'Resolved' || i.status === 'Closed'
);
const highPriority = myIncidents.filter(
  i => i.priority === 'High' || i.priority === 'Critical'
);

export default function SecurityOfficerDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Security Officer Dashboard"
      description={`Welcome, ${OFFICER_NAME}. Here are your assigned cases and investigations.`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Officer Portal', to: smsUrls.officer.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI Cards */}
      <div className="sms-dashboard-stats">
        <StatCard
          title="My Assigned Cases"
          value={myIncidents.length}
          icon="assignment"
          colorScheme="blue"
          subtitle="Total assigned"
        />
        <StatCard
          title="Pending Investigation"
          value={pendingInvestigation.length}
          icon="pending_actions"
          colorScheme="amber"
          subtitle="Needs action"
        />
        <StatCard
          title="Resolved Cases"
          value={resolvedCases.length}
          icon="check_circle"
          colorScheme="green"
          subtitle="Completed"
        />
        <StatCard
          title="High Priority Cases"
          value={0}
          icon="priority_high"
          colorScheme="red"
          subtitle="Urgent attention"
        />
      </div>

      <div className="sms-charts-row">
        {/* My Cases Summary */}
        <FormCard title="Case Status Summary">
          {[
            {
              label: 'Open',
              count: myIncidents.filter(i => i.status === 'Open').length,
              color: '#ef4444',
            },
            {
              label: 'Assigned',
              count: myIncidents.filter(i => i.status === 'Assigned').length,
              color: '#f59e0b',
            },
            {
              label: 'Under Investigation',
              count: myIncidents.filter(i => i.status === 'Under Investigation')
                .length,
              color: '#8b5cf6',
            },
            {
              label: 'Action Taken',
              count: myIncidents.filter(i => i.status === 'Action Taken')
                .length,
              color: '#f97316',
            },
            {
              label: 'Resolved',
              count: myIncidents.filter(i => i.status === 'Resolved').length,
              color: '#22c55e',
            },
            {
              label: 'Closed',
              count: myIncidents.filter(i => i.status === 'Closed').length,
              color: '#6b7280',
            },
          ].map(s => (
            <div key={s.label} className="sms-bar-row">
              <span className="sms-bar-label">{s.label}</span>
              <div className="sms-bar-track">
                <div
                  className="sms-bar-fill"
                  style={{
                    width:
                      myIncidents.length > 0
                        ? `${(s.count / myIncidents.length) * 100}%`
                        : '0%',
                    background: s.color,
                  }}
                />
              </div>
              <span className="sms-bar-value">{s.count}</span>
            </div>
          ))}
        </FormCard>

        {/* Urgent Cases */}
        <FormCard title="High Priority Cases">
          {highPriority.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <i
                className="pi pi-check-circle"
                style={{
                  fontSize: '2rem',
                  color: '#16a34a',
                  marginBottom: '0.75rem',
                  display: 'block',
                }}
              />
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                No high priority cases. Great work!
              </p>
            </div>
          ) : (
            highPriority.map(inc => (
              <div
                key={inc.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.625rem',
                  border: '1px solid #fee2e2',
                  borderRadius: 8,
                  marginBottom: '0.5rem',
                  background: '#fff5f5',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    {inc.incidentId}
                  </p>
                  <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                    {inc.category} · {inc.location}
                  </p>
                </div>
                <span
                  className={`sms-priority-chip priority-${inc.priority.toLowerCase()}`}
                >
                  {inc.priority}
                </span>
              </div>
            ))
          )}
          <button
            type="button"
            className="sms-view-all-btn"
            onClick={() => navigate(smsUrls.officer.assignedIncidents)}
          >
            View All Cases →
          </button>
        </FormCard>

        {/* Recent Activity */}
        <FormCard title="Recent Activity">
          {myIncidents.slice(0, 4).map(inc => (
            <div
              key={inc.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.5rem 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i
                  className="pi pi-shield"
                  style={{ color: '#2563eb', fontSize: '0.75rem' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: '0.813rem',
                    fontWeight: 500,
                    color: '#111827',
                  }}
                >
                  {inc.incidentId}
                </p>
                <p style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                  {inc.category} · {inc.reportedDate}
                </p>
                <span
                  className={`sms-status-pill status-${inc.status.toLowerCase().replace(/ /g, '-')}`}
                  style={{ marginTop: '0.25rem', display: 'inline-block' }}
                >
                  {inc.status}
                </span>
              </div>
            </div>
          ))}
        </FormCard>
      </div>
    </FormPage>
  );
}
