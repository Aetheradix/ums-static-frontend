import { useFeeStore } from '../store/useFeeStore';
import { FormPage } from 'shared/new-components';
import { useNavigate } from 'react-router-dom';

interface KpiCardProps {
  title: string;
  value: string;
  subValue: string;
  subValueColor?: string;
  icon: string;
  iconBgColor: string;
  iconTextColor: string;
  bgSvg?: React.ReactNode;
}

function KpiCard({
  title,
  value,
  subValue,
  subValueColor = 'text-gray-500',
  icon,
  iconBgColor,
  iconTextColor,
  bgSvg,
}: KpiCardProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between hover:shadow-md transition-all relative overflow-hidden group">
      <div className="flex flex-col gap-1 z-10">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        <span className="text-xl font-black text-gray-800">{value}</span>
        <span className={`text-[10px] ${subValueColor}`}>{subValue}</span>
      </div>
      {bgSvg && (
        <div className="absolute right-2 bottom-2 opacity-10 group-hover:scale-110 transition-transform">
          {bgSvg}
        </div>
      )}
      <div className={`p-2.5 ${iconBgColor} ${iconTextColor} rounded-xl`}>
        <i className={`pi pi-${icon} text-sm`} />
      </div>
    </div>
  );
}

interface CourseGaugeProps {
  name: string;
  code: string;
  percentage: number;
  gross: number;
  collected: number;
  color: {
    stroke: string;
    bg: string;
    text: string;
    circle: string;
  };
}

