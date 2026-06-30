import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { incidents, incidentStats } from '../../mocks';
import { smsUrls } from '../../urls';
import '../../super-admin/pages/Dashboard.css';

const HIGH_PRIORITY = incidents.filter(i => i.priority === 'High' || i.priority === 'Critical');
const TODAY = incidents.filter(i => i.reportedDate === '2024-06-30');

export default function SecurityAdminDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Security Admin Dashboard"
      description="Monitor incident assignments, track investigations and manage security operations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Security Admin', to: smsUrls.securityAdmin.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI Cards */}
      <div className="sms-dashboard-stats">
        <StatCard title="Total Incidents" value={incidentStats.total} icon="report_problem" colorScheme="blue" subtitle="All incidents" />
        <StatCard title="Pending Assignment" value={incidentStats.open} icon="pending_actions" colorScheme="red" subtitle="Needs assignment" />
        <StatCard title="High Priority" value={HIGH_PRIORITY.length} icon="priority_high" colorScheme="orange" trend={{ value: 15, direction: 'up', label: 'vs last week' }} />
        <StatCard title="Today's Cases" value={TODAY.length} icon="today" colorScheme="purple" subtitle="Reported today" />
      </div>

      <div className="sms-charts-row">
        {/* Status Overview */}
        <FormCard title="Incident Status Overview">
          {[
            { label: 'Open', count: incidentStats.open, color: '#ef4444' },
            { label: 'Assigned', count: incidentStats.assigned, color: '#f59e0b' },
            { label: 'Under Investigation', count: incidentStats.underInvestigation, color: '#8b5cf6' },
            { label: 'Action Taken', count: incidentStats.actionTaken, color: '#f97316' },
            { label: 'Resolved', count: incidentStats.resolved, color: '#22c55e' },
            { label: 'Closed', count: incidentStats.closed, color: '#6b7280' },
          ].map(s => (
            <div key={s.label} className="sms-bar-row">
              <span className="sms-bar-label">{s.label}</span>
              <div className="sms-bar-track">
                <div className="sms-bar-fill" style={{ width: `${s.count > 0 ? (s.count / incidentStats.total) * 100 : 0}%`, background: s.color }} />
              </div>
              <span className="sms-bar-value">{s.count}</span>
            </div>
          ))}
        </FormCard>

        {/* Quick Actions */}
        <FormCard title="Quick Actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Assign Open Incidents', icon: 'user', path: smsUrls.securityAdmin.incidents, color: '#ef4444' },
              { label: 'View All Incidents', icon: 'list', path: smsUrls.securityAdmin.incidents, color: '#3b82f6' },
              { label: 'View Helplines', icon: 'phone', path: smsUrls.securityAdmin.helpline, color: '#16a34a' },
              { label: 'Safety Guidelines', icon: 'book', path: smsUrls.securityAdmin.guidelines, color: '#0891b2' },
              { label: 'Generate Reports', icon: 'chart-bar', path: smsUrls.securityAdmin.reports, color: '#7c3aed' },
            ].map(a => (
              <button
                key={a.label}
                type="button"
                onClick={() => navigate(a.path)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', border: '1px solid #f3f4f6', borderRadius: 8, background: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '0.813rem', fontWeight: 500, color: '#374151', transition: 'all 0.15s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
              >
                <span style={{ width: 32, height: 32, borderRadius: 8, background: a.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`pi pi-${a.icon}`} style={{ color: a.color, fontSize: '0.875rem' }} />
                </span>
                {a.label}
              </button>
            ))}
          </div>
        </FormCard>

        {/* High Priority Incidents */}
        <FormCard title="High Priority Incidents">
          {HIGH_PRIORITY.length === 0 ? (
            <p style={{ fontSize: '0.813rem', color: '#6b7280', textAlign: 'center', padding: '1rem' }}>No high priority incidents.</p>
          ) : HIGH_PRIORITY.map(inc => (
            <div key={inc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem', border: '1px solid #fee2e2', borderRadius: 8, marginBottom: '0.5rem', background: '#fff5f5' }}>
              <div>
                <p style={{ fontSize: '0.813rem', fontWeight: 600, color: '#111827' }}>{inc.incidentId}</p>
                <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>{inc.category} · {inc.location}</p>
              </div>
              <span className={`sms-priority-chip priority-${inc.priority.toLowerCase()}`}>{inc.priority}</span>
            </div>
          ))}
          <button type="button" className="sms-view-all-btn" onClick={() => navigate(smsUrls.securityAdmin.incidents)}>
            View All Incidents →
          </button>
        </FormCard>
      </div>

      {/* Recent Incidents Table */}
      <FormCard title="Recent Incidents">
        <table className="sms-table">
          <thead>
            <tr>
              <th>Incident ID</th>
              <th>Reported By</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.slice(0, 6).map(inc => (
              <tr key={inc.id}>
                <td><strong>{inc.incidentId}</strong></td>
                <td>{inc.reportedBy}</td>
                <td>{inc.category}</td>
                <td><span className={`sms-priority-chip priority-${inc.priority.toLowerCase()}`}>{inc.priority}</span></td>
                <td>{inc.assignedTo || <em style={{ color: '#9ca3af' }}>Not Assigned</em>}</td>
                <td><span className={`sms-status-pill status-${inc.status.toLowerCase().replace(/ /g, '-')}`}>{inc.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
