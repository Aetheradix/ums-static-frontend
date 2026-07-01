import { useNavigate } from 'react-router-dom';
import {
  FormCard,
  FormPage,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BT_VENDOR_BILLS, BT_EMPLOYEE_CLAIMS } from '../../mock-data';
import { billTrackingUrls } from '../../urls';

// ─── Derived Metrics ────────────────────────────────────────────────────────
const allBills = [...BT_VENDOR_BILLS, ...BT_EMPLOYEE_CLAIMS];

const totalBilled =
  BT_VENDOR_BILLS.reduce((s, b) => s + b.netPayable, 0) +
  BT_EMPLOYEE_CLAIMS.reduce((s, c) => s + c.claimAmount, 0);

const totalPaid = BT_VENDOR_BILLS.filter(b => b.status === 'Paid').reduce(
  (s, b) => s + b.netPayable,
  0
);
const outstanding = totalBilled - totalPaid;

const pendingVerification = allBills.filter(
  b => b.status === 'Submitted'
).length;
const pendingApproval = allBills.filter(b => b.status === 'Verified').length;
const unpaidApproved = allBills.filter(b => b.status === 'Approved').length;

const today = new Date();
const overdueBills = BT_VENDOR_BILLS.filter(b => {
  if (['Paid', 'Cancelled'].includes(b.status)) return false;
  return new Date(b.dueDate) < today;
}).length;

// ─── Status Distribution ────────────────────────────────────────────────────
const STATUS_DIST = [
  {
    name: 'Draft',
    value: allBills.filter(b => b.status === 'Draft').length,
    color: '#9ca3af',
  },
  {
    name: 'Submitted',
    value: allBills.filter(b => b.status === 'Submitted').length,
    color: '#f59e0b',
  },
  {
    name: 'Verified',
    value: allBills.filter(b => b.status === 'Verified').length,
    color: '#3b82f6',
  },
  {
    name: 'Approved',
    value: allBills.filter(b => b.status === 'Approved').length,
    color: '#8b5cf6',
  },
  {
    name: 'Paid',
    value: allBills.filter(b => b.status === 'Paid').length,
    color: '#22c55e',
  },
];

// ─── Monthly Billing Trend ──────────────────────────────────────────────────
const MONTHLY_TREND = [
  { month: 'Jan', Vendor: 280000, Employee: 45000 },
  { month: 'Feb', Vendor: 350000, Employee: 62000 },
  { month: 'Mar', Vendor: 420000, Employee: 38000 },
  { month: 'Apr', Vendor: 580000, Employee: 91000 },
  { month: 'May', Vendor: 490000, Employee: 74000 },
  { month: 'Jun', Vendor: 640000, Employee: 58000 },
];

// ─── Recent Activity ────────────────────────────────────────────────────────
type Row = {
  billNo: string;
  billType: string;
  party: string;
  amount: number;
  status: string;
  date: string;
};

function buildRecentBills(): Row[] {
  const vb: Row[] = BT_VENDOR_BILLS.map(b => ({
    billNo: b.billNo,
    billType: 'Vendor',
    party: b.vendor,
    amount: b.netPayable,
    status: b.status,
    date: b.billDate,
  }));
  const ec: Row[] = BT_EMPLOYEE_CLAIMS.map(c => ({
    billNo: c.claimNo,
    billType: 'Employee',
    party: c.employeeName,
    amount: c.claimAmount,
    status: c.status,
    date: c.claimDate,
  }));
  return [...vb, ...ec]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);
}

function statusVariant(s: string) {
  if (['Approved', 'Paid'].includes(s)) return 'approved';
  if (['Submitted', 'Verified', 'In Verification'].includes(s))
    return 'pending';
  if (s === 'Cancelled') return 'rejected';
  return 'neutral';
}

// ─── Pipeline ───────────────────────────────────────────────────────────────
const PIPELINE = [
  {
    label: 'Draft',
    count: allBills.filter(b => b.status === 'Draft').length,
    color: '#9ca3af',
  },
  {
    label: 'Submitted',
    count: allBills.filter(b => b.status === 'Submitted').length,
    color: '#f59e0b',
  },
  {
    label: 'Verified',
    count: allBills.filter(b => b.status === 'Verified').length,
    color: '#3b82f6',
  },
  {
    label: 'Approved',
    count: allBills.filter(b => b.status === 'Approved').length,
    color: '#8b5cf6',
  },
  {
    label: 'Paid',
    count: allBills.filter(b => b.status === 'Paid').length,
    color: '#22c55e',
  },
];

