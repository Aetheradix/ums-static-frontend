import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { civilWorks, raBills, tenders, milestones } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const totalWorks       = civilWorks.length;
const inProgress       = civilWorks.filter(w => w.status === 'In Progress').length;
const completed        = civilWorks.filter(w => w.status === 'Completed' || w.status === 'DLP Active' || w.status === 'Closed').length;
const pendingAA        = civilWorks.filter(w => w.status === 'Registered' || w.status === 'Requirement Generated').length;
const pendingTS        = civilWorks.filter(w => w.status === 'AA Approved').length;
const pendingBudget    = civilWorks.filter(w => w.status === 'TS Granted').length;
const activeTenders    = tenders.filter(t => t.status === 'Published' || t.status === 'Bids Received' || t.status === 'Under Evaluation').length;

const totalAAAmount    = civilWorks.reduce((s, w) => s + w.aaAmount, 0);
const totalContractAmt = civilWorks.reduce((s, w) => s + w.contractAmount, 0);
const pendingRaBills   = raBills.filter(b => b.status !== 'Paid' && b.status !== 'Rejected').length;
const delayedMilestones = milestones.filter(m => m.status === 'Delayed').length;

const STATUS_DIST = [
  { name: 'In Progress',  value: inProgress,  color: '#3b82f6' },
  { name: 'Completed',    value: completed,   color: '#22c55e' },
  { name: 'AA Pending',   value: pendingAA,   color: '#f59e0b' },
  { name: 'Budget Lock',  value: pendingBudget, color: '#8b5cf6' },
  { name: 'Tender Stage', value: tenders.filter(t => ['Published','Awarded'].includes(t.status)).length, color: '#06b6d4' },
];

const BUDGET_TREND = [
  { month: 'Feb', Sanctioned: 18.5, Utilized: 2.1 },
  { month: 'Mar', Sanctioned: 18.5, Utilized: 4.8 },
  { month: 'Apr', Sanctioned: 22.0, Utilized: 8.2 },
  { month: 'May', Sanctioned: 22.0, Utilized: 12.4 },
  { month: 'Jun', Sanctioned: 27.8, Utilized: 16.7 },
  { month: 'Jul', Sanctioned: 27.8, Utilized: 19.3 },
];

