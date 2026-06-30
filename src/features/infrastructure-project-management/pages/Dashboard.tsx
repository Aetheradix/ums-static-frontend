import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  projects,
  budgetAllocations,
  bills,
  payments,
  proposals,
} from '../mocks';
import { infraUrls } from '../urls';
import './Dashboard.css';

const total = projects.length;
const ongoing = projects.filter(p => p.status === 'Ongoing').length;
const completed = projects.filter(p => p.status === 'Completed').length;

const totalAllocated = budgetAllocations.reduce(
  (s, b) => s + b.allocatedAmount,
  0
);
const totalUsed = budgetAllocations.reduce((s, b) => s + b.usedAmount, 0);

const totalBilled = bills.reduce((s, b) => s + b.amount + b.gst, 0);
const totalPaid = payments
  .filter(p => p.status === 'Processed')
  .reduce((s, p) => s + p.amount, 0);

// Action Center Metrics
const delayedProjectsCount = projects.filter(
  p => p.status === 'Delayed'
).length;
const pendingProposalsCount = proposals.filter(
  p => p.status === 'Submitted' || p.status === 'Under Review'
).length;
const pendingBillsCount = bills.filter(
  b => b.status === 'Submitted' || b.status === 'Verified'
).length;
const exhaustedBudgetsCount = budgetAllocations.filter(
  b => b.status === 'Exhausted'
).length;

const STATUS_DIST = [
  { name: 'Ongoing', value: ongoing, color: '#3b82f6' },
  {
    name: 'Planning',
    value: projects.filter(p => p.status === 'Planning').length,
    color: '#8b5cf6',
  },
  { name: 'Completed', value: completed, color: '#22c55e' },
  { name: 'Delayed', value: delayedProjectsCount, color: '#ef4444' },
  {
    name: 'On Hold',
    value: projects.filter(p => p.status === 'On Hold').length,
    color: '#f59e0b',
  },
];

const MONTHLY_PROGRESS = [
  { month: 'Jan', Planned: 60, Actual: 55 },
  { month: 'Feb', Planned: 65, Actual: 62 },
  { month: 'Mar', Planned: 70, Actual: 68 },
  { month: 'Apr', Planned: 72, Actual: 70 },
  { month: 'May', Planned: 75, Actual: 71 },
  { month: 'Jun', Planned: 78, Actual: 73 },
];

const DEPT_BUDGET = [
  { name: 'Civil Engg', amount: 13.5, color: '#3b82f6' },
  { name: 'Electrical', amount: 3.2, color: '#8b5cf6' },
  { name: 'Library', amount: 7.8, color: '#22c55e' },
  { name: 'Sports', amount: 15.0, color: '#f59e0b' },
  { name: 'Hostel', amount: 9.5, color: '#ef4444' },
];

const QUICK_ACTIONS = [
  { label: 'New Project', icon: 'plus-circle', path: infraUrls.projectMaster },
  {
    label: 'Approve Bill',
    icon: 'check-circle',
    path: infraUrls.billManagement,
  },
  {
    label: 'Add Progress',
    icon: 'chart-line',
    path: infraUrls.progressMonitoring,
  },
  { label: 'Issue Work Order', icon: 'file-text', path: infraUrls.workOrders },
  { label: 'Run Inspection', icon: 'search', path: infraUrls.inspections },
  { label: 'Generate Report', icon: 'file-export', path: infraUrls.reports },
];

