import { Chart } from 'primereact/chart';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage, GridPanel, StatusBadge } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { InfoBanner, ReportExportButtons } from '../../components';
import { mockFiles } from '../../data';

export default function PendingFilesReport() {
  const pendingFiles = mockFiles.filter(
    f =>
      f.currentStatus === 'Under Review' ||
      f.currentStatus === 'Forwarded' ||
      f.currentStatus === 'Returned for Clarification'
  );
  const statusCounts: Record<string, number> = {};
  pendingFiles.forEach(f => {
    statusCounts[f.currentStatus] = (statusCounts[f.currentStatus] || 0) + 1;
  });

  const deptCounts: Record<string, number> = {};
  pendingFiles.forEach(f => {
    deptCounts[f.departmentName] = (deptCounts[f.departmentName] || 0) + 1;
  });

  const overdueCount = pendingFiles.filter(
    f => f.dueDate && new Date(f.dueDate) < new Date()
  ).length;

  const avgAge =
    pendingFiles.length > 0
      ? (
          pendingFiles.reduce((sum, f) => {
            const created = new Date(f.createdAt);
            const diff =
              (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
            return sum + diff;
          }, 0) / pendingFiles.length
        ).toFixed(1)
      : '0';

  const statusColors = [
    'rgba(245,158,11,0.85)',
    'rgba(59,130,246,0.85)',
    'rgba(239,68,68,0.85)',
  ];
  const deptColors = [
    'rgba(99,102,241,0.8)',
    'rgba(14,165,233,0.8)',
    'rgba(16,185,129,0.8)',
    'rgba(245,158,11,0.8)',
    'rgba(168,85,247,0.8)',
    'rgba(236,72,153,0.8)',
  ];

  const doughnutData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
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
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.9)',
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const deptBarData = {
    labels: Object.keys(deptCounts),
    datasets: [
      {
        label: 'Pending Files',
        data: Object.values(deptCounts),
        backgroundColor: deptColors.slice(0, Object.keys(deptCounts).length),
        borderRadius: 6,
        barThickness: 32,
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
        { label: 'Pending Files Report' },
      ]}
      title="Pending Files Report"
      description="All files awaiting action"
    >
      <InfoBanner
        title="About Pending Files Report"
        message="Generate comprehensive reports on all stalled or pending files awaiting action."
      />
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Pending"
          value={pendingFiles.length}
          icon="hourglass_empty"
          colorScheme="orange"
          subtitle="Awaiting action"
        />
        <StatCard
          title="Overdue"
          value={overdueCount}
          icon="warning"
          colorScheme="red"
          subtitle="Past due date"
        />
        <StatCard
          title="Avg Age"
          value={`${avgAge}d`}
          icon="schedule"
          colorScheme="blue"
          subtitle="Days in queue"
        />
        <StatCard
          title="Departments"
          value={Object.keys(deptCounts).length}
          icon="domain"
          colorScheme="purple"
          subtitle="With pending items"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Icon name="donut_large" className="text-[18px]" />
            </div>
            Status Breakdown
          </h3>
          <div className="w-full h-72 flex items-center justify-center relative">
            <Chart
              type="doughnut"
              data={doughnutData}
              options={doughnutOptions}
              className="w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -mt-8">
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900">
                  {pendingFiles.length}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  Pending
                </p>
              </div>
            </div>
          </div>

          {/* Status legend items as cards */}
          <div className="grid grid-cols-1 gap-2 mt-4">
            {Object.entries(statusCounts).map(([status, count], i) => (
              <div
                key={status}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/80"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: statusColors[i] }}
                />
                <span className="text-sm text-gray-700 font-medium flex-1">
                  {status}
                </span>
                <span className="text-sm font-bold text-gray-900">{count}</span>
                <span className="text-xs text-gray-500">
                  (
                  {pendingFiles.length > 0
                    ? Math.round((count / pendingFiles.length) * 100)
                    : 0}
                  %)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Icon name="leaderboard" className="text-[18px]" />
            </div>
            Pending by Department
            <span className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Files
            </span>
          </h3>
          <div className="w-full h-80">
            <Chart
              type="bar"
              data={deptBarData}
              options={deptBarOptions}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Detailed Data Table */}
      <GridPanel
        title="Pending Files Detail"
        data={pendingFiles}
        columns={
          [
            { field: 'fileNumber', header: 'File #' },
            { field: 'title', header: 'Title' },
            { field: 'departmentName', header: 'Department' },
            {
              field: 'currentStatus',
              header: 'Status',
              cell: (row: any) => (
                <StatusBadge label={row.currentStatus} variant="pending" />
              ),
            },
            {
              field: 'currentHolderUserName',
              header: 'Assigned To',
              cell: (row: any) => (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Icon name="person" className="text-[13px]" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {row.currentHolderUserName || '—'}
                  </span>
                </div>
              ),
            },
            {
              field: 'dueDate',
              header: 'Due Date',
              cell: (row: any) => {
                const isOverdue =
                  row.dueDate && new Date(row.dueDate) < new Date();
                return (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                      isOverdue
                        ? 'bg-red-50 text-red-700'
                        : row.dueDate
                          ? 'bg-gray-50 text-gray-700'
                          : 'text-gray-400'
                    }`}
                  >
                    {row.dueDate || '—'}
                    {isOverdue && ' ⚠️'}
                  </span>
                );
              },
            },
          ] as any
        }
        dataKey="id"
        searchBox
        pagination={{ rows: 10 }}
      />
    </FormPage>
  );
}
