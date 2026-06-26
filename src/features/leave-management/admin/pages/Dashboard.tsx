import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import {
  departmentWiseLeave,
  leaveApplications,
  leaveTypeDistribution,
  monthlyLeaveTrend,
} from '../../mocks';
import { lmsUrls } from '../../urls';
import './Dashboard.css';

const pending = leaveApplications.filter(a => a.status === 'Pending');
const approved = leaveApplications.filter(a => a.status === 'Approved');
const rejected = leaveApplications.filter(a => a.status === 'Rejected');
const maxDept = Math.max(...departmentWiseLeave.map(d => d.count));
const maxMonthly = Math.max(
  ...monthlyLeaveTrend.map(m => Math.max(m.employee, m.student))
);

const QUICK_ACTIONS = [
  { label: 'Approve Leave', icon: 'check-circle', path: '' },
  { label: 'Create Leave Type', icon: 'plus-circle', path: '' },
  { label: 'Attendance Sync', icon: 'refresh', path: '' },
  { label: 'Generate Reports', icon: 'file-export', path: '' },
  { label: 'Process LTC', icon: 'send', path: '' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Leave Management Dashboard"
      description="Overview of leave requests, attendance, and workforce analytics."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Admin Portal', to: lmsUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI Row 1 */}
      <div className="lms-dashboard-stats">
        <StatCard
          title="Total Employees"
          value="342"
          icon="groups"
          colorScheme="blue"
          subtitle="15 departments"
        />
        <StatCard
          title="Total Students"
          value="1,248"
          icon="school"
          colorScheme="purple"
          subtitle="20 courses"
        />
        <StatCard
          title="Today's Leave Requests"
          value={pending.length + 4}
          icon="assignment"
          colorScheme="orange"
          trend={{ value: 12, direction: 'up', label: 'vs yesterday' }}
        />
        <StatCard
          title="Pending Approvals"
          value={pending.length}
          icon="pending_actions"
          colorScheme="red"
          subtitle="Awaiting action"
        />
      </div>

      {/* KPI Row 2 */}
      <div className="lms-dashboard-stats-2">
        <StatCard
          title="Approved Leaves"
          value={approved.length + 48}
          icon="check_circle"
          colorScheme="green"
          subtitle="This month"
        />
        <StatCard
          title="Rejected Leaves"
          value={rejected.length + 12}
          icon="cancel"
          colorScheme="red"
          subtitle="This month"
        />
        <StatCard
          title="Biometric Missing"
          value="8"
          icon="fingerprint"
          colorScheme="amber"
          subtitle="Today"
        />
        <StatCard
          title="LTC Requests"
          value="6"
          icon="travel_explore"
          colorScheme="teal"
          subtitle="Pending"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="lms-charts-row">
        {/* Monthly Trend */}
        <FormCard
          title="Monthly Leave Trend"
          subtitle="Employee vs Student leaves"
        >
          <div className="lms-trend-chart">
            {monthlyLeaveTrend.map(m => (
              <div key={m.month} className="lms-trend-col">
                <div className="lms-trend-bars">
                  <div
                    className="lms-trend-bar"
                    style={{
                      height: `${(m.employee / maxMonthly) * 100}px`,
                      background: '#3b82f6',
                    }}
                  />
                  <div
                    className="lms-trend-bar"
                    style={{
                      height: `${(m.student / maxMonthly) * 100}px`,
                      background: '#8b5cf6',
                    }}
                  />
                </div>
                <span className="lms-trend-month">{m.month}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                color: '#6b7280',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: '#3b82f6',
                  display: 'inline-block',
                }}
              />
              Employee
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                color: '#6b7280',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: '#8b5cf6',
                  display: 'inline-block',
                }}
              />
              Student
            </span>
          </div>
        </FormCard>

        {/* Department Wise */}
        <FormCard title="Department Wise Leave">
          {departmentWiseLeave.map(d => (
            <div key={d.dept} className="lms-bar-row">
              <span className="lms-bar-label">{d.dept}</span>
              <div className="lms-bar-track">
                <div
                  className="lms-bar-fill"
                  style={{
                    width: `${(d.count / maxDept) * 100}%`,
                    background: d.color,
                  }}
                />
              </div>
              <span className="lms-bar-value">{d.count}</span>
            </div>
          ))}
        </FormCard>
      </div>

      {/* Charts Row 2 */}
      <div className="lms-charts-row">
        {/* Leave Type Distribution */}
        <FormCard title="Leave Type Distribution">
          <div className="lms-dist-list">
            {leaveTypeDistribution.map(l => (
              <div key={l.type} className="lms-dist-row">
                <span
                  className="lms-dist-dot"
                  style={{ background: l.color }}
                />
                <span className="lms-dist-label">{l.type}</span>
                <div className="lms-dist-track">
                  <div
                    className="lms-dist-fill"
                    style={{ width: `${l.pct}%`, background: l.color }}
                  />
                </div>
                <span className="lms-dist-count">{l.count}</span>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Quick Actions */}
        <FormCard title="Quick Actions">
          <div className="lms-quick-actions">
            {QUICK_ACTIONS.map(a => (
              <button
                key={a.label}
                type="button"
                className="lms-quick-action-btn"
                onClick={() =>
                  a.path
                    ? navigate(a.path)
                    : navigate(lmsUrls.admin.leaveRequests)
                }
              >
                <i className={`pi pi-${a.icon}`} />
                {a.label}
              </button>
            ))}
            <button
              type="button"
              className="lms-quick-action-btn"
              onClick={() => navigate(lmsUrls.admin.attendance)}
            >
              <i className="pi pi-calendar" />
              Attendance
            </button>
            <button
              type="button"
              className="lms-quick-action-btn"
              onClick={() => navigate(lmsUrls.admin.biometric)}
            >
              <i className="pi pi-id-card" />
              Biometric
            </button>
          </div>
        </FormCard>
      </div>

      {/* Recent Requests */}
      <div className="lms-bottom-row">
        <FormCard title="Recent Leave Requests">
          <table className="lms-table">
            <thead>
              <tr>
                <th>App No.</th>
                <th>Applicant</th>
                <th>Role</th>
                <th>Leave Type</th>
                <th>Days</th>
                <th>Approver</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveApplications.slice(0, 10).map(a => (
                <tr key={a.id}>
                  <td>{a.appNo}</td>
                  <td>{a.applicant}</td>
                  <td>{a.role}</td>
                  <td>{a.leaveType}</td>
                  <td>{a.days}</td>
                  <td>{a.currentApprover}</td>
                  <td>
                    <span
                      className={`lms-status-pill ${a.status.toLowerCase()}`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormCard>

        {/* Attendance Summary */}
        <FormCard title="Today's Summary">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {[
              { label: 'Present', value: 28, color: '#16a34a', pct: 75 },
              { label: 'Absent', value: 4, color: '#ef4444', pct: 11 },
              { label: 'On Leave', value: 5, color: '#f59e0b', pct: 13 },
              { label: 'Late Entry', value: 2, color: '#8b5cf6', pct: 5 },
            ].map(s => (
              <div key={s.label}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                    {s.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.813rem',
                      fontWeight: 700,
                      color: s.color,
                    }}
                  >
                    {s.value}
                  </span>
                </div>
                <div className="lms-bar-track">
                  <div
                    className="lms-bar-fill"
                    style={{ width: `${s.pct}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
