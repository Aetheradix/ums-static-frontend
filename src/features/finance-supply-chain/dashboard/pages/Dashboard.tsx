import {
  ArrowRight,
  BadgeCheck,
  BadgeIndianRupee,
  Banknote,
  BarChart3,
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  Calculator,
  Car,
  ChartNoAxesCombined,
  CircleAlert,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  CreditCard,
  FileCheck2,
  FileText,
  Gauge,
  GraduationCap,
  HandCoins,
  HardHat,
  Landmark,
  LayoutDashboard,
  LineChart,
  PackageCheck,
  PieChart,
  PiggyBank,
  Receipt,
  RotateCcw,
  Scale,
  ShieldCheck,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  WalletCards,
  Wrench,
} from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import './Dashboard.css';

type UniversityType = 'gov' | 'private';
type KpiStatus = 'up' | 'down' | 'stable';

interface KpiItem {
  label: string;
  value: string;
  change: string;
  status: KpiStatus;
}

interface UniversityModel {
  labels: string[];
  budget: number[];
  actual: number[];
  departmentNames: string[];
  departmentAllocation: number[];
  departmentSpent: number[];
  departmentUsagePercentage: number[];
  monthlyIncome: number[];
  monthlyExpense: number[];
  executiveKpis: KpiItem[];
  operationsKpis: KpiItem[];
}

interface ChartPanelProps {
  title: string;
  type: 'line' | 'bar' | 'doughnut' | 'pie' | 'polarArea';
  data: Record<string, unknown>;
  options: Record<string, unknown>;
  large?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 24,
    },
  },
};

const fiscalMonths = [
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
];

const financialYearOptions = [
  { label: '2025-2026', value: '2025-2026' },
  { label: '2024-2025', value: '2024-2025' },
  { label: '2023-2024', value: '2023-2024' },
  { label: '2022-2023', value: '2022-2023' },
];

