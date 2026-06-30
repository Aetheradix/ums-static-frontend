import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { FileStatusBadge, InfoBanner } from '../../components';
import {
  mockFileMovements,
  mockFiles,
  mockNotifications,
  mockUsers,
} from '../../data';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const currentUser = mockUsers[9];
  const myFiles = mockFiles.filter(f => f.createdBy === currentUser.id);
  const unreadNotifs = mockNotifications.filter(
    n => n.recipientUserId === currentUser.id && !n.isRead
  );
  const recentMovements = mockFileMovements.slice(-5).reverse();

  const inProgress = myFiles.filter(
    f => f.currentStatus === 'Under Review' || f.currentStatus === 'Forwarded'
  ).length;
  const completedCount = myFiles.filter(
    f => f.currentStatus === 'Approved' || f.currentStatus === 'Closed'
  ).length;

  const statuses = ['Draft', 'Under Review', 'Approved', 'Rejected', 'Closed'];
  const counts = statuses.map(
    s => myFiles.filter(f => f.currentStatus === s).length
  );
  const statusColors = [
    'rgba(148,163,184,0.85)',
    'rgba(245,158,11,0.85)',
    'rgba(16,185,129,0.85)',
    'rgba(239,68,68,0.85)',
    'rgba(99,102,241,0.85)',
  ];

  const doughnutData = {
    labels: statuses,
    datasets: [
      {
        data: counts,
        backgroundColor: statusColors,
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
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

  // Build a small bar chart for monthly file creation
  const monthlyCreation: Record<string, number> = {};
  myFiles.forEach(f => {
    const month = f.createdAt.substring(0, 7); // "YYYY-MM"
    monthlyCreation[month] = (monthlyCreation[month] || 0) + 1;
  });
  const sortedMonths = Object.keys(monthlyCreation).sort();

  const monthlyBarData = {
    labels: sortedMonths.map(m => {
      const [, month] = m.split('-');
      const names = [
        '',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return names[parseInt(month)] || m;
    }),
    datasets: [
      {
        label: 'Files Created',
        data: sortedMonths.map(m => monthlyCreation[m]),
        backgroundColor: 'rgba(99,102,241,0.8)',
        borderRadius: 6,
        barThickness: 24,
      },
    ],
  };

  const monthlyBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.9)',
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
        ticks: { color: '#64748b', font: { size: 11, weight: '500' } },
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  const completionRate =
    myFiles.length > 0
      ? Math.round((completedCount / myFiles.length) * 100)
      : 0;

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Employee' },
        { label: 'Welcome, ...' },
      ]}
      title={`Welcome, ${currentUser.name}`}
      description={`${currentUser.departmentName} — ${currentUser.roleName}`}
    >
      <InfoBanner
        title="Your File Dashboard"
        message="Track your files, manage submissions, and stay updated with the latest activity on your documents."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="My Files"
          value={myFiles.length}
          icon="folder_open"
          colorScheme="blue"
          subtitle="Total created"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon="sync"
          colorScheme="orange"
          subtitle="Under review"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          icon="check_circle"
          colorScheme="green"
          subtitle="Approved / Closed"
        />
        <StatCard
          title="Notifications"
          value={unreadNotifs.length}
          icon="notifications"
          colorScheme="purple"
          subtitle="Unread alerts"
        />
      </div>

      {/* Progress Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5 mb-8 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
          <span className="text-2xl font-black text-indigo-700">
            {completionRate}%
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-base">
            File Completion Progress
          </h4>
          <p className="text-sm text-gray-600 mt-0.5">
            {completedCount} of {myFiles.length} files completed. {inProgress}{' '}
            still in progress.
          </p>
          <div className="w-full bg-white/60 rounded-full h-2.5 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        <div className="hidden md:block shrink-0">
          <Icon name="trending_up" className="text-[36px] text-indigo-300" />
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-80" />
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Icon name="bolt" className="text-[18px]" />
              </div>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
              <QuickActionBtn
                icon="add"
                label="Create New File"
                color="indigo"
                onClick={() =>
                  navigate('/file-management-tracking/employee/create')
                }
              />
              <QuickActionBtn
                icon="folder_open"
                label="View All Files"
                color="blue"
                onClick={() =>
                  navigate('/file-management-tracking/employee/manage')
                }
              />
              <QuickActionBtn
                icon="inbox"
                label="Incoming Files"
                color="teal"
                onClick={() =>
                  navigate('/file-management-tracking/employee/incoming')
                }
              />
            </div>
          </div>

          {/* Status Doughnut */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-80" />
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <Icon name="donut_large" className="text-[18px]" />
              </div>
              My Files by Status
            </h3>
            <div className="w-full h-64 relative">
              <Chart
                type="doughnut"
                data={doughnutData}
                options={doughnutOptions}
                className="w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -mt-7">
                <div className="text-center">
                  <p className="text-2xl font-black text-gray-900">
                    {myFiles.length}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    Files
                  </p>
                </div>
              </div>
            </div>

            {/* Status legend cards */}
            <div className="grid grid-cols-1 gap-1.5 mt-3">
              {statuses.map(
                (s, i) =>
                  counts[i] > 0 && (
                    <div
                      key={s}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50/80"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: statusColors[i] }}
                      />
                      <span className="text-xs text-gray-600 font-medium flex-1">
                        {s}
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {counts[i]}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Monthly Creation Trend */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-500 opacity-80" />
            <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                <Icon name="bar_chart" className="text-[18px]" />
              </div>
              Monthly File Creation
              <span className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Trend
              </span>
            </h3>
            <div className="w-full h-48">
              <Chart
                type="bar"
                data={monthlyBarData}
                options={monthlyBarOptions}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Recent Files */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-80" />
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Icon name="description" className="text-[18px]" />
              </div>
              My Recent Files
              <span className="ml-auto text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                {myFiles.length} total
              </span>
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2.5">
              {myFiles.slice(0, 6).map(f => (
                <div
                  key={f.id}
                  onClick={() =>
                    navigate(`/file-management-tracking/employee/view/${f.id}`)
                  }
                  className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:border-blue-200 transition-all group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {f.fileNumber}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-1">
                      {f.title}
                    </div>
                  </div>
                  <div className="ml-4 shrink-0 flex items-center gap-2">
                    <FileStatusBadge status={f.currentStatus} />
                    <Icon
                      name="chevron_right"
                      className="text-[18px] text-gray-300 group-hover:text-blue-400 transition-colors"
                    />
                  </div>
                </div>
              ))}
              {myFiles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                    <Icon name="post_add" className="text-3xl text-blue-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600">
                    No files yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Create your first file to get started!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-80" />
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Icon name="history" className="text-[18px]" />
              </div>
              Recent Activity
            </h3>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2">
              {recentMovements.map(m => {
                const actionIcon =
                  m.action === 'Approved'
                    ? 'check_circle'
                    : m.action === 'Rejected'
                      ? 'cancel'
                      : m.action === 'Forwarded'
                        ? 'send'
                        : 'swap_horiz';
                const actionColor =
                  m.action === 'Approved'
                    ? 'bg-emerald-50 text-emerald-600'
                    : m.action === 'Rejected'
                      ? 'bg-red-50 text-red-600'
                      : m.action === 'Forwarded'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-gray-50 text-gray-600';
                return (
                  <div
                    key={m.id}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50/60 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${actionColor}`}
                    >
                      <Icon name={actionIcon} className="text-[16px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {m.fileNumber}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        <span className="font-semibold text-gray-700">
                          {m.action}
                        </span>
                        {' · '}
                        {m.remarks?.slice(0, 50) || 'No remarks'}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">
                        {m.actionDate}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </FormPage>
  );
}

/* ── Sub-components ── */

const QA_COLORS: Record<
  string,
  { bg: string; hover: string; iconColor: string }
> = {
  indigo: {
    bg: 'bg-indigo-50/60',
    hover: 'hover:bg-indigo-100 hover:border-indigo-300',
    iconColor: 'text-indigo-600',
  },
  blue: {
    bg: 'bg-blue-50/60',
    hover: 'hover:bg-blue-100 hover:border-blue-300',
    iconColor: 'text-blue-600',
  },
  teal: {
    bg: 'bg-teal-50/60',
    hover: 'hover:bg-teal-100 hover:border-teal-300',
    iconColor: 'text-teal-600',
  },
};

function QuickActionBtn({
  icon,
  label,
  onClick,
  color = 'indigo',
}: {
  icon: string;
  label: string;
  onClick: () => void;
  color?: string;
}) {
  const c = QA_COLORS[color] || QA_COLORS.indigo;
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-start sm:justify-center lg:justify-start gap-3 p-3.5 border border-gray-200 rounded-xl transition-all cursor-pointer w-full ${c.bg} ${c.hover}`}
    >
      <div
        className={`w-9 h-9 rounded-xl bg-white/80 border border-gray-100 shadow-sm flex items-center justify-center shrink-0 ${c.iconColor}`}
      >
        <Icon name={icon} className="text-[20px]" />
      </div>
      <span className="text-sm font-bold text-gray-800">{label}</span>
    </button>
  );
}
