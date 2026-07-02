import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Icon } from 'shared/components/Icon/Icon';
import { DropDownList } from 'shared/components/forms';
import { FormPage, StatCard } from 'shared/new-components';
import { useDisbursements, useFunds } from '../../../queries';

const pendingActions = [
  {
    icon: 'how_to_reg',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    title: 'Beneficiary Selection Approvals',
    desc: '12 applications pending committee review',
    path: '/endowment-management/admin/selection',
  },
  {
    icon: 'currency_rupee',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Pending Disbursements',
    desc: '5 approved payouts awaiting release',
    path: '/endowment-management/admin/disbursement',
  },
  {
    icon: 'receipt_long',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Donation Receipts (80G)',
    desc: '3 receipts need generation',
    path: '/endowment-management/admin/donations',
  },
];

const recentDonations = [
  {
    id: 1,
    donor: 'Alumni Assoc. Batch 1995',
    fund: 'General Scholarship Fund',
    date: '2026-07-10',
    amount: '₹ 5,00,000',
    status: 'Received',
    statusColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  {
    id: 2,
    donor: 'Dr. Ramesh Kumar',
    fund: 'Prof. Sharma Memorial Chair',
    date: '2026-07-09',
    amount: '₹ 1,50,000',
    status: 'Received',
    statusColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  {
    id: 3,
    donor: 'TechCorp India Ltd.',
    fund: 'Innovation Research Grant',
    date: '2026-07-08',
    amount: '₹ 10,00,000',
    status: 'Pledged',
    statusColor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
];

const yearOptions = [
  { id: '2024-2025', name: '2024 - 2025' },
  { id: '2025-2026', name: '2025 - 2026' },
  { id: '2026-2027', name: '2026 - 2027' },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('');

  const { data: funds } = useFunds();
  const { data: disbursements } = useDisbursements();

  const totalFunds = funds?.length || 0;
  const totalCorpus = funds?.reduce((sum, f) => sum + f.currentCorpus, 0) || 0;
  const totalDisbursed =
    disbursements?.reduce((sum, d) => sum + d.amount, 0) || 0;

  const monthlyData = [
    { name: 'Aug', donations: 120000, disbursements: 45000 },
    { name: 'Sep', donations: 150000, disbursements: 50000 },
    { name: 'Oct', donations: 80000, disbursements: 30000 },
    { name: 'Nov', donations: 200000, disbursements: 120000 },
    { name: 'Dec', donations: 350000, disbursements: 200000 },
  ];

  return (
    <FormPage
      title="Admin Endowment Dashboard"
      description="Overview of endowment funds, donations, and scheme disbursements."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Admin Portal', to: '/endowment-management/admin' },
        { label: 'Dashboard' },
      ]}
    >
      <div className="flex justify-end items-center mb-6">
        <div className="w-64 [&_.input-block]:mb-0">
          <DropDownList
            data={yearOptions}
            value={selectedYear}
            valueField="id"
            textField="name"
            placeholder="Select Financial Year"
            defaultOptionText="Select Financial Year"
            onChange={(val: any) => setSelectedYear(val)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Funds"
          value={totalFunds.toString()}
          icon="account_balance"
          colorScheme="blue"
          subtitle="Total corpus across all funds"
        />
        <StatCard
          title="Total Corpus"
          value={`₹ ${(totalCorpus / 10000000).toFixed(1)} Cr`}
          icon="account_balance_wallet"
          colorScheme="green"
          subtitle="Overall endowment corpus"
        />
        <StatCard
          title="Active Schemes"
          value="18"
          icon="emoji_events"
          colorScheme="purple"
          subtitle="Scholarships and medals"
        />
        <StatCard
          title="Amount Disbursed"
          value={`₹ ${(totalDisbursed / 100000).toFixed(1)} L`}
          icon="currency_rupee"
          colorScheme="orange"
          subtitle="Awarded in current FY"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Donations vs Disbursements
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={val => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [
                    `₹${Number(value || 0).toLocaleString()}`,
                    undefined,
                  ]}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar
                  dataKey="donations"
                  name="Donations"
                  fill="#14b8a6"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
                <Bar
                  dataKey="disbursements"
                  name="Disbursements"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Pending Actions
          </h3>
          <div className="flex flex-col gap-3">
            {pendingActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors w-full text-left"
              >
                <div
                  className={`${action.iconBg} ${action.iconColor} p-2 rounded-full shadow-sm`}
                >
                  <Icon name={action.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-700 block truncate">
                    {action.title}
                  </span>
                  <span className="text-xs text-gray-500">{action.desc}</span>
                </div>
                <Icon name="chevron_right" className="text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Donations
          </h3>
          <button
            onClick={() => navigate('/endowment-management/admin/donations')}
            className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
          >
            View All
            <Icon name="chevron_right" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Donor
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Fund
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.map(d => (
                <tr
                  key={d.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                >
                  <td className="py-3 px-4 text-gray-800">{d.donor}</td>
                  <td className="py-3 px-4 text-gray-600">{d.fund}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">
                    {d.amount}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{d.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${d.statusColor}`}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </FormPage>
  );
}
