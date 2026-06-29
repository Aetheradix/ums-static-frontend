import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { usePayrollStore } from '../store/usePayrollStore';

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({
  title,
  value,
  sub,
  subColor = 'text-gray-500',
  icon,
  iconBg,
  iconColor,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  sub: string;
  subColor?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5 flex items-start justify-between hover:shadow-md transition-all group">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {title}
        </span>
        <span className="text-2xl font-black text-gray-800 leading-tight">
          {value}
        </span>
        <span className={`text-[11px] font-semibold ${subColor}`}>{sub}</span>
        {trend && (
          <span
            className={`text-[10px] font-bold mt-0.5 flex items-center gap-1 ${trendUp ? 'text-green-600' : 'text-rose-500'}`}
          >
            <i
              className={`pi ${trendUp ? 'pi-arrow-up-right' : 'pi-arrow-down-right'} text-[9px]`}
            />
            {trend}
          </span>
        )}
      </div>
      <div
        className={`p-3 ${iconBg} ${iconColor} rounded-xl group-hover:scale-110 transition-transform`}
      >
        <i className={`pi pi-${icon} text-base`} />
      </div>
    </div>
  );
}

// ─── Pipeline Stage ──────────────────────────────────────────────────────────
function PipelineStage({
  step,
  label,
  badge,
  icon,
  bg,
  badgeColor,
}: {
  step: string;
  label: string;
  badge: string;
  icon: string;
  bg: string;
  badgeColor: string;
}) {
  return (
    <div className="flex flex-col items-center text-center z-10">
      <div
        className={`w-12 h-12 ${bg} text-white rounded-full flex items-center justify-center shadow-md`}
      >
        <i className={`pi pi-${icon} text-base`} />
      </div>
      <span className="text-xs font-black text-gray-800 mt-2">{step}</span>
      <span className="text-[10px] font-semibold text-gray-500 mt-0.5">
        {label}
      </span>
      <span
        className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${badgeColor}`}
      >
        {badge}
      </span>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function PayrollDashboard() {
  const { employees, salaryHeads } = usePayrollStore();
  const navigate = useNavigate();

  // ── Base metrics ─────────────────────────────────────────────────────────
  const getBasic = (desig: string) => {
    switch (desig) {
      case 'Professor':
        return 144200;
      case 'Registrar':
        return 131400;
      case 'Associate Professor':
        return 115000;
      case 'Assistant Professor':
        return 57700;
      default:
        return 35400;
    }
  };

  const totalEmployees = employees.length;
  const regularEmployees = employees.filter(
    e => e.postType === 'Regular/Permanent'
  ).length;
  const contractual = employees.filter(
    e => e.postType === 'Contractual'
  ).length;

  const totalBasic = employees.reduce(
    (acc, e) => acc + getBasic(e.designation),
    0
  );
  const totalDA = Math.round(totalBasic * 0.5);
  const totalHRA = Math.round(totalBasic * 0.27);
  const totalConv = employees.length * 5000;
  const totalGross = totalBasic + totalDA + totalHRA + totalConv;
  const totalNPS = Math.round((totalBasic + totalDA) * 0.1);
  const totalTax = Math.round(totalBasic * 0.05);
  const totalDed = totalNPS + totalTax;
  const totalNet = totalGross - totalDed;

  // ── Post type groups ──────────────────────────────────────────────────────
  const postGroups: Record<string, number> = {};
  employees.forEach(e => {
    postGroups[e.postType] = (postGroups[e.postType] || 0) + 1;
  });

  // ─────────────────────────────────────────────────────────────────────────
  // CHART 1 — Payroll Component Breakdown (vertical bar, varied amounts)
  // ─────────────────────────────────────────────────────────────────────────
  const payrollComponentChart = {
    labels: [
      'Basic Pay',
      'Dearness Allow.',
      'HRA',
      'Conveyance',
      'NPS',
      'Income Tax',
    ],
    datasets: [
      {
        label: 'Amount (₹)',
        backgroundColor: [
          '#4F46E5',
          '#0D9488',
          '#D97706',
          '#10B981',
          '#EF4444',
          '#F97316',
        ],
        borderRadius: 6,
        data: [totalBasic, totalDA, totalHRA, totalConv, totalNPS, totalTax],
      },
    ],
  };

  const payrollComponentOptions = {
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v: number) => `₹${(v / 1000).toFixed(0)}K` },
        grid: { color: '#F1F5F9' },
      },
      x: { grid: { display: false } },
    },
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CHART 2 — Staff by Designation (horizontal bar)
  //   Realistic university staffing numbers — hardcoded for proper variation
  // ─────────────────────────────────────────────────────────────────────────
  const designationChart = {
    labels: [
      'Assistant Professor',
      'Associate Professor',
      'Professor',
      'Lab Technician',
      'Registrar',
      'Clerk / DEO',
    ],
    datasets: [
      {
        label: 'Employees',
        backgroundColor: [
          '#4F46E5',
          '#0D9488',
          '#D97706',
          '#EC4899',
          '#3B82F6',
          '#8B5CF6',
        ],
        borderRadius: 6,
        data: [38, 22, 14, 9, 4, 13],
      },
    ],
  };

  const designationOptions = {
    indexAxis: 'y' as const,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 5 },
        grid: { color: '#F1F5F9' },
      },
      y: { grid: { display: false } },
    },
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CHART 3 — Employment Type Doughnut
  // ─────────────────────────────────────────────────────────────────────────
  const postTypeChart = {
    labels: Object.keys(postGroups),
    datasets: [
      {
        data: Object.values(postGroups),
        backgroundColor: ['#4F46E5', '#D97706', '#0D9488'],
        hoverOffset: 12,
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CHART 4 — Pay Commission Salary Head split (horizontal bars)
  // ─────────────────────────────────────────────────────────────────────────
  const commissionGroups: Record<string, number> = {};
  salaryHeads.forEach(sh => {
    commissionGroups[sh.payCommission] =
      (commissionGroups[sh.payCommission] || 0) + 1;
  });

  const commissionChart = {
    labels: Object.keys(commissionGroups),
    datasets: [
      {
        label: 'Head Configs',
        backgroundColor: ['#4F46E5', '#10B981', '#D97706'],
        borderRadius: 6,
        data: Object.values(commissionGroups),
      },
    ],
  };

  const commissionOptions = {
    indexAxis: 'y' as const,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: '#F1F5F9' },
      },
      y: { grid: { display: false } },
    },
  };

  // Quick links
  const quickLinks = [
    {
      label: 'Earning & Deduction',
      path: 'earning-deduction',
      icon: 'list',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      label: 'Salary Head',
      path: 'set-head-value/salary-head',
      icon: 'sliders-v',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      label: 'Set Attendance',
      path: 'salary-process/set-attendance',
      icon: 'calendar',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      label: 'Generate Salary',
      path: 'salary-process/generate-salary',
      icon: 'dollar',
      color: 'bg-green-50 text-green-700 border-green-200',
    },
    {
      label: 'Gratuity',
      path: 'gratuity',
      icon: 'star',
      color: 'bg-pink-50 text-pink-700 border-pink-200',
    },
    {
      label: 'Leave Encashment',
      path: 'leave-encashment',
      icon: 'ticket',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      label: 'Bonus',
      path: 'bonus',
      icon: 'gift',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      label: 'Loan Information',
      path: 'set-head-value/loan-information',
      icon: 'building-columns',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

  return (
    <FormPage
      title="Dashboard"
      description="Monthly payroll analytics — staff distribution, salary trends, component breakdown, and disbursement summary."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        { label: 'Dashboard' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* ── ROW 1: KPI Cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            title="Total Employees"
            value={String(totalEmployees)}
            sub={`${regularEmployees} Regular · ${contractual} Contract`}
            icon="users"
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            trend="+2 this quarter"
            trendUp
          />
          <KpiCard
            title="Monthly Gross Pay"
            value={`₹${(totalGross / 100000).toFixed(2)}L`}
            sub="Estimated gross — current month"
            subColor="text-emerald-600 font-semibold"
            icon="wallet"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            trend="+3.2% vs last month"
            trendUp
          />
          <KpiCard
            title="Net Disbursement"
            value={`₹${(totalNet / 100000).toFixed(2)}L`}
            sub="After NPS & tax deductions"
            subColor="text-blue-600 font-semibold"
            icon="send"
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <KpiCard
            title="Total Deductions"
            value={`₹${(totalDed / 1000).toFixed(1)}K`}
            sub={`NPS ₹${(totalNPS / 1000).toFixed(0)}K + Tax ₹${(totalTax / 1000).toFixed(0)}K`}
            subColor="text-red-500"
            icon="minus-circle"
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />
        </div>

        {/* ── ROW 2: Component Bar + Designation Bar ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormCard title="Current Month Payroll Components">
            <p className="text-xs text-gray-400 mb-4">
              Gross salary elements vs deduction amounts for all staff
            </p>
            <Chart
              type="bar"
              data={payrollComponentChart}
              options={payrollComponentOptions}
              className="w-full"
            />
          </FormCard>

          <FormCard title="Staff Headcount by Designation">
            <p className="text-xs text-gray-400 mb-4">
              Number of employees per job designation across all offices
            </p>
            <Chart
              type="bar"
              data={designationChart}
              options={designationOptions}
              className="w-full"
            />
          </FormCard>
        </div>

        {/* ── ROW 4: Employment Doughnut + Commission Bar ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormCard title="Employment Type Distribution">
            <p className="text-xs text-gray-400 mb-2">
              Breakdown of staff by employment category
            </p>
            <div className="flex justify-center">
              <Chart
                type="doughnut"
                data={postTypeChart}
                className="w-full md:w-80"
              />
            </div>
          </FormCard>

          <FormCard title="Salary Head Configs by Pay Commission">
            <p className="text-xs text-gray-400 mb-4">
              Number of head value rules defined per pay commission
            </p>
            <Chart
              type="bar"
              data={commissionChart}
              options={commissionOptions}
              className="w-full"
            />
          </FormCard>
        </div>

        {/* ── ROW 5: Process Pipeline ───────────────────────────────────────── */}
        <FormCard title="Monthly Salary Process Pipeline">
          <p className="text-xs text-gray-400 mb-6">
            Sequential stages of payroll preparation and disbursement
          </p>
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 px-4 py-2">
            <div className="absolute top-[22px] left-16 right-16 h-0.5 bg-gradient-to-r from-indigo-300 via-teal-300 via-amber-300 via-green-300 to-blue-300 hidden md:block z-0" />
            <PipelineStage
              step="1. Attendance"
              label="Mark Present / Absent"
              badge="Monthly Input"
              icon="calendar-times"
              bg="bg-indigo-500"
              badgeColor="bg-indigo-50 text-indigo-700"
            />
            <PipelineStage
              step="2. Head Values"
              label="E&D Setup"
              badge="Config Updated"
              icon="sliders-v"
              bg="bg-teal-500"
              badgeColor="bg-teal-50 text-teal-700"
            />
            <PipelineStage
              step="3. Generate"
              label="Compute Sheets"
              badge="Pending Run"
              icon="cog"
              bg="bg-amber-500"
              badgeColor="bg-amber-50 text-amber-700"
            />
            <PipelineStage
              step="4. Process"
              label="Final / Supplementary"
              badge="Authorize"
              icon="check-square"
              bg="bg-green-500"
              badgeColor="bg-green-50 text-green-700"
            />
            <PipelineStage
              step="5. Disburse"
              label="Treasury Transfer"
              badge="Bank Credit"
              icon="send"
              bg="bg-blue-500"
              badgeColor="bg-blue-50 text-blue-700"
            />
          </div>
        </FormCard>

        {/* ── ROW 6: Quick Navigation ───────────────────────────────────────── */}
        <FormCard title="Quick Navigation">
          <p className="text-xs text-gray-400 mb-5">
            Direct access to all payroll management modules
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {quickLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => navigate(`/payroll-management/${link.path}`)}
                className={`flex flex-col items-center justify-center gap-2 p-3 border rounded-xl text-center hover:shadow-md transition-all cursor-pointer ${link.color}`}
              >
                <i className={`pi pi-${link.icon} text-lg`} />
                <span className="text-[10px] font-bold leading-tight">
                  {link.label}
                </span>
              </button>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
