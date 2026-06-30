import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import {
  awarenessPrograms,
  guidelines,
  incidents,
  incidentStats,
} from '../../mocks';
import { smsUrls } from '../../urls';
import './Dashboard.css';

const categoryChart = [
  { label: 'Harassment', count: 2, color: '#ef4444' },
  { label: 'Theft', count: 1, color: '#f59e0b' },
  { label: 'Cyber', count: 1, color: '#8b5cf6' },
  { label: 'Fire & Safety', count: 1, color: '#f97316' },
  { label: 'Physical', count: 1, color: '#3b82f6' },
];
const maxCat = Math.max(...categoryChart.map(c => c.count));

const monthlyTrend = [
  { month: 'Jan', count: 4 },
  { month: 'Feb', count: 7 },
  { month: 'Mar', count: 3 },
  { month: 'Apr', count: 9 },
  { month: 'May', count: 5 },
  { month: 'Jun', count: 6 },
];
const maxTrend = Math.max(...monthlyTrend.map(m => m.count));

const STATUS_COLOR: Record<string, string> = {
  Open: '#ef4444',
  Assigned: '#f59e0b',
  'Under Investigation': '#8b5cf6',
  'Action Taken': '#f97316',
  Resolved: '#22c55e',
  Closed: '#6b7280',
};

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Security Management Dashboard"
      description="Comprehensive overview of all security incidents, programs and campus safety metrics."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI Row 1 */}
      <div className="sms-dashboard-stats">
        <StatCard
          title="Total Incidents"
          value={incidentStats.total}
          icon="report_problem"
          colorScheme="blue"
          subtitle="All time"
        />
        <StatCard
          title="Open Incidents"
          value={incidentStats.open}
          icon="error"
          colorScheme="red"
          trend={{ value: 20, direction: 'up', label: 'vs last week' }}
        />
        <StatCard
          title="Closed Incidents"
          value={incidentStats.closed}
          icon="check_circle"
          colorScheme="green"
          subtitle="Successfully resolved"
        />
        <StatCard
          title="Pending Investigation"
          value={incidentStats.underInvestigation + incidentStats.assigned}
          icon="pending_actions"
          colorScheme="amber"
          subtitle="Needs attention"
        />
      </div>

      {/* KPI Row 2 */}
      <div className="sms-dashboard-stats">
        <StatCard
          title="High Priority"
          value={incidentStats.highPriority}
          icon="priority_high"
          colorScheme="orange"
          subtitle="High + Critical"
        />
        <StatCard
          title="Today's Incidents"
          value={incidentStats.todayIncidents}
          icon="today"
          colorScheme="purple"
          trend={{ value: 5, direction: 'up', label: 'vs yesterday' }}
        />
        <StatCard
          title="Emergency Helplines"
          value="8"
          icon="phone_in_talk"
          colorScheme="teal"
          subtitle="Active helplines"
        />
        <StatCard
          title="Upcoming Programs"
          value={awarenessPrograms.filter(p => p.status === 'Upcoming').length}
          icon="campaign"
          colorScheme="indigo"
          subtitle="Awareness programs"
        />
      </div>

      {/* Charts Row */}
      <div className="sms-charts-row">
        {/* Monthly Trend */}
        <FormCard
          title="Monthly Incident Trend"
          subtitle="Incidents reported per month"
        >
          <div className="sms-trend-chart">
            {monthlyTrend.map(m => (
              <div key={m.month} className="sms-trend-col">
                <span className="sms-trend-val">{m.count}</span>
                <div className="sms-trend-bars">
                  <div
                    className="sms-trend-bar"
                    style={{
                      height: `${(m.count / maxTrend) * 100}px`,
                      background: '#3b82f6',
                    }}
                  />
                </div>
                <span className="sms-trend-month">{m.month}</span>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Category Breakdown */}
        <FormCard title="Incidents by Category">
          {categoryChart.map(c => (
            <div key={c.label} className="sms-bar-row">
              <span className="sms-bar-label">{c.label}</span>
              <div className="sms-bar-track">
                <div
                  className="sms-bar-fill"
                  style={{
                    width: `${(c.count / maxCat) * 100}%`,
                    background: c.color,
                  }}
                />
              </div>
              <span className="sms-bar-value">{c.count}</span>
            </div>
          ))}
        </FormCard>

        {/* Status Summary */}
        <FormCard title="Status Summary">
          {[
            { label: 'Open', count: incidentStats.open },
            { label: 'Assigned', count: incidentStats.assigned },
            {
              label: 'Under Investigation',
              count: incidentStats.underInvestigation,
            },
            { label: 'Action Taken', count: incidentStats.actionTaken },
            { label: 'Resolved', count: incidentStats.resolved },
            { label: 'Closed', count: incidentStats.closed },
          ].map(s => (
            <div key={s.label} className="sms-bar-row">
              <span className="sms-bar-label">{s.label}</span>
              <div className="sms-bar-track">
                <div
                  className="sms-bar-fill"
                  style={{
                    width: `${s.count > 0 ? (s.count / incidentStats.total) * 100 : 0}%`,
                    background: STATUS_COLOR[s.label] ?? '#6b7280',
                  }}
                />
              </div>
              <span className="sms-bar-value">{s.count}</span>
            </div>
          ))}
        </FormCard>
      </div>

      {/* Bottom Row */}
      <div className="sms-bottom-row">
        {/* Recent Incidents */}
        <FormCard title="Recent Incidents">
          <table className="sms-table">
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Reported By</th>
                <th>Category</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incidents.slice(0, 5).map(inc => (
                <tr key={inc.id}>
                  <td>
                    <strong>{inc.incidentId}</strong>
                  </td>
                  <td>{inc.reportedBy}</td>
                  <td>{inc.category}</td>
                  <td>{inc.location}</td>
                  <td>
                    <span
                      className={`sms-priority-chip priority-${inc.priority.toLowerCase()}`}
                    >
                      {inc.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`sms-status-pill status-${inc.status.toLowerCase().replace(/ /g, '-')}`}
                    >
                      {inc.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="sms-link-btn"
                      type="button"
                      onClick={() => navigate(smsUrls.superAdmin.incidents)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormCard>

        {/* Side Cards */}
        <div className="sms-side-cards">
          {/* Recent Guidelines */}
          <FormCard title="Recent Guidelines">
            <div className="sms-list">
              {guidelines.slice(0, 4).map(g => (
                <div key={g.id} className="sms-list-item">
                  <div
                    className="sms-list-icon"
                    style={{ background: '#dbeafe' }}
                  >
                    <i className="pi pi-book" style={{ color: '#2563eb' }} />
                  </div>
                  <div className="sms-list-text">
                    <span className="sms-list-title">{g.title}</span>
                    <span className="sms-list-sub">
                      {g.category} · {g.effectiveDate}
                    </span>
                  </div>
                  <span
                    className={`sms-status-pill status-${g.status.toLowerCase()}`}
                  >
                    {g.status}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="sms-view-all-btn"
              onClick={() => navigate(smsUrls.superAdmin.guidelines)}
            >
              View All Guidelines →
            </button>
          </FormCard>

          {/* Upcoming Programs */}
          <FormCard title="Upcoming Awareness Programs">
            <div className="sms-list">
              {awarenessPrograms
                .filter(p => p.status === 'Upcoming')
                .map(p => (
                  <div key={p.id} className="sms-list-item">
                    <div
                      className="sms-list-icon"
                      style={{ background: '#ede9fe' }}
                    >
                      <i
                        className="pi pi-megaphone"
                        style={{ color: '#7c3aed' }}
                      />
                    </div>
                    <div className="sms-list-text">
                      <span className="sms-list-title">{p.programName}</span>
                      <span className="sms-list-sub">
                        {p.date} · {p.venue}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <button
              type="button"
              className="sms-view-all-btn"
              onClick={() => navigate(smsUrls.superAdmin.awareness)}
            >
              View All Programs →
            </button>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
