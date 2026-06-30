import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'shared/components/Icon/Icon';
import { FormCard, FormPage } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { InfoBanner } from '../../components';
import { mockDepartments, mockFileMovements, mockFiles } from '../../data';

export default function FMTSAdminDashboard() {
  const navigate = useNavigate();

  const totalFiles = mockFiles.length;
  const pendingFiles = mockFiles.filter(
    f => f.currentStatus === 'Under Review' || f.currentStatus === 'Forwarded'
  );
  const approvedFiles = mockFiles.filter(
    f => f.currentStatus === 'Approved' || f.currentStatus === 'Closed'
  );
  const overdueFiles = mockFiles.filter(
    f =>
      f.dueDate &&
      new Date(f.dueDate) < new Date() &&
      !['Closed', 'Archived', 'Approved'].includes(f.currentStatus)
  );
  const rejectedCount = mockFiles.filter(
    f => f.currentStatus === 'Rejected'
  ).length;

  const statusLabels = [
    'Draft',
    'Submitted',
    'Under Review',
    'Forwarded',
    'Approved',
    'Rejected',
    'Closed',
    'Archived',
  ];
  const statusCounts = statusLabels.map(
    s => mockFiles.filter(f => f.currentStatus === s).length
  );
  const statusColors = [
    'rgba(148,163,184,0.8)',
    'rgba(96,165,250,0.8)',
    'rgba(251,191,36,0.8)',
    'rgba(129,140,248,0.8)',
    'rgba(52,211,153,0.8)',
    'rgba(248,113,113,0.8)',
    'rgba(156,163,175,0.8)',
    'rgba(167,139,250,0.8)',
  ];

  const deptLabels = mockDepartments.filter(d => d.isActive).map(d => d.name);
  const deptCounts = deptLabels.map(
    d => mockFiles.filter(f => f.departmentName === d).length
  );
  const deptColors = [
    'rgba(99,102,241,0.8)',
    'rgba(16,185,129,0.8)',
    'rgba(245,158,11,0.8)',
    'rgba(236,72,153,0.8)',
    'rgba(168,85,247,0.8)',
    'rgba(251,146,60,0.8)',
  ];

  const recentMovements = [...mockFileMovements]
    .sort(
      (a, b) =>
        new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime()
    )
    .slice(0, 6);

  // Action distribution for pie chart
  const actionCounts: Record<string, number> = {};
  mockFileMovements.forEach(m => {
    actionCounts[m.action] = (actionCounts[m.action] || 0) + 1;
  });
  const actionColors = [
    'rgba(16,185,129,0.85)',
    'rgba(239,68,68,0.85)',
    'rgba(59,130,246,0.85)',
    'rgba(245,158,11,0.85)',
    'rgba(168,85,247,0.85)',
    'rgba(236,72,153,0.85)',
  ];

  // Daily file movement trend
  const dateGroups: Record<string, number> = {};
  mockFileMovements.forEach(m => {
    const date = m.actionDate.split('T')[0];
    dateGroups[date] = (dateGroups[date] || 0) + 1;
  });
  const sortedDates = Object.keys(dateGroups).sort();

  const statusBarData = {
    labels: statusLabels,
    datasets: [
      {
        label: 'Files',
        data: statusCounts,
        backgroundColor: statusColors,
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const statusBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.9)',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 10, weight: '500' } },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#94a3b8', font: { size: 11 } },
        grid: { color: 'rgba(148,163,184,0.08)', drawBorder: false },
        border: { display: false },
      },
    },
  };

  const deptBarData = {
    labels: deptLabels,
    datasets: [
      {
        label: 'Files',
        data: deptCounts,
        backgroundColor: deptColors.slice(0, deptLabels.length),
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const deptBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.9)',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#94a3b8', font: { size: 11 } },
        grid: { color: 'rgba(148,163,184,0.08)', drawBorder: false },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11, weight: '500' } },
        border: { display: false },
      },
    },
  };

  const actionPieData = {
    labels: Object.keys(actionCounts),
    datasets: [
      {
        data: Object.values(actionCounts),
        backgroundColor: actionColors.slice(
          0,
          Object.keys(actionCounts).length
        ),
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const actionPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          font: { size: 11, weight: '500' },
          color: '#64748b',
          padding: 14,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.9)',
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const trendData = {
    labels: sortedDates.map(d => {
      const dt = new Date(d);
      return `${dt.getDate()}/${dt.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: 'Daily Activity',
        data: sortedDates.map(d => dateGroups[d]),
        borderColor: 'rgba(99,102,241,0.8)',
        backgroundColor: 'rgba(99,102,241,0.06)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(99,102,241,1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        borderWidth: 2.5,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.9)',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#94a3b8', font: { size: 11 } },
        grid: { color: 'rgba(148,163,184,0.08)', drawBorder: false },
        border: { display: false },
      },
      x: {
        ticks: { color: '#64748b', font: { size: 10 } },
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  const completionRate =
    totalFiles > 0 ? Math.round((approvedFiles.length / totalFiles) * 100) : 0;

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Admin' },
        { label: 'File Management Dashboard' },
      ]}
      title="File Management Dashboard"
      description="System-wide overview of eFile tracking, approvals, and compliance"
    >
      <InfoBanner
        title="About File Management Dashboard"
        message="Get a bird's-eye view of system-wide file tracking, overdue items, and key operational metrics."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Files"
          value={totalFiles}
          icon="folder"
          colorScheme="blue"
          subtitle="Across all departments"
          trend={{ value: 12, direction: 'up', label: 'vs last month' }}
        />
        <StatCard
          title="Pending"
          value={pendingFiles.length}
          icon="hourglass_empty"
          colorScheme="orange"
          subtitle="Awaiting action"
          trend={{ value: 5, direction: 'down', label: 'vs last week' }}
        />
        <StatCard
          title="Approved / Closed"
          value={approvedFiles.length}
          icon="check_circle"
          colorScheme="green"
          subtitle="Fully processed"
          trend={{ value: 8, direction: 'up', label: 'clearance rate' }}
        />
        <StatCard
          title="Overdue"
          value={overdueFiles.length}
          icon="warning"
          colorScheme="red"
          subtitle="Requires attention"
          trend={{ value: 2, direction: 'up', label: 'escalated' }}
        />
      </div>

      {/* Completion Rate Banner */}
      <div
        className={`rounded-2xl p-5 mb-8 flex items-center gap-5 ${
          completionRate >= 70
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
            : completionRate >= 40
              ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
              : 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200'
        }`}
      >
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
            completionRate >= 70
              ? 'bg-emerald-100 text-emerald-700'
              : completionRate >= 40
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'
          }`}
        >
          <span className="text-2xl font-black">{completionRate}%</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-base">
            File Completion Rate
          </h4>
          <p className="text-sm text-gray-600 mt-0.5">
            {approvedFiles.length} of {totalFiles} files fully processed.{' '}
            {pendingFiles.length} pending, {rejectedCount} rejected,{' '}
            {overdueFiles.length} overdue.
          </p>
          <div className="w-full bg-white/60 rounded-full h-2.5 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Activity Trend */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-80" />
        <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Icon name="timeline" className="text-[18px]" />
          </div>
          Activity Trend
          <span className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            Daily Movements
          </span>
        </h3>
        <div className="w-full h-56">
          <Chart
            type="line"
            data={trendData}
            options={trendOptions}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
              <Icon name="donut_large" className="text-[18px]" />
            </div>
            Action Distribution
          </h3>
          <div className="w-full h-72 relative">
            <Chart
              type="doughnut"
              data={actionPieData}
              options={actionPieOptions}
              className="w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -mt-8">
              <div className="text-center">
                <p className="text-2xl font-black text-gray-900">
                  {mockFileMovements.length}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  Actions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Icon name="bar_chart" className="text-[18px]" />
            </div>
            Files by Status
          </h3>
          <div className="w-full h-72">
            <Chart
              type="bar"
              data={statusBarData}
              options={statusBarOptions}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <Icon name="leaderboard" className="text-[18px]" />
            </div>
            Files by Department
          </h3>
          <div className="w-full h-72">
            <Chart
              type="bar"
              data={deptBarData}
              options={deptBarOptions}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Activity + Overdue + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FormCard
          title="Recent Activity"
          icon="history"
          className="lg:col-span-1"
        >
          <div className="space-y-2.5">
            {recentMovements.length === 0 ? (
              <p className="text-sm text-gray-400">No recent activity.</p>
            ) : (
              recentMovements.map(m => (
                <ActivityItem
                  key={m.id}
                  text={`${m.fileNumber} - ${m.action}`}
                  time={m.actionDate}
                  type={m.action}
                  subText={`${m.fromUserName} → ${m.toUserName || '—'}`}
                />
              ))
            )}
          </div>
        </FormCard>

        <FormCard
          title="Overdue Files"
          icon="warning"
          className="lg:col-span-1"
        >
          <div className="space-y-2.5">
            {overdueFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Icon
                  name="check_circle"
                  className="text-3xl mb-2 text-emerald-300"
                />
                <p className="text-sm font-medium">
                  No overdue files. All on track!
                </p>
              </div>
            ) : (
              overdueFiles.map(f => {
                const daysOverdue = f.dueDate
                  ? Math.floor(
                      (new Date().getTime() - new Date(f.dueDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : 0;
                const priority =
                  daysOverdue > 5 ? 'high' : daysOverdue > 2 ? 'medium' : 'low';
                return (
                  <OverdueFileItem
                    key={f.id}
                    title={f.title}
                    fileNumber={f.fileNumber}
                    daysLeft={-daysOverdue}
                    priority={priority}
                    onClick={() =>
                      navigate(`/file-management-tracking/admin/inbox`)
                    }
                  />
                );
              })
            )}
          </div>
        </FormCard>

        <FormCard title="Quick Actions" icon="bolt" className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-2.5">
            <QuickActionBtn
              label="File Types"
              icon="description"
              color="indigo"
              onClick={() =>
                navigate('/file-management-tracking/admin/file-types')
              }
            />
            <QuickActionBtn
              label="Departments"
              icon="business"
              color="teal"
              onClick={() =>
                navigate('/file-management-tracking/admin/departments')
              }
            />
            <QuickActionBtn
              label="Users"
              icon="people"
              color="blue"
              onClick={() => navigate('/file-management-tracking/admin/users')}
            />
            <QuickActionBtn
              label="Workflows"
              icon="alt_route"
              color="violet"
              onClick={() =>
                navigate('/file-management-tracking/admin/workflows')
              }
            />
            <QuickActionBtn
              label="Audit Logs"
              icon="history"
              color="amber"
              onClick={() =>
                navigate('/file-management-tracking/admin/audit-logs')
              }
            />
            <QuickActionBtn
              label="Retention"
              icon="archive"
              color="rose"
              onClick={() =>
                navigate('/file-management-tracking/admin/retention-policies')
              }
            />
            <QuickActionBtn
              label="Diary Config"
              icon="settings"
              color="gray"
              onClick={() =>
                navigate('/file-management-tracking/admin/diary-config')
              }
            />
            <QuickActionBtn
              label="Print Center"
              icon="print"
              color="emerald"
              onClick={() =>
                navigate('/file-management-tracking/admin/print-center')
              }
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}

/* ── Sub-components ── */

function ActivityItem({
  text,
  time,
  type,
  subText,
}: {
  text: string;
  time: string;
  type: string;
  subText?: string;
}) {
  const iconMap: Record<string, { icon: string; bg: string; color: string }> = {
    Approved: {
      icon: 'check_circle',
      bg: 'bg-emerald-50',
      color: 'text-emerald-600',
    },
    Created: { icon: 'add_circle', bg: 'bg-blue-50', color: 'text-blue-600' },
    Rejected: { icon: 'cancel', bg: 'bg-red-50', color: 'text-red-600' },
    Revoked: { icon: 'undo', bg: 'bg-red-50', color: 'text-red-600' },
    Forwarded: { icon: 'send', bg: 'bg-indigo-50', color: 'text-indigo-600' },
  };
  const style = iconMap[type] || {
    icon: 'swap_horiz',
    bg: 'bg-gray-50',
    color: 'text-gray-600',
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50/60 transition-colors">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${style.bg} ${style.color}`}
      >
        <Icon name={style.icon} className="text-[16px]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{text}</p>
        {subText && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{subText}</p>
        )}
        <p className="text-[10px] text-gray-400 mt-1 font-medium">{time}</p>
      </div>
    </div>
  );
}

function OverdueFileItem({
  title,
  fileNumber,
  daysLeft,
  priority,
  onClick,
}: {
  title: string;
  fileNumber: string;
  daysLeft: number;
  priority: 'high' | 'medium' | 'low';
  onClick: () => void;
}) {
  const priorityStyles = {
    high: 'border-l-red-500 bg-red-50/80 hover:bg-red-100/80',
    medium: 'border-l-amber-500 bg-amber-50/80 hover:bg-amber-100/80',
    low: 'border-l-blue-500 bg-blue-50/80 hover:bg-blue-100/80',
  };
  const badgeStyles = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-blue-100 text-blue-700',
  };
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-xl border-l-4 cursor-pointer transition-colors ${priorityStyles[priority]}`}
    >
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {fileNumber}
        </p>
        <p className="text-xs text-gray-500 truncate">{title}</p>
      </div>
      <span
        className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${badgeStyles[priority]}`}
      >
        {daysLeft > 0 ? `${daysLeft}d left` : `${-daysLeft}d overdue`}
      </span>
    </div>
  );
}

const QA_COLORS: Record<
  string,
  { bg: string; hover: string; iconColor: string }
> = {
  indigo: {
    bg: 'bg-indigo-50/60',
    hover: 'hover:bg-indigo-100 hover:border-indigo-300',
    iconColor: 'text-indigo-600',
  },
  teal: {
    bg: 'bg-teal-50/60',
    hover: 'hover:bg-teal-100 hover:border-teal-300',
    iconColor: 'text-teal-600',
  },
  blue: {
    bg: 'bg-blue-50/60',
    hover: 'hover:bg-blue-100 hover:border-blue-300',
    iconColor: 'text-blue-600',
  },
  violet: {
    bg: 'bg-violet-50/60',
    hover: 'hover:bg-violet-100 hover:border-violet-300',
    iconColor: 'text-violet-600',
  },
  amber: {
    bg: 'bg-amber-50/60',
    hover: 'hover:bg-amber-100 hover:border-amber-300',
    iconColor: 'text-amber-600',
  },
  rose: {
    bg: 'bg-rose-50/60',
    hover: 'hover:bg-rose-100 hover:border-rose-300',
    iconColor: 'text-rose-600',
  },
  gray: {
    bg: 'bg-gray-50/60',
    hover: 'hover:bg-gray-100 hover:border-gray-300',
    iconColor: 'text-gray-600',
  },
  emerald: {
    bg: 'bg-emerald-50/60',
    hover: 'hover:bg-emerald-100 hover:border-emerald-300',
    iconColor: 'text-emerald-600',
  },
};

function QuickActionBtn({
  icon = 'chevron_right',
  label,
  onClick,
  color = 'indigo',
}: {
  icon?: string;
  label: string;
  onClick: () => void;
  color?: string;
}) {
  const c = QA_COLORS[color] || QA_COLORS.indigo;
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center text-center gap-2 p-3.5 border border-gray-200 rounded-xl transition-all cursor-pointer ${c.bg} ${c.hover}`}
    >
      <div
        className={`w-9 h-9 rounded-xl bg-white/80 border border-gray-100 shadow-sm flex items-center justify-center ${c.iconColor}`}
      >
        <Icon name={icon} className="text-[20px]" />
      </div>
      <span className="text-[11px] leading-tight font-semibold text-gray-700">
        {label}
      </span>
    </button>
  );
}
