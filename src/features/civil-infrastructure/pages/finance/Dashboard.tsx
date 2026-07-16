import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import {
  raBills as initialBills,
  dlpRecords as initialDlp,
  civilWorks as initialWorks,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function FinanceDashboard() {
  const navigate = useNavigate();

  const [works] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });

  const [bills] = useState(() => {
    const saved = localStorage.getItem('civil_ra_bills');
    return saved ? JSON.parse(saved) : initialBills;
  });

  const [dlp] = useState(() => {
    const saved = localStorage.getItem('civil_dlp_records');
    return saved ? JSON.parse(saved) : initialDlp;
  });

  const totalAllocated = works.reduce(
    (s: number, w: any) => s + (w.tsAmount || 0),
    0
  );
  const totalUtilized = bills
    .filter((b: any) => b.status === 'Paid')
    .reduce((s: number, b: any) => s + b.netPayable, 0);
  const pendingBills = bills.filter(
    (b: any) => b.status !== 'Paid' && b.status !== 'Rejected'
  );
  const pendingValue = pendingBills.reduce(
    (s: number, b: any) => s + b.netPayable,
    0
  );
  const dlpActive = dlp.filter(
    (d: any) => d.status === 'Active' || d.status === 'Defects Reported'
  );
  const dlpRetention = dlp.reduce(
    (s: number, d: any) => s + d.retentionAmount,
    0
  );

  const PAYMENT_FLOW = works.slice(0, 5).map((w: any) => ({
    work: w.workId,
    Budget: (w.tsAmount || 0) / 100000,
    Paid:
      bills
        .filter((b: any) => b.workId === w.id && b.status === 'Paid')
        .reduce((s: number, b: any) => s + b.netPayable, 0) / 100000,
  }));

  const QUICK_ACTIONS = [
    {
      label: 'Budget Allocation',
      icon: 'wallet',
      path: civilUrls.budgetAllocation,
    },
    {
      label: 'Process RA Bills',
      icon: 'receipt',
      path: civilUrls.raBillProcessing,
    },
    {
      label: 'Final Bill Settlement',
      icon: 'check-circle',
      path: civilUrls.finalBillSettlement,
    },
    {
      label: 'Release Payments',
      icon: 'money-bill',
      path: civilUrls.paymentRelease,
    },
    { label: 'DLP Monitoring', icon: 'shield', path: civilUrls.dlpMonitoring },
  ];

  return (
    <FormPage
      title="Finance Department — Civil Dashboard"
      description="Budget allocation, RA Bill processing, payment release, and DLP retention monitoring."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.financePortal },
        { label: 'Finance Dashboard' },
      ]}
    >
      {/* KPI Stats */}
      <div className="civil-stats-grid">
        <StatCard
          title="Total Allocated Budget"
          value={`₹${(totalAllocated / 10000000).toFixed(2)} Cr`}
          icon="account_balance"
          colorScheme="blue"
          subtitle="TS-approved funds"
        />
        <StatCard
          title="Total Payments Released"
          value={`₹${(totalUtilized / 100000).toFixed(1)}L`}
          icon="payments"
          colorScheme="green"
        />
        <StatCard
          title="Budget Utilization"
          value={`${totalAllocated > 0 ? ((totalUtilized / totalAllocated) * 100).toFixed(1) : 0}%`}
          icon="pie_chart"
          colorScheme="teal"
        />
        <StatCard
          title="DLP Retention Held"
          value={`₹${(dlpRetention / 100000).toFixed(2)}L`}
          icon="lock"
          colorScheme="purple"
          subtitle="Pending release"
        />
      </div>

      {/* Action Center */}
      <div className="civil-action-center">
        <div className="civil-action-header">
          <i className="pi pi-exclamation-triangle" />
          <span>Finance Action Center</span>
        </div>
        <div className="civil-action-grid">
          {[
            {
              label: 'RA Bills to Process',
              value: pendingBills.length,
              icon: 'receipt',
              cls: 'red',
              path: civilUrls.raBillProcessing,
            },
            {
              label: 'Pending Value (₹)',
              value: `₹${(pendingValue / 100000).toFixed(1)}L`,
              icon: 'wallet',
              cls: 'amber',
              path: civilUrls.raBillProcessing,
            },
            {
              label: 'DLP Active',
              value: dlpActive.length,
              icon: 'shield',
              cls: 'purple',
              path: civilUrls.dlpMonitoring,
            },
            {
              label: 'Retention Held (₹)',
              value: `₹${(dlpRetention / 100000).toFixed(2)}L`,
              icon: 'lock',
              cls: 'blue',
              path: civilUrls.dlpMonitoring,
            },
          ].map(a => (
            <div
              key={a.label}
              className="civil-action-card"
              onClick={() => navigate(a.path)}
            >
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

      {/* Chart + Quick Actions */}
      <div className="civil-charts-row">
        <FormCard
          title="Budget vs. Paid per Work"
          subtitle="TS Budget (₹L) vs. RA Bills paid (₹L)"
        >
          <div style={{ height: 280, width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={PAYMENT_FLOW}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="work"
                  stroke="#9ca3af"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  unit="L"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="Budget" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Paid" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </FormCard>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <FormCard title="Quick Actions">
            <div className="civil-quick-actions">
              {QUICK_ACTIONS.map(a => (
                <button
                  key={a.label}
                  type="button"
                  className="civil-quick-btn"
                  onClick={() => navigate(a.path)}
                >
                  <i className={`pi pi-${a.icon}`} />
                  {a.label}
                </button>
              ))}
            </div>
          </FormCard>
        </div>
      </div>

      {/* Pending Bills Table */}
      <FormCard title="RA Bills Awaiting Finance Action">
        <table className="civil-table">
          <thead>
            <tr>
              <th>Bill No</th>
              <th>Work Name</th>
              <th>Work Type</th>
              <th>Category</th>
              <th>Work Basis</th>
              <th>Contractor</th>
              <th>Net Payable</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingBills.map((b: any) => {
              const wk = works.find(
                (w: any) =>
                  w.name === b.workName ||
                  w.id === b.workId ||
                  w.workId === b.workId
              );
              return (
                <tr key={b.id}>
                  <td>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      {b.billNo}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{b.workName}</td>
                  <td>
                    <span style={{ fontSize: '0.75rem' }}>
                      {wk?.category ?? '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem' }}>
                      {wk?.department ?? '—'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`civil-pill ${wk?.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {wk?.workBasis ?? 'SOR Based'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{b.contractorName}</td>
                  <td style={{ fontWeight: 700 }}>
                    ₹{(b.netPayable / 100000).toFixed(2)}L
                  </td>
                  <td>
                    <span className="civil-pill amber">{b.status}</span>
                  </td>
                </tr>
              );
            })}
            {pendingBills.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: 'center',
                    color: '#9ca3af',
                    padding: '2rem',
                  }}
                >
                  All bills processed ✓
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