function CourseGauge({
  name,
  code,
  percentage,
  gross,
  collected,
  color,
}: CourseGaugeProps) {
  const strokeWidth = 10;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-4 border border-gray-100 bg-gray-50/50 rounded-xl shadow-inner group hover:bg-white hover:border-gray-200 transition-all">
      <span className="text-xs font-black text-gray-700 text-center mb-1 truncate w-full">
        {name}
      </span>
      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-3">
        {code}
      </span>

      {/* Ring SVG */}
      <div className="relative flex items-center justify-center w-28 h-28">
        <svg className="w-full h-full rotate-[-90deg]">
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="transparent"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="transparent"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-black text-gray-800">
            {percentage}%
          </span>
          <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">
            Cleared
          </span>
        </div>
      </div>

      <div className="w-full mt-3 flex justify-between text-[10px] text-gray-500 border-t pt-2.5">
        <div className="flex flex-col">
          <span>Due Amount</span>
          <span className="font-extrabold text-gray-800">
            ₹{gross.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span>Collected</span>
          <span className={`font-extrabold ${color.text}`}>
            ₹{collected.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    demands,
    receipts,
    scholarships,
    concessions,
    failedTransactions,
    refunds,
    students,
    courses,
    feeHeads,
    feeStructures,
  } = useFeeStore();

  // 1. KPI Calculations
  const grossBilled = demands.reduce((acc, cur) => acc + cur.totalFee, 0);
  const realizedRevenue = receipts.reduce(
    (acc, cur) => acc + cur.amountPaid,
    0
  );

  const scholarshipOffsets = demands.reduce(
    (acc, cur) => acc + cur.scholarshipAmount,
    0
  );
  const concessionOffsets = demands.reduce(
    (acc, cur) => acc + cur.concessionAmount,
    0
  );
  const totalAdjustments = scholarshipOffsets + concessionOffsets;

  const outstandingReceivable = demands
    .filter(d => d.status === 'Unpaid')
    .reduce((acc, cur) => acc + cur.payableAmount, 0);

  // 2. Pending Actions Counts
  const pendingSchol = scholarships.filter(
    s => s.status === 'Pending' || s.status === 'Verified'
  ).length;
  const pendingConc = concessions.filter(
    c => c.status === 'Pending' || c.status === 'Verified'
  ).length;
  const pendingRef = refunds.filter(r => r.status !== 'Completed').length;
  const unresolvedTxns = failedTransactions.filter(
    f => f.status === 'Failed'
  ).length;

  // 3. Collection percentages
  const netDue = Math.max(0, grossBilled - totalAdjustments);
  const collectionPercentage =
    netDue > 0 ? Math.round((realizedRevenue / netDue) * 100) : 0;
  const outstandingPercentage =
    netDue > 0 ? Math.round((outstandingReceivable / netDue) * 100) : 0;
  const adjustmentPercentage =
    grossBilled > 0 ? Math.round((totalAdjustments / grossBilled) * 100) : 0;

  // 4. Course Performance Analysis
  const courseAnalysis = courses.map((course, idx) => {
    const studentIds = students
      .filter(s => s.courseId === course.id)
      .map(s => s.id);
    const courseDemands = demands.filter(d => studentIds.includes(d.studentId));
    const gross = courseDemands.reduce((acc, cur) => acc + cur.totalFee, 0);
    const courseReceipts = receipts.filter(r =>
      studentIds.includes(r.studentId)
    );
    const collected = courseReceipts.reduce(
      (acc, cur) => acc + cur.amountPaid,
      0
    );

    const colors = [
      {
        stroke: '#0D9488',
        bg: 'bg-teal-500',
        text: 'text-teal-700',
        circle: 'stroke-teal-500',
      },
      {
        stroke: '#D97706',
        bg: 'bg-amber-500',
        text: 'text-amber-700',
        circle: 'stroke-amber-500',
      },
      {
        stroke: '#4F46E5',
        bg: 'bg-indigo-500',
        text: 'text-indigo-700',
        circle: 'stroke-indigo-500',
      },
    ];
    const color = colors[idx % colors.length];
    const percentage = gross > 0 ? Math.round((collected / gross) * 100) : 0;

    return {
      name: course.name,
      code: course.code,
      gross,
      collected,
      percentage,
      color,
    };
  });

  // 5. Fee Head Wise breakdown calculation
  const feeHeadTotals: { [key: string]: number } = {};
  feeStructures.forEach(struct => {
    struct.heads.forEach(h => {
      const headObj = feeHeads.find(fh => fh.id === h.feeHeadId);
      if (headObj) {
        feeHeadTotals[headObj.name] =
          (feeHeadTotals[headObj.name] || 0) + h.amount;
      }
    });
  });

  const colorsPalette = [
    '#0D9488',
    '#D97706',
    '#4F46E5',
    '#EC4899',
    '#3B82F6',
    '#EF4444',
    '#8B5CF6',
  ];
  const feeHeadBreakdown = Object.entries(feeHeadTotals).map(
    ([name, amount], index) => {
      return {
        name,
        amount,
        color: colorsPalette[index % colorsPalette.length],
      };
    }
  );

  // 6. Channel distribution count
  const upiTotal = receipts
    .filter(r => r.paymentMode === 'UPI')
    .reduce((sum, r) => sum + r.amountPaid, 0);
  const netBankTotal = receipts
    .filter(r => r.paymentMode === 'Net Banking')
    .reduce((sum, r) => sum + r.amountPaid, 0);
  const cashTotal = receipts
    .filter(r => r.paymentMode === 'Cash' || r.paymentMode === 'Draft')
    .reduce((sum, r) => sum + r.amountPaid, 0);
  const grandReceipt = realizedRevenue || 1;

  const upiPercent = Math.round((upiTotal / grandReceipt) * 100) || 60;
  const netBankPercent = Math.round((netBankTotal / grandReceipt) * 100) || 30;
  const cashPercent = Math.round((cashTotal / grandReceipt) * 100) || 10;

  return (
    <FormPage
      title="Fee Management Dashboard"
      description="Visual administrative monitoring center. Comprehensive graphical analysis of fee collections, distributions, and pipelines."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Main Trends, KPI gauges, & Pipeline Flow (Colspan 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Row 1: KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard
              title="Gross Billed"
              value={`₹${grossBilled.toLocaleString()}`}
              subValue="Demands Raised"
              icon="wallet"
              iconBgColor="bg-blue-50"
              iconTextColor="text-blue-600"
              bgSvg={
                <svg
                  className="w-16 h-16 text-blue-500"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <rect x="10" y="20" width="80" height="60" rx="10" />
                  <circle cx="50" cy="50" r="15" fill="white" />
                </svg>
              }
            />

            <KpiCard
              title="Realized Revenue"
              value={`₹${realizedRevenue.toLocaleString()}`}
              subValue={`${collectionPercentage}% Clearing Rate`}
              subValueColor="text-green-600 font-semibold"
              icon="check-circle"
              iconBgColor="bg-green-50"
              iconTextColor="text-green-600"
              bgSvg={
                <svg
                  className="w-16 h-16 text-green-500"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <circle cx="50" cy="50" r="40" />
                  <path
                    d="M35 50 L45 60 L65 40"
                    stroke="white"
                    strokeWidth="10"
                    fill="none"
                  />
                </svg>
              }
            />

            <KpiCard
              title="Scholarships & Aid"
              value={`₹${totalAdjustments.toLocaleString()}`}
              subValue={`${adjustmentPercentage}% Offset Rate`}
              subValueColor="text-purple-500 font-medium"
              icon="percentage"
              iconBgColor="bg-purple-50"
              iconTextColor="text-purple-600"
              bgSvg={
                <svg
                  className="w-16 h-16 text-purple-500"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <polygon points="50,15 15,35 50,55 85,35" />
                  <line
                    x1="50"
                    y1="55"
                    x2="50"
                    y2="85"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                </svg>
              }
            />

            <KpiCard
              title="Outstanding Dues"
              value={`₹${outstandingReceivable.toLocaleString()}`}
              subValue={`${outstandingPercentage}% Remaining`}
              subValueColor="text-red-500 font-medium"
              icon="exclamation-triangle"
              iconBgColor="bg-red-50"
              iconTextColor="text-red-600"
              bgSvg={
                <svg
                  className="w-16 h-16 text-red-500"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <path d="M50 15 L85 80 L15 80 Z" />
                  <circle cx="50" cy="70" r="5" fill="white" />
                </svg>
              }
            />
          </div>

          {/* Graphical Widget 1: Multi-Line Collection Trend Line Chart */}
          <div className="bg-white p-5 border border-gray-150 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Seasonal Collection Trends (Multi-Channel)
                </h3>
                <div className="flex gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>{' '}
                    Online Gateway
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>{' '}
                    Direct Bank
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>{' '}
                    Counter Cash
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                Monthly receipt run across payment avenues (Jan - Jun)
              </span>
            </div>

            <div className="py-6">
              <svg
                className="w-full h-52"
                viewBox="0 0 500 120"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Gradients */}
                  <linearGradient id="online-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="bank-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="cash-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Grid Lines */}
                <line
                  x1="0"
                  y1="20"
                  x2="500"
                  y2="20"
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="55"
                  x2="500"
                  y2="55"
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="90"
                  x2="500"
                  y2="90"
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="110"
                  x2="500"
                  y2="110"
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                />

                {/* Line 1: Online Gateway (Teal/Emerald) */}
                <path
                  d="M 0,105 Q 80,60 165,75 T 330,40 T 490,20 L 490,110 L 0,110 Z"
                  fill="url(#online-grad)"
                />
                <path
                  d="M 0,105 Q 80,60 165,75 T 330,40 T 490,20"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                />

                {/* Line 2: Direct Bank (Indigo) */}
                <path
                  d="M 0,110 Q 75,80 160,90 T 320,65 T 490,45 L 490,110 L 0,110 Z"
                  fill="url(#bank-grad)"
                />
                <path
                  d="M 0,110 Q 75,80 160,90 T 320,65 T 490,45"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                />

                {/* Line 3: Counter Cash (Amber) */}
                <path
                  d="M 0,110 Q 70,95 155,100 T 310,85 T 490,75 L 490,110 L 0,110 Z"
                  fill="url(#cash-grad)"
                />
                <path
                  d="M 0,110 Q 70,95 155,100 T 310,85 T 490,75"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                />

                {/* Points on Line 1 (Online) */}
                <circle
                  cx="165"
                  cy="75"
                  r="3.5"
                  fill="#10B981"
                  stroke="#FFF"
                  strokeWidth="1.5"
                />
                <circle
                  cx="330"
                  cy="40"
                  r="3.5"
                  fill="#10B981"
                  stroke="#FFF"
                  strokeWidth="1.5"
                />
                <circle
                  cx="490"
                  cy="20"
                  r="3.5"
                  fill="#10B981"
                  stroke="#FFF"
                  strokeWidth="1.5"
                />
              </svg>

              <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 px-1">
                <span>JAN</span>
                <span>FEB</span>
                <span>MAR</span>
                <span>APR</span>
                <span>MAY</span>
                <span>JUN (CURRENT RUN)</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs border-t pt-3 mt-1">
              <span className="text-gray-500">
                📈 Total Realized receipts this season:{' '}
                <span className="font-extrabold text-gray-800">
                  ₹{realizedRevenue.toLocaleString()}
                </span>
              </span>
              <span className="text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                <i className="pi pi-arrow-up-right text-[10px]" /> +18.4% YoY
                Growth
              </span>
            </div>
          </div>

          {/* Graphical Widget 2: Stream Performance Circular Gauge Rings */}
          <div className="bg-white p-5 border border-gray-150 rounded-2xl shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Academic Stream Realization Metrics
              </h3>
              <span className="text-xs text-gray-400">
                Total collections progress mapped side-by-side
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courseAnalysis.map((item, idx) => (
                <CourseGauge
                  key={idx}
                  name={item.name}
                  code={item.code}
                  percentage={item.percentage}
                  gross={item.gross}
                  collected={item.collected}
                  color={item.color}
                />
              ))}
            </div>
          </div>

          {/* Graphical Widget 3: Transaction Pipeline Stages Flowchart */}
          <div className="bg-white p-5 border border-gray-150 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">
                Fee Settlement Pipeline Flow
              </h3>
              <span className="text-xs text-gray-400">
                Chronological states of active invoice transactions
              </span>
            </div>

            <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 py-6 px-4">
              {/* Flow Line */}
              <div className="absolute top-[37px] left-10 right-10 h-0.5 bg-gradient-to-r from-blue-300 via-indigo-300 to-green-300 hidden md:block z-0" />

              {/* Stage 1: Demand Raised */}
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <i className="pi pi-wallet text-lg" />
                </div>
                <span className="text-xs font-black text-gray-800 mt-2">
                  1. Invoiced
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                  {demands.length} Ledger Demands
                </span>
              </div>

              {/* Stage 2: Gateway Initiated */}
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg">
                  <i className="pi pi-sync text-lg" />
                </div>
                <span className="text-xs font-black text-gray-800 mt-2">
                  2. Processing
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                  Bank API Syncing
                </span>
              </div>

              {/* Stage 3: Realized */}
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg">
                  <i className="pi pi-check-circle text-lg" />
                </div>
                <span className="text-xs font-black text-gray-800 mt-2">
                  3. Settled
                </span>
                <span className="text-[10px] text-green-700 mt-0.5 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                  {receipts.length} Receipts Generated
                </span>
              </div>

              {/* Stage 4: Failed Exceptions */}
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg">
                  <i className="pi pi-exclamation-triangle text-lg" />
                </div>
                <span className="text-xs font-black text-gray-800 mt-2">
                  4. Disputed
                </span>
                <span className="text-[10px] text-red-600 mt-0.5 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                  {unresolvedTxns} Failed Items
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Spoke wheel, channels split ring, action controls (Colspan 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Graphical Widget 4: Allocation Donut Ring */}
          <div className="bg-white p-5 border border-gray-150 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">
                Financial Allocation Share
              </h3>
              <span className="text-xs text-gray-400">
                Breakdown of gross invoiced billing
              </span>
            </div>

            <div className="flex justify-center items-center py-6 relative">
              <svg className="w-40 h-40" viewBox="0 0 36 36">
                {/* Background Ring */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="4.5"
                />
                {/* Realized (Green): collectionPercentage */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="4.5"
                  strokeDasharray={`${collectionPercentage} ${100 - collectionPercentage}`}
                  strokeDashoffset="25"
                />
                {/* Outstanding (Red): outstandingPercentage */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="4.5"
                  strokeDasharray={`${outstandingPercentage} ${100 - outstandingPercentage}`}
                  strokeDashoffset={25 - collectionPercentage}
                />
                {/* Adjustments (Purple): adjustmentPercentage */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="4.5"
                  strokeDasharray={`${adjustmentPercentage} ${100 - adjustmentPercentage}`}
                  strokeDashoffset={
                    25 - collectionPercentage - outstandingPercentage
                  }
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-gray-800">
                  {collectionPercentage}%
                </span>
                <span className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">
                  Collected
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 border-t pt-4 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>{' '}
                  Realized Revenue
                </span>
                <span className="font-extrabold text-green-700">
                  ₹{realizedRevenue.toLocaleString()} ({collectionPercentage}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>{' '}
                  Outstanding Receivable
                </span>
                <span className="font-extrabold text-red-600">
                  ₹{outstandingReceivable.toLocaleString()} (
                  {outstandingPercentage}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>{' '}
                  Scholarships & Offsets
                </span>
                <span className="font-extrabold text-purple-700">
                  ₹{totalAdjustments.toLocaleString()} ({adjustmentPercentage}%)
                </span>
              </div>
            </div>
          </div>

          {/* Graphical Widget 5: Fee Head Wise Breakdown Spoke Chart (Polar Rose Bar layout) */}
          <div className="bg-white p-5 border border-gray-150 rounded-2xl shadow-sm flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">
                Fee Head Allocation Share
              </h3>
              <span className="text-xs text-gray-400">
                Total ledger values per fee configuration head
              </span>
            </div>

            <div className="flex flex-col gap-3 py-1">
              {feeHeadBreakdown.length > 0 ? (
                feeHeadBreakdown.map((head, idx) => {
                  const maxAmt = Math.max(
                    ...feeHeadBreakdown.map(h => h.amount),
                    1
                  );
                  const barWidth = Math.round((head.amount / maxAmt) * 100);

                  return (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] font-bold text-gray-600">
                        <span>{head.name}</span>
                        <span className="font-black text-gray-800">
                          ₹{head.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: head.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-gray-400">
                  No structure data compiled
                </div>
              )}
            </div>
          </div>

          {/* Graphical Widget 6: Channel Settlement Distribution */}
          <div className="bg-white p-5 border border-gray-150 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">
                Gateway Settlement Channels
              </h3>
              <span className="text-xs text-gray-400">
                Percentage distribution of collection receipts
              </span>
            </div>

            <div className="flex items-center justify-around gap-2 py-4">
              {/* Pie/Donut Segment Ring */}
              <svg className="w-24 h-24 rotate-[-90deg]" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#0D9488"
                  strokeWidth="5.5"
                  strokeDasharray={`${upiPercent} 100`}
                  strokeDashoffset="0"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="5.5"
                  strokeDasharray={`${netBankPercent} 100`}
                  strokeDashoffset={-upiPercent}
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="5.5"
                  strokeDasharray={`${cashPercent} 100`}
                  strokeDashoffset={-upiPercent - netBankPercent}
                />
              </svg>

              <div className="flex flex-col gap-2 text-[10px] font-extrabold text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-teal-600 rounded-sm"></span> UPI (
                  {upiPercent}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-amber-600 rounded-sm"></span> Net
                  Banking ({netBankPercent}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-indigo-600 rounded-sm"></span>{' '}
                  Cash/Draft ({cashPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Graphical Widget 7: Operations Action Alerts Centre (Zero plain text grids!) */}
          <div className="bg-white p-5 border border-gray-150 rounded-2xl shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Pending Operations Queue
              </h3>
              <span className="text-xs text-gray-400">
                Verify, check, or reconcile pending flows
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Alert 1 */}
              <div
                className="bg-amber-50 hover:bg-amber-100/70 border border-amber-200 rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-between group"
                onClick={() => navigate('/master/admission-fee/scholarship')}
              >
                <div className="w-9 h-9 bg-amber-500 text-white rounded-full flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-sm">
                  <i className="pi pi-workspace_premium text-sm" />
                </div>
                <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider block">
                  Schol Claims
                </span>
                <span className="text-lg font-black text-amber-700 mt-1">
                  {pendingSchol} Pending
                </span>
              </div>

              {/* Alert 2 */}
              <div
                className="bg-teal-50 hover:bg-teal-100/70 border border-teal-200 rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-between group"
                onClick={() => navigate('/master/admission-fee/concession')}
              >
                <div className="w-9 h-9 bg-teal-600 text-white rounded-full flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-sm">
                  <i className="pi pi-local_offer text-sm" />
                </div>
                <span className="text-[9px] font-extrabold text-teal-800 uppercase tracking-wider block">
                  Concessions
                </span>
                <span className="text-lg font-black text-teal-700 mt-1">
                  {pendingConc} Pending
                </span>
              </div>

              {/* Alert 3 */}
              <div
                className="bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200 rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-between group"
                onClick={() => navigate('/master/admission-fee/refunds')}
              >
                <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-sm">
                  <i className="pi pi-undo text-sm" />
                </div>
                <span className="text-[9px] font-extrabold text-indigo-800 uppercase tracking-wider block">
                  Active Refunds
                </span>
                <span className="text-lg font-black text-indigo-700 mt-1">
                  {pendingRef} Open
                </span>
              </div>

              {/* Alert 4 */}
              <div
                className="bg-rose-50 hover:bg-rose-100/70 border border-rose-200 rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-between group"
                onClick={() =>
                  navigate('/master/admission-fee/failed-transactions')
                }
              >
                <div className="w-9 h-9 bg-rose-500 text-white rounded-full flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-sm">
                  <i className="pi pi-error text-sm" />
                </div>
                <span className="text-[9px] font-extrabold text-rose-800 uppercase tracking-wider block">
                  Failed Txns
                </span>
                <span className="text-lg font-black text-rose-700 mt-1">
                  {unresolvedTxns} Unsolved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
