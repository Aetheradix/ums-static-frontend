import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'shared/components/Icon/Icon';
import { FormCard, FormPage } from 'shared/new-components';
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

  const deptLabels = mockDepartments.filter(d => d.isActive).map(d => d.name);
  const deptCounts = deptLabels.map(
    d => mockFiles.filter(f => f.departmentName === d).length
  );

  const recentMovements = [...mockFileMovements]
    .sort(
      (a, b) =>
        new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime()
    )
    .slice(0, 5);

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Files" value={totalFiles} color="blue" />
        <KpiCard label="Pending" value={pendingFiles.length} color="orange" />
        <KpiCard
          label="Approved / Closed"
          value={approvedFiles.length}
          color="green"
        />
        <KpiCard label="Overdue" value={overdueFiles.length} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FormCard title="Files by Status" icon="bar_chart">
          <div className="relative h-64">
            <FilesByStatusChart labels={statusLabels} data={statusCounts} />
          </div>
        </FormCard>
        <FormCard title="Files by Department" icon="business">
          <div className="relative h-64">
            <FilesByDepartmentChart labels={deptLabels} data={deptCounts} />
          </div>
        </FormCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FormCard
          title="Recent Activity"
          icon="history"
          className="lg:col-span-1"
        >
          <div className="space-y-3">
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
          <div className="space-y-3">
            {overdueFiles.length === 0 ? (
              <p className="text-sm text-gray-400">
                No overdue files. All on track.
              </p>
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
          <div className="grid grid-cols-2 gap-3">
            <QuickActionBtn
              label="File Types"
              icon="description"
              onClick={() =>
                navigate('/file-management-tracking/admin/file-types')
              }
            />
            <QuickActionBtn
              label="Departments"
              icon="business"
              onClick={() =>
                navigate('/file-management-tracking/admin/departments')
              }
            />
            <QuickActionBtn
              label="Users"
              icon="people"
              onClick={() => navigate('/file-management-tracking/admin/users')}
            />
            <QuickActionBtn
              label="Workflows"
              icon="alt_route"
              onClick={() =>
                navigate('/file-management-tracking/admin/workflows')
              }
            />
            <QuickActionBtn
              label="Diary Config"
              icon="settings"
              onClick={() =>
                navigate('/file-management-tracking/admin/diary-config')
              }
            />
            <QuickActionBtn
              label="Audit Logs"
              icon="history"
              onClick={() =>
                navigate('/file-management-tracking/admin/audit-logs')
              }
            />
            <QuickActionBtn
              label="Retention"
              icon="archive"
              onClick={() =>
                navigate('/file-management-tracking/admin/retention-policies')
              }
            />
            <QuickActionBtn
              label="Print Center"
              icon="print"
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

const KPI_COLORS: Record<string, { bg: string; border: string; text: string }> =
  {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-700',
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-700',
    },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  };

function KpiCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  const c = KPI_COLORS[color] || KPI_COLORS.blue;
  return (
    <div className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
      <div className={`text-xs font-medium mb-1 ${c.text} opacity-70`}>
        {label}
      </div>
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
    </div>
  );
}

function FilesByStatusChart({
  labels,
  data,
}: {
  labels: string[];
  data: number[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || !data) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const existingChart = Chart.getChart(ref.current);
    if (existingChart) existingChart.destroy();

    const colors = [
      '#94a3b8',
      '#60a5fa',
      '#fbbf24',
      '#818cf8',
      '#34d399',
      '#f87171',
      '#9ca3af',
      '#a78bfa',
    ];
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Files',
            data: data,
            backgroundColor: colors,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 11 } },
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: '#94a3b8' },
            grid: { color: 'rgba(148,163,184,0.1)' },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, [labels, data]);

  return <canvas ref={ref} className="w-full h-full" />;
}

function FilesByDepartmentChart({
  labels,
  data,
}: {
  labels: string[];
  data: number[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || !data) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const existingChart = Chart.getChart(ref.current);
    if (existingChart) existingChart.destroy();

    const colors = [
      '#60a5fa',
      '#34d399',
      '#fbbf24',
      '#f472b6',
      '#a78bfa',
      '#fb923c',
    ];
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Files',
            data: data,
            backgroundColor: colors,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: '#94a3b8' },
            grid: { color: 'rgba(148,163,184,0.1)' },
          },
          y: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 11 } },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, [labels, data]);

  return <canvas ref={ref} className="w-full h-full" />;
}

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
  let colorClass = 'bg-gray-400';
  if (type === 'Approved' || type === 'Created') colorClass = 'bg-green-400';
  else if (type === 'Rejected' || type === 'Revoked') colorClass = 'bg-red-400';
  else if (type === 'Forwarded') colorClass = 'bg-blue-400';

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
      <div
        className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${colorClass}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{text}</p>
        {subText && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{subText}</p>
        )}
        <p className="text-[10px] text-gray-400 mt-1">{time}</p>
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
    high: 'border-l-red-500 bg-red-50 hover:bg-red-100',
    medium: 'border-l-amber-500 bg-amber-50 hover:bg-amber-100',
    low: 'border-l-blue-500 bg-blue-50 hover:bg-blue-100',
  };
  const badgeStyles = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-blue-100 text-blue-700',
  };
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-lg border-l-4 cursor-pointer transition-colors ${priorityStyles[priority]}`}
    >
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-medium text-gray-800 truncate">
          {fileNumber}
        </p>
        <p className="text-xs text-gray-500 truncate">{title}</p>
      </div>
      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${badgeStyles[priority]}`}
      >
        {daysLeft > 0 ? `${daysLeft}d left` : `${-daysLeft}d overdue`}
      </span>
    </div>
  );
}

function QuickActionBtn({
  icon = 'chevron_right',
  label,
  onClick,
}: {
  icon?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center text-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer"
    >
      <Icon name={icon} className="text-[24px] text-blue-600" />
      <span className="text-[11px] leading-tight font-medium text-gray-700">
        {label}
      </span>
    </button>
  );
}
