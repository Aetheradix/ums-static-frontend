import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import {
  DASHBOARD_KPIS,
  RECENT_TRANSACTIONS,
  DASHBOARD_ALERTS,
} from '../../mock-data';
import { motion, type Variants } from 'motion/react';
import {
  Wallet,
  PiggyBank,
  ArrowDownRight,
  ArrowUpRight,
  ShoppingCart,
  AlertTriangle,
  Clock,
  FileText,
  Store,
  Building2,
  Package,
  PieChart,
  TrendingUp,
  Activity,
  BarChart3,
  PlusCircle,
  ListTodo,
  History,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { Chart } from 'primereact/chart';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  colorClass: string;
  trend?: { value: string; isPositive: boolean };
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  colorClass,
  trend,
}: KpiCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={`flex flex-col gap-3 p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${colorClass}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 pointer-events-none">
        {icon}
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm bg-white`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide truncate">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 truncate mt-0.5">
            {value}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1 relative z-10">
        {subtitle && (
          <p className="text-xs text-gray-500 font-medium truncate">
            {subtitle}
          </p>
        )}
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-bold ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {trend.value}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
}

function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
      <div className="text-gray-400">{icon}</div>
      <h2 className="text-base font-bold text-gray-700 uppercase tracking-wider">
        {title}
      </h2>
    </div>
  );
}