function createKpiSlug(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const universityData: Record<UniversityType, UniversityModel> = {
  gov: {
    labels: [
      'Income Framework Base',
      'Income Realization',
      'Expenditure Blueprint',
      'Expenditure Realization',
    ],
    budget: [23000000, 22450000, 21500000, 20800000],
    actual: [22500000, 22450000, 21000000, 20800000],
    departmentNames: [
      'Engineering',
      'Sciences',
      'Medical School',
      'Arts & Liberal Studies',
      'Research Cost Centres',
    ],
    departmentAllocation: [5500000, 4500000, 7000000, 2500000, 2000000],
    departmentSpent: [5400000, 4200000, 6800000, 2100000, 2300000],
    departmentUsagePercentage: [98.1, 93.3, 97.1, 84, 115],
    monthlyIncome: [
      1800000, 1950000, 1750000, 2100000, 1850000, 1900000, 2200000, 1700000,
      1650000, 2000000, 1850000, 1700000,
    ],
    monthlyExpense: [
      1600000, 1720000, 1680000, 1850000, 1700000, 1790000, 1900000, 1650000,
      1600000, 1800000, 1750000, 1760000,
    ],
    executiveKpis: [
      {
        label: 'Total Annual Budget',
        value: '₹25,000,000',
        change: 'Approved Plan',
        status: 'stable',
      },
      {
        label: 'Income Budget and Utilization',
        value: '97.6% Realized',
        change: '22.45M of 23.0M',
        status: 'up',
      },
      {
        label: 'Expenditure Budget and Utilization',
        value: '96.7% Disbursed',
        change: '20.8M of 21.5M',
        status: 'up',
      },
      {
        label: 'Remaining Budget',
        value: '₹4,200,000',
        change: 'Uncommitted Balance',
        status: 'stable',
      },
      {
        label: 'Fund Availability',
        value: '₹5,450,000',
        change: 'Treasury Reserve',
        status: 'up',
      },
      {
        label: 'Total Income',
        value: '₹22,450,000',
        change: 'State & UGC Funds',
        status: 'up',
      },
      {
        label: 'Total Expenditure',
        value: '₹20,800,000',
        change: 'YTD Outlays',
        status: 'down',
      },
      {
        label: 'Monthly Income',
        value: '₹1,950,000',
        change: 'Grant Disbursal',
        status: 'up',
      },
      {
        label: 'Monthly Expense',
        value: '₹1,720,000',
        change: 'Payroll & Vendors',
        status: 'stable',
      },
      {
        label: 'Annual Surplus / Deficit',
        value: '₹1,650,000',
        change: 'Surplus Profile',
        status: 'up',
      },
    ],
    operationsKpis: [
      {
        label: 'Grant Utilization',
        value: '94.2%',
        change: 'UC Statements Filed',
        status: 'up',
      },
      {
        label: 'Fee Collection Efficiency',
        value: '92.5%',
        change: 'Subsidy Applied',
        status: 'stable',
      },
      {
        label: 'Total Fee Collection',
        value: '₹10,000,000',
        change: 'Analytic Tracked',
        status: 'up',
      },
      {
        label: 'Outstanding Fee',
        value: '₹500,000',
        change: 'Verified',
        status: 'up',
      },
      {
        label: 'Outstanding Payments',
        value: '₹450,000',
        change: 'Contractor Pending',
        status: 'down',
      },
      {
        label: 'Outstanding Liabilities',
        value: '₹1,200,000',
        change: 'Long-term Debt',
        status: 'stable',
      },
      {
        label: 'Pending Bills',
        value: '14 Open Bills',
        change: 'In Verification',
        status: 'down',
      },
      {
        label: 'Pending Approvals',
        value: '4 Vouchers',
        change: 'VC Sign-off',
        status: 'stable',
      },
      {
        label: 'Audit Compliance Rate',
        value: '98.4%',
        change: 'No Major Flags',
        status: 'up',
      },
      {
        label: 'Monthly Cash Flow',
        value: '₹1,840,000',
        change: 'Positive Flow',
        status: 'up',
      },
      {
        label: 'Scholarship Report',
        value: '₹850,000',
        change: 'Disbursed',
        status: 'up',
      },
    ],
  },
  private: {
    labels: [
      'Income Framework Base',
      'Income Realization',
      'Expenditure Blueprint',
      'Expenditure Realization',
    ],
    budget: [32000000, 33100000, 28500000, 29200000],
    actual: [31500000, 33100000, 28000000, 29200000],
    departmentNames: [
      'Business School',
      'Computing & IT',
      'Design & Media',
      'Executive Programs',
      'Corporate Hub',
    ],
    departmentAllocation: [8000000, 9000000, 4500000, 5000000, 2000000],
    departmentSpent: [8200000, 9500000, 4100000, 4800000, 2600000],
    departmentUsagePercentage: [102.5, 105.5, 91.1, 96, 130],
    monthlyIncome: [
      2500000, 2900000, 2400000, 3400000, 2800000, 2600000, 3100000, 2350000,
      2200000, 2840000, 2950000, 3060000,
    ],
    monthlyExpense: [
      2100000, 2410000, 2250000, 2600000, 2300000, 2450000, 2800000, 2200000,
      2100000, 2410000, 2600000, 2980000,
    ],
    executiveKpis: [
      {
        label: 'Total Annual Budget',
        value: '₹35,000,000',
        change: 'Board Approved',
        status: 'stable',
      },
      {
        label: 'Income Budget and Utilization',
        value: '103.4% Collected',
        change: '33.1M of 32.0M',
        status: 'up',
      },
      {
        label: 'Expenditure Budget and Utilization',
        value: '102.4% Expended',
        change: '29.2M of 28.5M',
        status: 'down',
      },
      {
        label: 'Remaining Budget',
        value: '₹5,800,000',
        change: 'Operating Buffer',
        status: 'stable',
      },
      {
        label: 'Fund Availability',
        value: '₹8,120,000',
        change: 'Liquid Cash',
        status: 'up',
      },
      {
        label: 'Total Income',
        value: '₹33,100,000',
        change: 'Tuition & CSR',
        status: 'up',
      },
      {
        label: 'Total Expenditure',
        value: '₹29,200,000',
        change: 'Infrastructure',
        status: 'down',
      },
      {
        label: 'Monthly Income',
        value: '₹2,840,000',
        change: 'Term Milestones',
        status: 'up',
      },
      {
        label: 'Monthly Expense',
        value: '₹2,410,000',
        change: 'Procurement',
        status: 'down',
      },
      {
        label: 'Annual Surplus / Deficit',
        value: '₹3,900,000',
        change: 'Retained Wealth',
        status: 'up',
      },
    ],
    operationsKpis: [
      {
        label: 'Department Budget Usage',
        value: 'Live Analytics',
        change: 'High Velocity',
        status: 'up',
      },
      {
        label: 'Department Expense',
        value: 'Donut Analytics',
        change: 'IT Highest',
        status: 'down',
      },
      {
        label: 'Grant Utilization',
        value: '88.5%',
        change: 'Sponsored Projects',
        status: 'stable',
      },
      {
        label: 'Fee Collection Efficiency',
        value: '98.1%',
        change: 'Automated Gateway',
        status: 'up',
      },
      {
        label: 'Outstanding Payments',
        value: '₹180,000',
        change: 'Vendor Retainers',
        status: 'up',
      },
      {
        label: 'Outstanding Liabilities',
        value: '₹620,000',
        change: 'Construction Debt',
        status: 'up',
      },
      {
        label: 'Pending Bills',
        value: '5 Open Bills',
        change: 'OCR Pipeline',
        status: 'up',
      },
      {
        label: 'Pending Approvals',
        value: '2 Vouchers',
        change: 'Finance Review',
        status: 'stable',
      },
      {
        label: 'Audit Compliance Rate',
        value: '99.1%',
        change: 'Evaluated',
        status: 'up',
      },
      {
        label: 'Monthly Cash Flow',
        value: '₹3,150,000',
        change: 'Strong Reserve',
        status: 'up',
      },
      {
        label: 'Scholarship Report',
        value: '₹420,000',
        change: 'Merit Disbursal',
        status: 'stable',
      },
    ],
  },
};

function useDashboardTheme() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

function getKpiIcon(label: string) {
  const iconMap: Record<string, React.ReactNode> = {
    'Total Annual Budget': <WalletCards />,
    'Income Budget and Utilization': <TrendingUp />,
    'Expenditure Budget and Utilization': <TrendingDown />,
    'Remaining Budget': <PiggyBank />,
    'Fund Availability': <Wallet />,
    'Total Income': <Banknote />,
    'Total Expenditure': <Receipt />,
    'Monthly Income': <CircleDollarSign />,
    'Monthly Expense': <CreditCard />,
    'Annual Surplus / Deficit': <Scale />,

    'Grant Utilization': <HandCoins />,
    'Fee Collection Efficiency': <Gauge />,
    'Total Fee Collection': <BadgeIndianRupee />,
    'Outstanding Fee': <Clock3 />,
    'Outstanding Payments': <FileText />,
    'Outstanding Liabilities': <Landmark />,
    'Pending Bills': <Receipt />,
    'Pending Approvals': <ClipboardCheck />,
    'Audit Compliance Rate': <ShieldCheck />,
    'Monthly Cash Flow': <LineChart />,
    'Scholarship Report': <GraduationCap />,

    'Department Budget Usage': <BarChart3 />,
    'Department Expense': <PieChart />,

    'Total Monthly Payroll Gross': <Banknote />,
    'Faculty-to-Staff Cost Ratio': <Users />,
    'Benefits & Insurance Expense': <ShieldCheck />,
    'Student Employee Outlays': <GraduationCap />,
    'Overtime / Adjunct Premium': <Clock3 />,
    'Payroll Tax Liability Accrued': <Calculator />,
    'Average Labor Cost per Credit Hour': <BookOpen />,
    'Retirement Pool Funding Status': <PiggyBank />,

    'Total Accounts Payable': <CreditCard />,
    'Days Payable Outstanding': <Clock3 />,
    'Gross Purchases (MTD)': <ShoppingCart />,
    'Debit Note Returns': <RotateCcw />,
    'Purchase Orders Pending': <FileText />,
    'Early Payment Discounts': <BadgeCheck />,
    'Vendor Compliance Rate': <PackageCheck />,
    'Accrued Expenses': <Receipt />,
    'Cost of Goods Sold': <Boxes />,

    'Campus Facility Depreciation': <Building2 />,
    'Deferred Maintenance Liability': <Wrench />,
    'Equipment Replacement Fund': <HardHat />,
    'Capital Project Spending (YTD)': <Landmark />,
    'Fixed Asset Turnover': <RotateCcw />,
    'ROI on Capital Investments': <TrendingUp />,
    'Fleet Maintenance Cost': <Car />,
    'Space Utilization Yield': <LayoutDashboard />,

    'Accrued Sales Tax / VAT': <Calculator />,
    'Corporate Income Tax Provision': <Landmark />,
    'Withholding Tax Liability': <Receipt />,
    'Open Journal Adjustments': <BookOpen />,
    'Bank Reconciled Accounts': <BadgeCheck />,
    'Intercompany Balance': <Scale />,
    'Audit Exception Flags': <CircleAlert />,
    'Unposted Batch Vouchers': <FileCheck2 />,

    'Cash & Bank Balances': <Landmark />,
    'Petty Cash Pool': <Wallet />,
    'Total Working Capital': <Briefcase />,
    'Net Worth / Equity': <TrendingUp />,
    'Total Capital Employed': <Building2 />,
    'Undrawn Credit Lines': <CreditCard />,
    'Marketable Securities': <ChartNoAxesCombined />,
    'Restricted Cash Reserve': <PiggyBank />,
  };

  return iconMap[label] ?? <CircleDollarSign />;
}

function getKpiTone(label: string) {
  const normalizedLabel = label.toLowerCase();

  if (
    normalizedLabel.includes('income') ||
    normalizedLabel.includes('collection') ||
    normalizedLabel.includes('cash') ||
    normalizedLabel.includes('surplus') ||
    normalizedLabel.includes('roi')
  ) {
    return 'success';
  }

  if (
    normalizedLabel.includes('pending') ||
    normalizedLabel.includes('outstanding') ||
    normalizedLabel.includes('liabilit') ||
    normalizedLabel.includes('overdue') ||
    normalizedLabel.includes('exception')
  ) {
    return 'warning';
  }

  if (
    normalizedLabel.includes('expense') ||
    normalizedLabel.includes('expenditure') ||
    normalizedLabel.includes('cost') ||
    normalizedLabel.includes('tax')
  ) {
    return 'danger';
  }

  if (
    normalizedLabel.includes('scholarship') ||
    normalizedLabel.includes('student') ||
    normalizedLabel.includes('department')
  ) {
    return 'violet';
  }

  return 'primary';
}

function getChartIcon(title: string, type: ChartPanelProps['type']) {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes('scholarship')) {
    return <GraduationCap />;
  }

  if (
    normalizedTitle.includes('expense distribution') ||
    normalizedTitle.includes('clearance rates') ||
    type === 'pie' ||
    type === 'doughnut'
  ) {
    return <PieChart />;
  }

  if (
    normalizedTitle.includes('timeline') ||
    normalizedTitle.includes('trend') ||
    type === 'line'
  ) {
    return <LineChart />;
  }

  if (normalizedTitle.includes('compliance') || type === 'polarArea') {
    return <ShieldCheck />;
  }

  return <BarChart3 />;
}