// ─── Quick Actions ──────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    label: 'Register Bill',
    icon: 'file-import',
    path: billTrackingUrls.billReceipt.root,
  },
  {
    label: 'Add Vendor Bill',
    icon: 'receipt',
    path: billTrackingUrls.vendorBills.root,
  },
  {
    label: 'New Claim',
    icon: 'user-plus',
    path: billTrackingUrls.employeeClaims.root,
  },
  {
    label: 'Verify Bill',
    icon: 'check-square',
    path: billTrackingUrls.billVerification.root,
  },
  {
    label: 'Approve Bill',
    icon: 'check-circle',
    path: billTrackingUrls.billApproval.root,
  },
  {
    label: 'Process Payment',
    icon: 'credit-card',
    path: billTrackingUrls.paymentProcessing.root,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const recentBills = buildRecentBills();

  return (
    <FormPage
      title="Bill Tracking Dashboard"
      description="Overview of all bills, claims, payments, and workflow bottlenecks."
    >
      {/* ── Action Center ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <i className="pi pi-exclamation-triangle text-amber-500 text-lg" />
          <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Action Center
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            [
              {
                label: 'Pending Verification',
                value: pendingVerification,
                icon: 'pi-search',
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                text: 'text-amber-700',
                iconBg: 'bg-amber-100 text-amber-600',
                path: billTrackingUrls.billVerification.root,
              },
              {
                label: 'Pending Approval',
                value: pendingApproval,
                icon: 'pi-check-square',
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'text-blue-700',
                iconBg: 'bg-blue-100 text-blue-600',
                path: billTrackingUrls.billApproval.root,
              },
              {
                label: 'Overdue Bills',
                value: overdueBills,
                icon: 'pi-calendar-times',
                bg: 'bg-red-50',
                border: 'border-red-200',
                text: 'text-red-700',
                iconBg: 'bg-red-100 text-red-600',
                path: billTrackingUrls.vendorBills.root,
              },
              {
                label: 'Awaiting Payment',
                value: unpaidApproved,
                icon: 'pi-wallet',
                bg: 'bg-purple-50',
                border: 'border-purple-200',
                text: 'text-purple-700',
                iconBg: 'bg-purple-100 text-purple-600',
                path: billTrackingUrls.paymentProcessing.root,
              },
            ] as const
          ).map(card => (
            <button
              key={card.label}
              type="button"
              onClick={() => navigate(card.path)}
              className={`flex items-center gap-4 p-4 rounded-xl border ${card.bg} ${card.border} hover:shadow-md transition-all duration-200 text-left cursor-pointer group`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} group-hover:scale-110 transition-transform`}
              >
                <i className={`pi ${card.icon} text-lg`} />
              </div>
              <div>
                <p className={`text-2xl font-black ${card.text}`}>
                  {card.value}
                </p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5 leading-tight">
                  {card.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="Total Bills"
          value={String(allBills.length)}
          icon="receipt_long"
          colorScheme="blue"
          subtitle="Vendor + Employee"
        />
        <StatCard
          title="Total Billed"
          value={`₹${(totalBilled / 100000).toFixed(1)}L`}
          icon="account_balance_wallet"
          colorScheme="orange"
          subtitle="All bills combined"
          trend={{ value: 12, direction: 'up', label: 'vs last month' }}
        />
        <StatCard
          title="Total Paid"
          value={`₹${(totalPaid / 100000).toFixed(1)}L`}
          icon="payments"
          colorScheme="green"
          subtitle="Disbursed to date"
          trend={{ value: 8, direction: 'up', label: 'vs last month' }}
        />
        <StatCard
          title="Outstanding"
          value={`₹${(outstanding / 100000).toFixed(1)}L`}
          icon="warning"
          colorScheme="red"
          subtitle="Unpaid amount"
          trend={{ value: 3, direction: 'down', label: 'vs last month' }}
        />
      </div>

      {/* ── Charts Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Area Chart: Monthly Billing Trend */}
        <div className="lg:col-span-2">
          <FormCard
            title="Monthly Billing Trend"
            subtitle="Vendor vs Employee bills (₹)"
          >
            <div style={{ height: 280, width: '100%', marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={MONTHLY_TREND}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorVendor"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorEmployee"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`}
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
                    dataKey="Vendor"
                    stroke="#4f46e5"
                    fillOpacity={1}
                    fill="url(#colorVendor)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="Employee"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#colorEmployee)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </FormCard>
        </div>

        {/* Donut Chart: Bill Status Distribution */}
        <FormCard title="Bill Status" subtitle="Distribution across all bills">
          <div style={{ height: 280, width: '100%', marginTop: '0.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STATUS_DIST}
                  cx="50%"
                  cy="43%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
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

      {/* ── Bottom Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2">
          <FormCard title="Recent Activity">
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Ref No', 'Type', 'Party', 'Amount', 'Status'].map(h => (
                      <th
                        key={h}
                        className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider pr-3"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentBills.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-3 font-mono text-xs font-bold text-indigo-600 whitespace-nowrap">
                        {row.billNo}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${row.billType === 'Vendor' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}
                        >
                          {row.billType}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-gray-700 font-medium text-xs max-w-[140px] truncate">
                        {row.party}
                      </td>
                      <td className="py-3 pr-3 font-bold text-gray-800 text-xs whitespace-nowrap">
                        ₹{row.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <StatusBadge
                          label={row.status}
                          variant={statusVariant(row.status)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormCard>
        </div>

        {/* Right: Quick Actions + Financial Summary + Pipeline */}
        <div className="flex flex-col gap-5">
          {/* Quick Actions */}
          <FormCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-2 mt-2">
              {QUICK_ACTIONS.map(a => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => navigate(a.path)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all duration-200 text-gray-500 font-semibold text-xs cursor-pointer group"
                >
                  <i
                    className={`pi pi-${a.icon} text-base group-hover:scale-110 transition-transform`}
                  />
                  <span className="text-center leading-tight">{a.label}</span>
                </button>
              ))}
            </div>
          </FormCard>

          {/* Financial Summary */}
          <FormCard title="Financial Summary">
            <div className="mt-1 space-y-0">
              {(
                [
                  {
                    label: 'Total Billed',
                    value: `₹${(totalBilled / 100000).toFixed(1)}L`,
                    color: '#374151',
                  },
                  {
                    label: 'Total Paid',
                    value: `₹${(totalPaid / 100000).toFixed(1)}L`,
                    color: '#16a34a',
                  },
                  {
                    label: 'Outstanding',
                    value: `₹${(outstanding / 100000).toFixed(1)}L`,
                    color: '#dc2626',
                  },
                  {
                    label: 'Pending Bills',
                    value: String(pendingVerification + pendingApproval),
                    color: '#d97706',
                  },
                  {
                    label: 'Paid Bills',
                    value: String(
                      allBills.filter(b => b.status === 'Paid').length
                    ),
                    color: '#16a34a',
                  },
                ] as const
              ).map(s => (
                <div
                  key={s.label}
                  className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0"
                >
                  <span className="text-xs text-gray-500 font-medium">
                    {s.label}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </FormCard>

          {/* Workflow Pipeline */}
          <FormCard title="Live Workflow Pipeline">
            <div className="relative pl-2 space-y-4 mt-3">
              <div className="absolute top-2 bottom-2 left-[1.6rem] w-0.5 bg-gray-100 z-0" />
              {PIPELINE.map((stage, idx) => (
                <div
                  key={idx}
                  className="relative z-10 flex items-center group cursor-pointer"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: stage.color + '25',
                      borderColor: stage.color + '50',
                    }}
                  >
                    <span
                      className="font-black text-xs"
                      style={{ color: stage.color }}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-xs font-bold text-gray-700">
                      {stage.label}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {stage.count} item{stage.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span
                    className="text-xs font-black px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: stage.color + '15',
                      color: stage.color,
                    }}
                  >
                    {stage.count}
                  </span>
                </div>
              ))}
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