export default function DashboardPage() {
  const k = DASHBOARD_KPIS;

  const budgetCards: KpiCardProps[] = [
    {
      title: 'Total Budget',
      value: formatCurrency(k.totalBudget),
      subtitle: 'Annual Approved FY 24-25',
      icon: <PiggyBank className="w-6 h-6 text-blue-600" />,
      colorClass:
        'border-l-4 border-l-blue-500 border-y-gray-200 border-r-gray-200',
    },
    {
      title: 'Expenditure',
      value: formatCurrency(k.totalExpenditure),
      subtitle: `${k.budgetUtilizationPct}% utilized`,
      icon: <Wallet className="w-6 h-6 text-orange-600" />,
      colorClass:
        'border-l-4 border-l-orange-500 border-y-gray-200 border-r-gray-200',
      trend: { value: '+2.4%', isPositive: false },
    },
    {
      title: 'Available Funds',
      value: formatCurrency(k.remainingBudget),
      subtitle: 'Ready to spend',
      icon: <PieChart className="w-6 h-6 text-emerald-600" />,
      colorClass:
        'border-l-4 border-l-emerald-500 border-y-gray-200 border-r-gray-200',
    },
    {
      title: 'Total Receipts',
      value: formatCurrency(k.totalReceipts),
      subtitle: 'Fees & Grants',
      icon: <ArrowDownRight className="w-6 h-6 text-teal-600" />,
      colorClass:
        'border-l-4 border-l-teal-500 border-y-gray-200 border-r-gray-200',
      trend: { value: '+12%', isPositive: true },
    },
  ];

  const payableCards: KpiCardProps[] = [
    {
      title: 'Pending Payables',
      value: formatCurrency(k.pendingPayables),
      subtitle: 'Bills awaiting payment',
      icon: <Clock className="w-6 h-6 text-amber-500" />,
      colorClass:
        'border-l-4 border-l-amber-400 border-y-gray-200 border-r-gray-200',
    },
    {
      title: 'Overdue Payables',
      value: formatCurrency(k.overduePayables),
      subtitle: 'Past due date',
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      colorClass:
        'border-l-4 border-l-red-500 border-y-gray-200 border-r-gray-200',
      trend: { value: '-1.2%', isPositive: true },
    },
    {
      title: 'Open POs',
      value: String(k.openPOs),
      subtitle: 'Awaiting delivery',
      icon: <ShoppingCart className="w-6 h-6 text-purple-500" />,
      colorClass:
        'border-l-4 border-l-purple-500 border-y-gray-200 border-r-gray-200',
    },
    {
      title: 'Pending Requisitions',
      value: String(k.pendingPRs),
      subtitle: 'Awaiting approval',
      icon: <FileText className="w-6 h-6 text-pink-500" />,
      colorClass:
        'border-l-4 border-l-pink-500 border-y-gray-200 border-r-gray-200',
    },
  ];

  const operationsCards: KpiCardProps[] = [
    {
      title: 'Active Vendors',
      value: String(k.totalVendors),
      subtitle: 'Registered partners',
      icon: <Store className="w-6 h-6 text-indigo-500" />,
      colorClass:
        'border-l-4 border-l-indigo-500 border-y-gray-200 border-r-gray-200',
    },
    {
      title: 'Total Assets',
      value: String(k.totalAssets),
      subtitle: 'Fixed assets registered',
      icon: <Building2 className="w-6 h-6 text-cyan-500" />,
      colorClass:
        'border-l-4 border-l-cyan-500 border-y-gray-200 border-r-gray-200',
    },
    {
      title: 'Pending GRNs',
      value: String(k.pendingGRNs),
      subtitle: 'Awaiting entry',
      icon: <Package className="w-6 h-6 text-slate-500" />,
      colorClass:
        'border-l-4 border-l-slate-500 border-y-gray-200 border-r-gray-200',
    },
  ];

  // Chart Data Preparation
  const [chartData, setChartData] = useState<any>({});
  const [chartOptions, setChartOptions] = useState<any>({});

  const [doughnutData, setDoughnutData] = useState<any>({});
  const [doughnutOptions, setDoughnutOptions] = useState<any>({});

  const [barData, setBarData] = useState<any>({});
  const [barOptions, setBarOptions] = useState<any>({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#333';
    const textColorSecondary =
      documentStyle.getPropertyValue('--text-color-secondary') || '#666';
    const surfaceBorder =
      documentStyle.getPropertyValue('--surface-border') || '#ddd';

    // 1. Cash Flow Line Chart Data
    setChartData({
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Income',
          data: [6500000, 5900000, 8000000, 8100000, 5600000, 5500000],
          fill: false,
          borderColor: '#10b981',
          tension: 0.4,
        },
        {
          label: 'Expenses',
          data: [2800000, 4800000, 4000000, 1900000, 8600000, 2700000],
          fill: false,
          borderColor: '#f43f5e',
          tension: 0.4,
        },
      ],
    });

    setChartOptions({
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: { labels: { color: textColor } },
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder },
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder },
        },
      },
    });

    // 2. Budget Utilization Doughnut
    setDoughnutData({
      labels: ['Spent', 'Committed', 'Available'],
      datasets: [
        {
          data: [k.totalExpenditure, 5000000, k.remainingBudget - 5000000],
          backgroundColor: ['#f97316', '#a855f7', '#10b981'],
          hoverBackgroundColor: ['#ea580c', '#9333ea', '#059669'],
        },
      ],
    });

    setDoughnutOptions({
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: { position: 'bottom', labels: { color: textColor } },
      },
    });

    // 3. Departmental Bar Chart
    const utilizationItems = [
      { head: 'Salary', alloc: 120, used: 95 },
      { head: 'Lab Equip', alloc: 20, used: 19 },
      { head: 'Library', alloc: 8, used: 8 },
      { head: 'Building', alloc: 30, used: 12 },
      { head: 'IT H/W', alloc: 15, used: 17 },
      { head: 'Office', alloc: 5, used: 3 },
    ];

    setBarData({
      labels: utilizationItems.map(i => i.head),
      datasets: [
        {
          label: 'Allocated (Lakhs)',
          backgroundColor: '#3b82f6',
          data: utilizationItems.map(i => i.alloc),
        },
        {
          label: 'Utilized (Lakhs)',
          backgroundColor: '#f97316',
          data: utilizationItems.map(i => i.used),
        },
      ],
    });

    setBarOptions({
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: { labels: { color: textColor } },
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary, font: { weight: 500 } },
          grid: { display: false, drawBorder: false },
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false },
        },
      },
    });
  }, [k.totalExpenditure, k.remainingBudget]);

  return (
    <FormPage
      title="Finance & Supply Chain Dashboard"
      description="Overview of budget, expenditure, procurement, and financial health for FY 2024-25."
    >
      <motion.div
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Core Financial KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {budgetCards.map(card => (
            <KpiCard key={card.title} {...card} />
          ))}
        </div>

        {/* Operational KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {payableCards.map(card => (
            <KpiCard key={card.title} {...card} />
          ))}
        </div>

        {/* Charts Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <FormCard>
              <SectionHeader
                title="Cash Flow Trend (6 Months)"
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <div className="h-[300px] w-full mt-4">
                {chartData.datasets && (
                  <Chart
                    type="line"
                    data={chartData}
                    options={chartOptions}
                    className="h-full w-full"
                  />
                )}
              </div>
            </FormCard>
          </motion.div>

          {/* Doughnut Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <FormCard>
              <SectionHeader
                title="Budget Allocation"
                icon={<PieChart className="w-5 h-5" />}
              />
              <div className="h-[300px] w-full mt-4">
                {doughnutData.datasets && (
                  <Chart
                    type="doughnut"
                    data={doughnutData}
                    options={doughnutOptions}
                    className="w-full h-full"
                  />
                )}
              </div>
            </FormCard>
          </motion.div>
        </div>

        {/* Charts Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <FormCard>
              <SectionHeader
                title="Budget Head Utilization"
                icon={<BarChart3 className="w-5 h-5" />}
              />
              <div className="h-[300px] w-full mt-4">
                {barData.datasets && (
                  <Chart
                    type="bar"
                    data={barData}
                    options={barOptions}
                    className="h-full w-full"
                  />
                )}
              </div>
            </FormCard>
          </motion.div>

          {/* Mini Stats or recent activity */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <FormCard>
              <SectionHeader
                title="Other Metrics"
                icon={<Activity className="w-5 h-5" />}
              />
              <div className="flex flex-col gap-4 mt-4">
                {operationsCards.map((card, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100">
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-700">
                        {card.title}
                      </p>
                      <p className="text-xs text-gray-500">{card.subtitle}</p>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {card.value}
                    </div>
                  </div>
                ))}
              </div>
            </FormCard>
          </motion.div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <FormCard>
              <SectionHeader
                title="Quick Actions"
                icon={<PlusCircle className="w-5 h-5" />}
              />
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  to="/finance-supply-chain/accounting/receipt-voucher/create"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 hover:border-blue-200 hover:shadow-sm transition-all group"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <span className="flex-1 font-medium text-gray-700 group-hover:text-blue-700">
                    New Receipt Voucher
                  </span>
                </Link>
                <Link
                  to="/finance-supply-chain/procurement/purchase-requisition/create"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 hover:border-purple-200 hover:shadow-sm transition-all group"
                >
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <span className="flex-1 font-medium text-gray-700 group-hover:text-purple-700">
                    Create Purchase Req
                  </span>
                </Link>
                <Link
                  to="/finance-supply-chain/budget-management/budget-allocation/create"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 hover:border-emerald-200 hover:shadow-sm transition-all group"
                >
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <span className="flex-1 font-medium text-gray-700 group-hover:text-emerald-700">
                    Allocate Budget
                  </span>
                </Link>
                <Link
                  to="/finance-supply-chain/accounting/journal-voucher/create"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 hover:border-orange-200 hover:shadow-sm transition-all group"
                >
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <span className="flex-1 font-medium text-gray-700 group-hover:text-orange-700">
                    New Journal Entry
                  </span>
                </Link>
              </div>
            </FormCard>
          </motion.div>

          {/* Alerts & Tasks */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <FormCard>
              <SectionHeader
                title="Alerts & Tasks"
                icon={<ListTodo className="w-5 h-5" />}
              />
              <div className="flex flex-col gap-3 mt-4">
                {DASHBOARD_ALERTS.map(alert => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-10 rounded-full ${alert.severity === 'high' ? 'bg-red-500' : 'bg-yellow-400'}`}
                      ></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500">{alert.module}</p>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors">
                      Action
                    </button>
                  </div>
                ))}
              </div>
            </FormCard>
          </motion.div>
        </div>

        {/* Recent Transactions Table */}
        <motion.div variants={itemVariants} className="w-full">
          <FormCard>
            <SectionHeader
              title="Recent Transactions"
              icon={<History className="w-5 h-5" />}
            />
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Transaction ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {RECENT_TRANSACTIONS.map(tx => (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {tx.transactionId}
                      </td>
                      <td className="px-4 py-3">{tx.type}</td>
                      <td className="px-4 py-3">{tx.date}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                            tx.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : tx.status === 'Pending'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormCard>
        </motion.div>
      </motion.div>
    </FormPage>
  );
}