export default function InfraDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Infrastructure Dashboard"
      description="Overview of all infrastructure projects, budgets and execution progress."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* ── Action Center ───────────────────────────────────────── */}
      <div className="infra-action-center">
        <div className="infra-action-header">
          <i className="pi pi-exclamation-triangle" />
          <span>Action Center</span>
        </div>
        <div className="infra-action-grid">
          <div
            className="infra-action-card"
            onClick={() => navigate(infraUrls.projectMaster)}
          >
            <div className="infra-action-icon danger">
              <i className="pi pi-calendar-times" />
            </div>
            <div className="infra-action-content">
              <span className="infra-action-value">{delayedProjectsCount}</span>
              <span className="infra-action-label">Delayed Projects</span>
            </div>
          </div>
          <div
            className="infra-action-card"
            onClick={() => navigate(infraUrls.projectProposal)}
          >
            <div className="infra-action-icon warning">
              <i className="pi pi-file-edit" />
            </div>
            <div className="infra-action-content">
              <span className="infra-action-value">
                {pendingProposalsCount}
              </span>
              <span className="infra-action-label">Pending Proposals</span>
            </div>
          </div>
          <div
            className="infra-action-card"
            onClick={() => navigate(infraUrls.billManagement)}
          >
            <div className="infra-action-icon info">
              <i className="pi pi-receipt" />
            </div>
            <div className="infra-action-content">
              <span className="infra-action-value">{pendingBillsCount}</span>
              <span className="infra-action-label">Pending Bills</span>
            </div>
          </div>
          <div
            className="infra-action-card"
            onClick={() => navigate(infraUrls.budgetAllocation)}
          >
            <div className="infra-action-icon primary">
              <i className="pi pi-wallet" />
            </div>
            <div className="infra-action-content">
              <span className="infra-action-value">
                {exhaustedBudgetsCount}
              </span>
              <span className="infra-action-label">Exhausted Budgets</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="infra-dashboard-stats">
        <StatCard
          title="Total Projects"
          value={String(total)}
          icon="construction"
          colorScheme="blue"
          subtitle="All campuses"
        />
        <StatCard
          title="Ongoing Projects"
          value={String(ongoing)}
          icon="update"
          colorScheme="orange"
          trend={{ value: 5, direction: 'up', label: 'vs last quarter' }}
        />
        <StatCard
          title="Budget Utilized"
          value={`₹${(totalUsed / 1000000).toFixed(1)}M`}
          icon="account_balance_wallet"
          colorScheme="teal"
          subtitle={`${Math.round((totalUsed / totalAllocated) * 100)}% utilization`}
        />
      </div>

      {/* Charts Row */}
      <div className="infra-charts-row">
        {/* Monthly Progress Trend */}
        <FormCard
          title="Monthly Progress Trend"
          subtitle="Planned vs Actual completion %"
        >
          <div style={{ height: 300, width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={MONTHLY_PROGRESS}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
                <Area
                  type="monotone"
                  dataKey="Planned"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorPlanned)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="Actual"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorActual)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </FormCard>

        {/* Project Status Distribution */}
        <FormCard title="Project Status" subtitle="Overview of all projects">
          <div style={{ height: 300, width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STATUS_DIST}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {STATUS_DIST.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  itemStyle={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </FormCard>
      </div>

      {/* Bottom Row */}
      <div className="infra-bottom-row">
        {/* Recent Projects */}
        <FormCard title="Recent Projects">
          <table className="infra-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Project Name</th>
                <th>Department</th>
                <th>Est. Cost</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 5).map(p => {
                const prog = [65, 0, 100, 30, 0, 0];
                const idx = parseInt(p.id) - 1;
                const statusClass = p.status.toLowerCase().replace(' ', '-');
                return (
                  <tr key={p.id}>
                    <td>{p.code}</td>
                    <td>{p.name}</td>
                    <td>{p.department}</td>
                    <td>₹{(p.estimatedCost / 100000).toFixed(1)}L</td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: 6,
                            background: '#f3f4f6',
                            borderRadius: 99,
                          }}
                        >
                          <div
                            style={{
                              width: `${prog[idx]}%`,
                              background: '#3b82f6',
                              height: '100%',
                              borderRadius: 99,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: '#6b7280',
                            width: 28,
                          }}
                        >
                          {prog[idx]}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`infra-status-pill ${statusClass}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </FormCard>

        {/* Right column */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Quick Actions */}
          <FormCard title="Quick Actions">
            <div className="infra-quick-actions">
              {QUICK_ACTIONS.map(a => (
                <button
                  key={a.label}
                  type="button"
                  className="infra-quick-action-btn"
                  onClick={() => navigate(a.path)}
                >
                  <i className={`pi pi-${a.icon}`} />
                  {a.label}
                </button>
              ))}
            </div>
          </FormCard>

          {/* Dept budget */}
          <FormCard title="Budget by Department (₹ Millions)">
            <div style={{ height: 250, width: '100%', marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DEPT_BUDGET}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={16}>
                    {DEPT_BUDGET.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </FormCard>

          {/* Finance Summary */}
          <FormCard title="Financial Summary">
            {[
              {
                label: 'Total Billed',
                value: `₹${(totalBilled / 100000).toFixed(1)}L`,
                color: '#6b7280',
              },
              {
                label: 'Total Paid',
                value: `₹${(totalPaid / 100000).toFixed(1)}L`,
                color: '#16a34a',
              },
              {
                label: 'Outstanding',
                value: `₹${((totalBilled - totalPaid) / 100000).toFixed(1)}L`,
                color: '#dc2626',
              },
              {
                label: 'Pending Bills',
                value: String(
                  bills.filter(b => b.status === 'Submitted').length
                ),
                color: '#d97706',
              },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.375rem 0',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                  {s.label}
                </span>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: s.color,
                  }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
