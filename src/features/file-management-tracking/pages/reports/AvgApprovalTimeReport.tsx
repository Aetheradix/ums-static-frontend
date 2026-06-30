import { Chart } from 'primereact/chart';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { InfoBanner, ReportExportButtons } from '../../components';
import { mockFileMovements, mockFiles } from '../../data';

export default function AvgApprovalTimeReport() {
  const depts = [...new Set(mockFiles.map(f => f.departmentName))];
  const avgTimes = depts.map(dept => {
    const deptFiles = mockFiles.filter(f => f.departmentName === dept);
    const approvals = mockFileMovements.filter(
      m => m.action === 'Approved' && deptFiles.some(f => f.id === m.fileId)
    );
    const times = approvals
      .map(a => {
        const created = mockFiles.find(f => f.id === a.fileId)?.createdAt;
        if (!created) return 0;
        return (
          (new Date(a.actionDate).getTime() - new Date(created).getTime()) /
          (1000 * 60 * 60 * 24)
        );
      })
      .filter(t => t > 0);
    const avg =
      times.length > 0 ? times.reduce((s, t) => s + t, 0) / times.length : 0;
    return { dept, avg: Math.round(avg * 10) / 10, count: approvals.length };
  });

  const sortedByTime = [...avgTimes].sort((a, b) => a.avg - b.avg);
  const fastest = sortedByTime[0];
  const slowest = sortedByTime[sortedByTime.length - 1];
  const globalAvg =
    avgTimes.length > 0
      ? (avgTimes.reduce((s, d) => s + d.avg, 0) / avgTimes.length).toFixed(1)
      : '0';

  const totalApprovals = mockFileMovements.filter(
    m => m.action === 'Approved'
  ).length;

  const accentColors = [
    'rgba(99,102,241,0.85)',
    'rgba(59,130,246,0.85)',
    'rgba(14,165,233,0.85)',
    'rgba(6,182,212,0.85)',
    'rgba(20,184,166,0.85)',
    'rgba(16,185,129,0.85)',
  ];

  const barChartData = {
    labels: avgTimes.map(a => a.dept),
    datasets: [
      {
        label: 'Avg Days',
        data: avgTimes.map(a => a.avg),
        backgroundColor: accentColors.slice(0, avgTimes.length),
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const barChartOptions = {
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
        callbacks: {
          label: (ctx: any) => `  ${ctx.parsed.y} days average`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#94a3b8', font: { size: 11 } },
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

  const horizontalData = {
    labels: sortedByTime.map(a => a.dept),
    datasets: [
      {
        label: 'Approvals',
        data: sortedByTime.map(a => a.count),
        backgroundColor: sortedByTime.map(
          (_, i) => accentColors[i % accentColors.length]
        ),
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const horizontalOptions = {
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
        ticks: { color: '#94a3b8', font: { size: 11 } },
        grid: { color: 'rgba(148,163,184,0.08)', drawBorder: false },
        border: { display: false },
      },
      y: {
        ticks: { color: '#64748b', font: { size: 11, weight: '500' } },
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Reports' },
        { label: 'Average Approval Time Report' },
      ]}
      title="Average Approval Time Report"
      description="Track file approval efficiency across departments"
    >
      <InfoBanner
        title="About Average Approval Time Report"
        message="Analyze the average processing duration across departments to identify workflow bottlenecks."
      />
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Approvals"
          value={totalApprovals}
          icon="check_circle"
          colorScheme="green"
          subtitle="All departments"
        />
        <StatCard
          title="Departments"
          value={depts.length}
          icon="domain"
          colorScheme="blue"
          subtitle="Active departments"
        />
        <StatCard
          title="Avg Processing"
          value={`${globalAvg}d`}
          icon="schedule"
          colorScheme="purple"
          subtitle="System-wide average"
        />
        <StatCard
          title="Files Tracked"
          value={mockFiles.length}
          icon="description"
          colorScheme="orange"
          subtitle="Total in system"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Icon name="bar_chart" className="text-[18px]" />
            </div>
            Avg Approval Time by Department
            <span className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Days
            </span>
          </h3>
          <div className="w-full h-72">
            <Chart
              type="bar"
              data={barChartData}
              options={barChartOptions}
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
            Approval Volume by Department
            <span className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Count
            </span>
          </h3>
          <div className="w-full h-72">
            <Chart
              type="bar"
              data={horizontalData}
              options={horizontalOptions}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-500 opacity-80" />
        <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
            <Icon name="table_chart" className="text-[18px]" />
          </div>
          Department Performance Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Approvals
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Avg Days
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Indicator
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedByTime.map((d, i) => {
                const perf =
                  d.avg <= 2
                    ? 'Excellent'
                    : d.avg <= 5
                      ? 'Good'
                      : d.avg <= 8
                        ? 'Average'
                        : 'Needs Improvement';
                const perfColor =
                  d.avg <= 2
                    ? 'bg-emerald-50 text-emerald-700'
                    : d.avg <= 5
                      ? 'bg-blue-50 text-blue-700'
                      : d.avg <= 8
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700';
                const barWidth = Math.min(
                  100,
                  (d.avg / (slowest?.avg || 1)) * 100
                );
                return (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-800">
                        {d.dept}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-gray-700 font-medium">
                        {d.count}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-gray-900">{d.avg}d</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${perfColor}`}
                      >
                        {perf}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor:
                              accentColors[i % accentColors.length],
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              name="emoji_events"
              className="text-emerald-600 text-[20px]"
            />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Fastest Department
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {fastest?.dept || '—'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {fastest?.avg || 0} days average turnaround
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="speed" className="text-red-600 text-[20px]" />
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Slowest Department
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {slowest?.dept || '—'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {slowest?.avg || 0} days average turnaround
          </p>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="insights" className="text-indigo-600 text-[20px]" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Key Insight
            </span>
          </div>
          <p className="text-sm font-medium text-gray-800">
            {Number(globalAvg) <= 5
              ? 'System-wide approval times are within healthy limits. Keep monitoring for seasonal changes.'
              : 'Some departments may benefit from process optimization. Consider reviewing workflows in slower areas.'}
          </p>
        </div>
      </div>
    </FormPage>
  );
}
