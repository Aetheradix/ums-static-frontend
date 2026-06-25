import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { useDashboardStatsQuery, useExamSessionsQuery } from '../../../queries';
import { FormPage, FormCard } from 'shared/new-components';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useDashboardStatsQuery();
  const { data: sessions } = useExamSessionsQuery();
  const navigate = useNavigate();

  if (isLoading || !stats) {
    return (
      <FormPage
        title="Examination Dashboard"
        description="Overview of the examination management system"
      >
        <div className="flex items-center justify-center h-64 text-gray-400">
          Loading dashboard...
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Examination Dashboard"
      description="Overview of the examination management system"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
        <KpiCard
          label="Total Sessions"
          value={stats.totalSessions}
          color="blue"
        />
        <KpiCard
          label="Active Sessions"
          value={stats.activeSessions}
          color="green"
        />
        <KpiCard
          label="Total Students"
          value={stats.totalStudents}
          color="purple"
        />
        <KpiCard
          label="Forms Submitted"
          value={stats.formsSubmitted}
          color="orange"
        />
        <KpiCard
          label="Marks Entry"
          value={`${stats.marksEntryProgress}%`}
          color="teal"
        />
        <KpiCard
          label="Results Published"
          value={stats.resultsPublished}
          color="indigo"
        />
        {stats.centersActive != null && (
          <KpiCard
            label="Active Centers"
            value={stats.centersActive}
            color="pink"
          />
        )}
        {stats.pendingApprovals != null && (
          <KpiCard
            label="Pending Approvals"
            value={stats.pendingApprovals}
            color="red"
          />
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FormCard title="Marks Entry Progress" className="lg:col-span-1">
          <div className="h-64">
            <MarksProgressChart data={stats.marksBreakdown} />
          </div>
        </FormCard>

        <FormCard title="Session Overview" className="lg:col-span-1">
          <div className="h-64">
            <SessionOverviewChart data={stats.sessionStats} />
          </div>
        </FormCard>

        <FormCard title="Program Distribution" className="lg:col-span-1">
          <div className="h-64">
            <ProgramChart data={stats.programDistribution} />
          </div>
        </FormCard>
      </div>

      {/* Deadlines + Sessions + Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FormCard title="Upcoming Deadlines" className="lg:col-span-1">
          <div className="space-y-3">
            {(stats.upcomingDeadlines ?? []).length === 0 && (
              <p className="text-sm text-gray-400">No upcoming deadlines.</p>
            )}
            {(stats.upcomingDeadlines ?? []).map((d, i) => (
              <DeadlineItem
                key={i}
                title={d.title}
                date={d.date}
                daysLeft={d.daysLeft}
                priority={d.priority}
              />
            ))}
          </div>
        </FormCard>

        <FormCard title="Active Sessions" className="lg:col-span-1">
          <div className="space-y-3">
            {(sessions ?? []).length === 0 && (
              <p className="text-sm text-gray-400">No sessions found.</p>
            )}
            {(sessions ?? []).slice(0, 5).map(s => {
              const max = Math.max(...(sessions ?? []).map(x => x.id), 1);
              const barWidth = Math.round((s.id / max) * 100);
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-40 truncate">
                    {s.sessionName}
                  </span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${s.status === 'Active' ? 'bg-green-400' : 'bg-gray-300'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                      s.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        </FormCard>

        <FormCard title="Quick Actions" className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-3">
            <QuickActionBtn
              label="New Session"
              onClick={() => navigate('/examination-management/setup/sessions')}
            />
            <QuickActionBtn
              label="Timetable"
              onClick={() => navigate('/examination-management/setup/sessions')}
            />
            <QuickActionBtn
              label="Enter Marks"
              onClick={() =>
                navigate('/examination-management/session/1/marks-entry')
              }
            />
            <QuickActionBtn
              label="Reports"
              onClick={() => navigate('/examination-management/reports')}
            />
            <QuickActionBtn
              label="Publish Results"
              onClick={() =>
                navigate('/examination-management/results/processing')
              }
            />
            <QuickActionBtn
              label="Evaluators"
              onClick={() => navigate('/examination-management/evaluator')}
            />
          </div>
        </FormCard>
      </div>

      {/* Recent Activity */}
      <FormCard title="Recent Activity" icon="clock">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(stats.recentActivities ?? []).length === 0 && (
            <p className="text-sm text-gray-400 col-span-full">
              No recent activity.
            </p>
          )}
          {(stats.recentActivities ?? []).map((a, i) => (
            <ActivityItem key={i} text={a.text} time={a.time} type={a.type} />
          ))}
        </div>
      </FormCard>
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

function MarksProgressChart({
  data,
}: {
  data: Examination.DashboardStats['marksBreakdown'];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || !data) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const labels = [
      'Theory Entered',
      'Practical Entered',
      'IA Entered',
      'Verified',
      'Approved',
    ];
    const values = [
      data.theoryEntered,
      data.practicalEntered,
      data.iaEntered,
      data.verified,
      data.approved,
    ];
    const colors = ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#14b8a6'];
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Completion %',
            data: values,
            backgroundColor: colors.map(c => c + 'cc'),
            borderColor: colors,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 100, ticks: { callback: v => `${v}%` } },
        },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, [data]);

  if (!data)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data available
      </div>
    );
  return <canvas ref={ref} />;
}

function SessionOverviewChart({
  data,
}: {
  data: Examination.DashboardStats['sessionStats'];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || !data) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Upcoming', 'Completed'],
        datasets: [
          {
            data: [data.active, data.upcoming, data.completed],
            backgroundColor: ['#22c55e', '#f59e0b', '#3b82f6'],
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 8, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  if (!data)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data available
      </div>
    );
  return <canvas ref={ref} />;
}

function ProgramChart({
  data,
}: {
  data: Examination.DashboardStats['programDistribution'];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || !data?.length) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const colors = [
      '#3b82f6',
      '#22c55e',
      '#f59e0b',
      '#ef4444',
      '#a855f7',
      '#06b6d4',
      '#f97316',
    ];
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.program),
        datasets: [
          {
            label: 'Students',
            data: data.map(d => d.students),
            backgroundColor: colors.slice(0, data.length).map(c => c + 'cc'),
            borderColor: colors.slice(0, data.length),
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: { beginAtZero: true },
        },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, [data]);

  if (!data?.length)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data available
      </div>
    );
  return <canvas ref={ref} />;
}

function DeadlineItem({
  title,
  date,
  daysLeft,
  priority,
}: {
  title: string;
  date: string;
  daysLeft: number;
  priority: 'high' | 'medium' | 'low';
}) {
  const priorityStyles = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-amber-500 bg-amber-50',
    low: 'border-l-blue-500 bg-blue-50',
  };

  const badgeStyles = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-blue-100 text-blue-700',
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${priorityStyles[priority]}`}
    >
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${badgeStyles[priority]}`}
      >
        {daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}
      </span>
    </div>
  );
}

function QuickActionBtn({
  icon = 'chevron-right',
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
      className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer"
    >
      <i className={`pi pi-${icon} text-xl text-blue-600`} />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}

function ActivityItem({
  text,
  time,
  type,
}: {
  text: string;
  time: string;
  type: string;
}) {
  const typeColors: Record<string, string> = {
    session: 'bg-blue-500',
    marks: 'bg-green-500',
    admit: 'bg-purple-500',
    fee: 'bg-amber-500',
    timetable: 'bg-teal-500',
    qp: 'bg-rose-500',
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
      <div
        className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${typeColors[type] || 'bg-gray-400'}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 truncate">{text}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}