const QUICK_ACTIONS = [
  { label: 'Register Work',         icon: 'plus-circle',   path: civilUrls.workRegistration },
  { label: 'AA Approval',           icon: 'check-circle',  path: civilUrls.adminApproval },
  { label: 'Technical Sanction',    icon: 'verified',      path: civilUrls.technicalSanction },
  { label: 'Tender Oversight',      icon: 'search',        path: civilUrls.tenderOversight },
  { label: 'Issue Work Order',      icon: 'file-text',     path: civilUrls.workOrderSign },
  { label: 'Completion Certificate', icon: 'star',         path: civilUrls.completionCertificate },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Civil Infrastructure — Admin Dashboard"
      description="Command centre for all civil works: AA/TS approvals, budget locks, tender oversight, and completion."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Admin Dashboard' },
      ]}
    >
      {/* Action Center */}
      <div className="civil-action-center">
        <div className="civil-action-header">
          <i className="pi pi-exclamation-triangle" />
          <span>Action Center — Pending Approvals</span>
        </div>
        <div className="civil-action-grid">
          {[
            { label: 'AA Pending',       value: pendingAA,        icon: 'file-edit',      cls: 'amber', path: civilUrls.adminApproval },
            { label: 'TS Pending',       value: pendingTS,        icon: 'verified',       cls: 'blue',  path: civilUrls.technicalSanction },
            { label: 'Budget To Lock',   value: pendingBudget,    icon: 'wallet',         cls: 'purple',path: civilUrls.budgetLock },
            { label: 'RA Bills Pending', value: pendingRaBills,   icon: 'receipt',        cls: 'red',   path: civilUrls.adminReports },
            { label: 'Active Tenders',   value: activeTenders,    icon: 'send',           cls: 'blue',  path: civilUrls.tenderOversight },
            { label: 'Delayed Milestones', value: delayedMilestones, icon: 'calendar-times', cls: 'red', path: civilUrls.engineerPortal },
          ].map(a => (
            <div key={a.label} className="civil-action-card" onClick={() => navigate(a.path)}>
              <div className={`civil-action-icon ${a.cls}`}>
                <i className={`pi pi-${a.icon}`} />
              </div>
              <div>
                <div className="civil-action-value">{a.value}</div>
                <div className="civil-action-label">{a.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="civil-stats-grid">
        <StatCard
          title="Total Civil Works"
          value={String(totalWorks)}
          icon="construction"
          colorScheme="blue"
          subtitle="All campuses"
        />
        <StatCard
          title="Works In Progress"
          value={String(inProgress)}
          icon="engineering"
          colorScheme="orange"
          trend={{ value: 2, direction: 'up', label: 'this quarter' }}
        />
        <StatCard
          title="AA Sanctioned Value"
          value={`₹${(totalAAAmount / 10000000).toFixed(1)} Cr`}
          icon="account_balance"
          colorScheme="teal"
          subtitle="Administrative Approvals"
        />
        <StatCard
          title="Contract Value"
          value={`₹${(totalContractAmt / 10000000).toFixed(1)} Cr`}
          icon="handshake"
          colorScheme="green"
          subtitle="Awarded contracts"
        />
      </div>

      {/* Charts Row */}
      <div className="civil-charts-row">
        {/* Budget Trend */}
        <FormCard title="Budget Trend (₹ Crore)" subtitle="Sanctioned vs. Utilized — last 6 months">
          <div style={{ height: 290, width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={BUDGET_TREND} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colSanctioned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colUtilized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Sanctioned" stroke="#8b5cf6" fillOpacity={1} fill="url(#colSanctioned)" strokeWidth={3} />
                <Area type="monotone" dataKey="Utilized"   stroke="#22c55e" fillOpacity={1} fill="url(#colUtilized)"   strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </FormCard>

        {/* Status Distribution */}
        <FormCard title="Works by Status" subtitle="Current pipeline">
          <div style={{ height: 290, width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={STATUS_DIST} cx="50%" cy="45%" innerRadius={65} outerRadius={95} paddingAngle={5} dataKey="value" stroke="none">
                  {STATUS_DIST.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </FormCard>
      </div>

      {/* Bottom Row */}
      <div className="civil-bottom-row">
        {/* Recent Civil Works */}
        <FormCard title="Civil Works Register" subtitle="Latest registered works with lifecycle status">
          <table className="civil-table">
            <thead>
              <tr>
                <th>Work ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>AA Amount</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {civilWorks.slice(0, 6).map(w => {
                const pct = w.physicalProgress;
                const fillCls = pct >= 75 ? 'high' : pct >= 40 ? 'medium' : 'low';
                const statusCls =
                  w.status === 'Completed' || w.status === 'DLP Active' ? 'green' :
                  w.status === 'In Progress' ? 'blue' :
                  w.status === 'AA Approved' || w.status === 'TS Granted' ? 'purple' :
                  w.status === 'Budget Locked' ? 'teal' :
                  w.status === 'Tender Issued' || w.status === 'Tender Awarded' ? 'amber' : 'gray';
                return (
                  <tr key={w.id}>
                    <td><span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.75rem' }}>{w.workId}</span></td>
                    <td style={{ maxWidth: 200 }}>{w.name}</td>
                    <td><span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{w.category}</span></td>
                    <td>₹{(w.aaAmount / 100000).toFixed(1)}L</td>
                    <td>
                      <div className="civil-progress-bar-wrap">
                        <div className="civil-progress-bar-track">
                          <div className={`civil-progress-bar-fill ${fillCls}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#6b7280', width: 28 }}>{pct}%</span>
                      </div>
                    </td>
                    <td><span className={`civil-pill ${statusCls}`}>{w.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </FormCard>

        {/* Quick Actions + Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <FormCard title="Quick Actions">
            <div className="civil-quick-actions">
              {QUICK_ACTIONS.map(a => (
                <button key={a.label} type="button" className="civil-quick-btn" onClick={() => navigate(a.path)}>
                  <i className={`pi pi-${a.icon}`} />
                  {a.label}
                </button>
              ))}
            </div>
          </FormCard>

          <FormCard title="Financial Summary">
            {[
              { label: 'Total AA Sanctioned',   value: `₹${(totalAAAmount / 10000000).toFixed(2)} Cr`,    color: '#374151' },
              { label: 'Total Contract Value',   value: `₹${(totalContractAmt / 10000000).toFixed(2)} Cr`, color: '#2563eb' },
              { label: 'RA Bills Paid (FY)',     value: `₹${(raBills.filter(b => b.status === 'Paid').reduce((s, b) => s + b.netPayable, 0) / 100000).toFixed(1)}L`, color: '#16a34a' },
              { label: 'RA Bills Pending',       value: String(pendingRaBills),                             color: '#d97706' },
              { label: 'Completed Works',        value: String(completed),                                  color: '#6b7280' },
              { label: 'Savings vs AA',          value: `₹${((totalAAAmount - totalContractAmt) / 100000).toFixed(1)}L`, color: '#16a34a' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{s.label}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