function KpiGrid({ items }: { items: KpiItem[] }) {
  return (
    <div className="financial-command-kpi-grid">
      {items.map(item => {
        const kpiPath = `/finance-supply-chain/dashboard/${createKpiSlug(
          item.label
        )}`;

        return (
          <motion.div key={item.label} variants={itemVariants}>
            <Link
              aria-label={`Open ${item.label}`}
              className="financial-command-kpi-link"
              state={{
                title: item.label,
                value: item.value,
                change: item.change,
              }}
              to={kpiPath}
            >
              <article
                className={`financial-command-kpi-card financial-command-kpi-card--${getKpiTone(item.label)}`}
              >
                <div className="financial-command-kpi-top">
                  <span className="financial-command-kpi-icon">
                    {getKpiIcon(item.label)}
                  </span>
                  <p className="financial-command-kpi-label">{item.label}</p>
                </div>

                <div className="financial-command-kpi-footer">
                  <div className="financial-command-kpi-content">
                    <strong className="financial-command-kpi-value">
                      {item.value}
                    </strong>

                    <span
                      className={`financial-command-kpi-status financial-command-kpi-status--${item.status}`}
                    >
                      {item.change}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className="financial-command-kpi-arrow"
                  >
                    <ArrowRight />
                  </span>
                </div>
              </article>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

function ChartPanel({
  title,
  type,
  data,
  options,
  large = false,
}: ChartPanelProps) {
  return (
    <motion.div variants={itemVariants}>
      <FormCard>
        <div className="financial-command-chart-header">
          <div>
            <span className="financial-command-chart-eyebrow">
              Financial Analytics
            </span>
            <h2>{title}</h2>
          </div>
          <span className="financial-command-chart-icon">
            {getChartIcon(title, type)}
          </span>
        </div>

        <div
          className={
            large
              ? 'financial-command-chart financial-command-chart--large'
              : 'financial-command-chart'
          }
        >
          <Chart
            key={`${title}-${type}`}
            className="financial-command-prime-chart"
            data={data}
            options={options}
            type={type}
          />
        </div>
      </FormCard>
    </motion.div>
  );
}

export default function FinancialCommandCenter() {
  const isDark = useDashboardTheme();
  const [financialYear, setFinancialYear] = useState('2025-2026');
  const [universityType, setUniversityType] = useState<UniversityType>('gov');

  const activeUniversity = universityData[universityType];

  const chartTextColor = isDark ? '#d4d4d8' : '#475569';
  const chartMutedColor = isDark ? '#a1a1aa' : '#64748b';
  const chartGridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#eef2f7';

  const baseChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: chartTextColor,
            usePointStyle: true,
            boxWidth: 8,
            font: {
              size: 11,
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: chartMutedColor,
          },
          grid: {
            color: chartGridColor,
          },
        },
        y: {
          ticks: {
            color: chartMutedColor,
          },
          grid: {
            color: chartGridColor,
          },
        },
      },
    }),
    [chartGridColor, chartMutedColor, chartTextColor]
  );

  const monthlyTrendData = useMemo(
    () => ({
      labels: fiscalMonths,
      datasets: [
        {
          label: 'Monthly Income',
          data: activeUniversity.monthlyIncome,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: 'Monthly Expenditure',
          data: activeUniversity.monthlyExpense,
          borderColor: '#f43f5e',
          backgroundColor: 'rgba(244, 63, 94, 0.06)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    }),
    [activeUniversity]
  );

  const frameworkData = useMemo(
    () => ({
      labels: activeUniversity.labels,
      datasets: [
        {
          label: 'Budget Targets',
          data: activeUniversity.budget,
          backgroundColor: '#cbd5e1',
          borderRadius: 6,
        },
        {
          label: 'Realized Outlays',
          data: activeUniversity.actual,
          backgroundColor: '#3b82f6',
          borderRadius: 6,
        },
      ],
    }),
    [activeUniversity]
  );

  const departmentBudgetData = useMemo(
    () => ({
      labels: activeUniversity.departmentNames,
      datasets: [
        {
          label: 'Allocated Limit',
          data: activeUniversity.departmentAllocation,
          backgroundColor: '#94a3b8',
          borderRadius: 6,
        },
        {
          label: 'Actual Expense',
          data: activeUniversity.departmentSpent,
          backgroundColor: '#6366f1',
          borderRadius: 6,
        },
      ],
    }),
    [activeUniversity]
  );

  const departmentUsageData = useMemo(
    () => ({
      labels: activeUniversity.departmentNames,
      datasets: [
        {
          label: 'Budget Utilization (%)',
          data: activeUniversity.departmentUsagePercentage,
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ec4899',
            '#ef4444',
          ],
          borderRadius: 6,
        },
      ],
    }),
    [activeUniversity]
  );

  const departmentUsageOptions = useMemo(
    () => ({
      ...baseChartOptions,
      indexAxis: 'y',
      scales: {
        x: {
          ticks: {
            color: chartMutedColor,
            callback: (value: number | string) => `${value}%`,
          },
          grid: {
            color: chartGridColor,
          },
        },
        y: {
          ticks: {
            color: chartMutedColor,
          },
          grid: {
            display: false,
          },
        },
      },
    }),
    [baseChartOptions, chartGridColor, chartMutedColor]
  );

  const departmentExpenseData = useMemo(
    () => ({
      labels: activeUniversity.departmentNames,
      datasets: [
        {
          data: activeUniversity.departmentSpent,
          backgroundColor: [
            '#6366f1',
            '#14b8a6',
            '#f43f5e',
            '#a855f7',
            '#06b6d4',
          ],
          hoverOffset: 6,
        },
      ],
    }),
    [activeUniversity]
  );

  const pieChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: chartTextColor,
            usePointStyle: true,
            boxWidth: 8,
            padding: 16,
            font: {
              size: 11,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
    }),
    [chartTextColor]
  );

  const doughnutChartOptions = useMemo(
    () => ({
      ...pieChartOptions,
      cutout: '58%',
    }),
    [pieChartOptions]
  );

  const scholarshipReceiptsData = useMemo(
    () => ({
      labels: [
        'NSP Central SC',
        'MP State Medhavi',
        'NSP ST Scheme',
        'MAHA DBT OBC',
      ],
      datasets: [
        {
          data: [28, 42, 20, 10],
          backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
          hoverOffset: 6,
        },
      ],
    }),
    []
  );

  const dbtProgressData = useMemo(
    () => ({
      labels: [
        'Aadhaar Seeded',
        'Verification Done',
        'Requisition Generated',
        'DBT Credited',
      ],
      datasets: [
        {
          label: 'Completion Rate (%)',
          data: [92, 85, 60, 45],
          backgroundColor: '#3b82f6',
          borderRadius: 6,
        },
      ],
    }),
    []
  );

  const scholarshipAllocationData = useMemo(
    () => ({
      labels: [
        'Central SC/ST',
        'State Schemes',
        'University Merit Pool',
        'Private Endowments',
      ],
      datasets: [
        {
          label: 'Allocation (₹ in Lakhs)',
          data: [20.5, 18.4, 4.5, 2.4],
          backgroundColor: '#10b981',
          borderRadius: 6,
        },
      ],
    }),
    []
  );

  const clearanceRateData = useMemo(
    () => ({
      labels: [
        'APBS Bridge',
        'NEFT Direct',
        'State Push',
        'Manual Requisition',
      ],
      datasets: [
        {
          data: [28, 27, 24, 21],
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
          hoverOffset: 6,
        },
      ],
    }),
    []
  );

  const percentageBarOptions = useMemo(
    () => ({
      ...baseChartOptions,
      scales: {
        x: {
          ticks: {
            color: chartMutedColor,
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: chartMutedColor,
            callback: (value: number | string) => `${value}%`,
          },
          grid: {
            color: chartGridColor,
          },
        },
      },
    }),
    [baseChartOptions, chartGridColor, chartMutedColor]
  );

  return (
    <FormPage
      title="Executive Financial Command"
      description="Cross-ledger institutional accounting matrices and visual intelligence modules."
    >
      <motion.div
        animate="visible"
        className="financial-command-page"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.div
          className="financial-command-toolbar"
          variants={itemVariants}
        >
          <div className="financial-command-year-field">
            <label htmlFor="financial-year">Financial Year</label>
            <Dropdown
              className="financial-command-year-dropdown"
              inputId="financial-year"
              onChange={event => setFinancialYear(event.value)}
              options={financialYearOptions}
              value={financialYear}
            />
          </div>

          <span className="financial-command-counter">
            Active Tracking: 83 Metrics
          </span>
        </motion.div>

        <div className="financial-command-tab-content">
          <motion.section
            className="financial-command-kpi-section"
            variants={itemVariants}
          >
            <div className="financial-command-section-heading">
              <div>
                <span>Financial Overview</span>
                <h2>Executive Budgets, Allocations & Utilizations</h2>
              </div>
              <WalletCards />
            </div>

            <KpiGrid items={activeUniversity.executiveKpis} />
          </motion.section>

          <motion.section
            className="financial-command-kpi-section financial-command-kpi-section--secondary"
            variants={itemVariants}
          >
            <div className="financial-command-section-heading">
              <div>
                <span>Operational Control</span>
                <h2>Operations, Liabilities & Verification Controls</h2>
              </div>
              <ShieldCheck />
            </div>

            <KpiGrid items={activeUniversity.operationsKpis} />
          </motion.section>

          <motion.div
            className="financial-command-filter-panel"
            variants={itemVariants}
          >
            <div>
              <p className="financial-command-filter-label">
                University Financial Model
              </p>
              <p className="financial-command-filter-help">
                Switch the institutional model to compare financial behavior.
              </p>
            </div>

            <div className="financial-command-model-toggle">
              <button
                className={`financial-command-model-button ${
                  universityType === 'gov'
                    ? 'financial-command-model-button--active'
                    : ''
                }`}
                onClick={() => setUniversityType('gov')}
                type="button"
              >
                Government Model
              </button>

              <button
                className={`financial-command-model-button ${
                  universityType === 'private'
                    ? 'financial-command-model-button--active'
                    : ''
                }`}
                onClick={() => setUniversityType('private')}
                type="button"
              >
                Private Model
              </button>
            </div>
          </motion.div>

          <div className="financial-command-chart-full">
            <ChartPanel
              data={monthlyTrendData}
              large
              options={baseChartOptions}
              title="Month-wise Income vs Expenditure Financial Year Timeline"
              type="line"
            />
          </div>

          <div className="financial-command-chart-grid">
            <ChartPanel
              data={frameworkData}
              options={baseChartOptions}
              title="Global Income & Expenditure Allocation Framework"
              type="bar"
            />

            <ChartPanel
              data={departmentBudgetData}
              options={baseChartOptions}
              title="Department-wise Budget Targets vs Actual Expense"
              type="bar"
            />
          </div>

          <div className="financial-command-chart-grid">
            <ChartPanel
              data={departmentUsageData}
              options={departmentUsageOptions}
              title="Department-wise Budget Usage (%)"
              type="bar"
            />

            <ChartPanel
              data={departmentExpenseData}
              options={doughnutChartOptions}
              title="Department-wise Expense Distribution"
              type="doughnut"
            />
          </div>

          <motion.div
            className="financial-command-section-banner"
            variants={itemVariants}
          >
            <div>
              <span>Student Finance</span>
              <h2>Scholarship & DBT Analytics</h2>
              <p>
                Portal-wise receipts, execution progress, allocation and
                disbursement clearance.
              </p>
            </div>
            <BadgeIndianRupee />
          </motion.div>

          <div className="financial-command-chart-grid">
            <ChartPanel
              data={scholarshipReceiptsData}
              options={doughnutChartOptions}
              title="Scholarship Receipts Distribution by Portal"
              type="doughnut"
            />

            <ChartPanel
              data={dbtProgressData}
              options={percentageBarOptions}
              title="DBT Execution Progress Rates"
              type="bar"
            />
          </div>

          <div className="financial-command-chart-grid">
            <ChartPanel
              data={scholarshipAllocationData}
              options={baseChartOptions}
              title="Scholarship Allocations by Source Agency"
              type="bar"
            />

            <ChartPanel
              data={clearanceRateData}
              options={pieChartOptions}
              title="Disbursement Clearance Rates (APBS vs NEFT)"
              type="pie"
            />
          </div>
        </div>
      </motion.div>
    </FormPage>
  );
}
