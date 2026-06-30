import { Chart } from 'primereact/chart';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { InfoBanner, ReportExportButtons } from '../../components';
import { mockFileMovements, mockFiles, mockUsers } from '../../data';

export default function EmployeeProductivityReport() {
  const employees = mockUsers.filter(u => u.roleId === 7);
  const prodData = employees.map(u => {
    const filesCreated = mockFiles.filter(f => f.createdBy === u.id).length;
    const actions = mockFileMovements.filter(m => m.fromUserId === u.id).length;
    return {
      name: u.name,
      filesCreated,
      actions,
      total: filesCreated + actions,
    };
  });

  const sortedByTotal = [...prodData].sort((a, b) => b.total - a.total);
  const topPerformer = sortedByTotal[0];
  const totalCreated = mockFiles.length;
  const totalActions = mockFileMovements.length;
  const avgActionsPerEmployee =
    employees.length > 0 ? (totalActions / employees.length).toFixed(1) : '0';

  const barChartData = {
    labels: prodData.map(p => p.name),
    datasets: [
      {
        label: 'Files Created',
        data: prodData.map(p => p.filesCreated),
        backgroundColor: 'rgba(99,102,241,0.8)',
        borderRadius: 6,
        barThickness: 20,
      },
      {
        label: 'Actions Taken',
        data: prodData.map(p => p.actions),
        backgroundColor: 'rgba(16,185,129,0.8)',
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded',
          font: { size: 11, weight: '500' },
          color: '#64748b',
          padding: 16,
        },
      },
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
        ticks: { color: '#64748b', font: { size: 11, weight: '500' } },
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  const radarData = {
    labels: prodData.map(p => p.name),
    datasets: [
      {
        label: 'Files Created',
        data: prodData.map(p => p.filesCreated),
        backgroundColor: 'rgba(99,102,241,0.15)',
        borderColor: 'rgba(99,102,241,0.7)',
        pointBackgroundColor: 'rgba(99,102,241,0.9)',
        borderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Actions Taken',
        data: prodData.map(p => p.actions),
        backgroundColor: 'rgba(16,185,129,0.15)',
        borderColor: 'rgba(16,185,129,0.7)',
        pointBackgroundColor: 'rgba(16,185,129,0.9)',
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          font: { size: 11 },
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
    scales: {
      r: {
        beginAtZero: true,
        ticks: { display: false },
        grid: { color: 'rgba(148,163,184,0.15)' },
        pointLabels: { color: '#64748b', font: { size: 11, weight: '500' } },
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
        { label: 'Employee Productivity Report' },
      ]}
      title="Employee Productivity Report"
      description="Track file creation and processing by employee"
    >
      <InfoBanner
        title="About Employee Productivity Report"
        message="Review performance metrics and file processing throughput for individual employees and departments."
      />
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon="groups"
          colorScheme="blue"
          subtitle="Active staff members"
        />
        <StatCard
          title="Total Files Created"
          value={totalCreated}
          icon="post_add"
          colorScheme="green"
          subtitle="Across all users"
        />
        <StatCard
          title="Total Actions"
          value={totalActions}
          icon="assignment_turned_in"
          colorScheme="purple"
          subtitle="All movements processed"
        />
        <StatCard
          title="Avg Actions/Employee"
          value={avgActionsPerEmployee}
          icon="person"
          colorScheme="orange"
          subtitle="Per employee average"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Icon name="bar_chart" className="text-[18px]" />
            </div>
            Productivity Comparison
            <span className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Files & Actions
            </span>
          </h3>
          <div className="w-full h-80">
            <Chart
              type="bar"
              data={barChartData}
              options={barChartOptions}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Icon name="radar" className="text-[18px]" />
            </div>
            Skill Radar
          </h3>
          <div className="w-full h-80">
            <Chart
              type="radar"
              data={radarData}
              options={radarOptions}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Employee Ranking Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-80" />
        <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Icon name="emoji_events" className="text-[18px]" />
          </div>
          Employee Performance Ranking
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Files Created
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Score
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Activity Level
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedByTotal.map((p, i) => {
                const maxTotal = topPerformer?.total || 1;
                const barWidth = Math.max(5, (p.total / maxTotal) * 100);
                return (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4">
                      {i < 3 ? (
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white ${
                            i === 0
                              ? 'bg-amber-500'
                              : i === 1
                                ? 'bg-gray-400'
                                : 'bg-orange-400'
                          }`}
                        >
                          {i + 1}
                        </span>
                      ) : (
                        <span className="text-gray-500 font-medium pl-2">
                          {i + 1}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-800">
                        {p.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded-lg text-xs">
                        <Icon name="post_add" className="text-[13px]" />
                        {p.filesCreated}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg text-xs">
                        <Icon name="bolt" className="text-[13px]" />
                        {p.actions}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-gray-900 font-bold">{p.total}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="star" className="text-indigo-600 text-[20px]" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Top Performer
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {topPerformer?.name || '—'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {topPerformer?.filesCreated || 0} files created,{' '}
            {topPerformer?.actions || 0} actions — {topPerformer?.total || 0}{' '}
            total contributions
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="insights" className="text-emerald-600 text-[20px]" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Team Insight
            </span>
          </div>
          <p className="text-sm font-medium text-gray-800">
            {Number(avgActionsPerEmployee) >= 3
              ? 'Team is showing strong productivity. The workload appears well-distributed across active employees.'
              : 'Some team members may have capacity for additional file processing. Consider workload rebalancing.'}
          </p>
        </div>
      </div>
    </FormPage>
  );
}
