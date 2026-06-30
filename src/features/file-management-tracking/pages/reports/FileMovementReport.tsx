import { Chart } from 'primereact/chart';
import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage, GridPanel } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { InfoBanner, ReportExportButtons } from '../../components';
import { mockFileMovements } from '../../data';

export default function FileMovementReport() {
  const [dateRange, setDateRange] = useState('last30');
  const [deptFilter, setDeptFilter] = useState('all');

  const totalMovements = mockFileMovements.length;
  const uniqueFiles = new Set(mockFileMovements.map(m => m.fileId)).size;
  const avgPerFile = (totalMovements / (uniqueFiles || 1)).toFixed(1);
  const uniqueUsers = new Set([
    ...mockFileMovements.map(m => m.fromUserId),
    ...mockFileMovements.map(m => m.toUserId).filter(Boolean),
  ]).size;

  const actionCounts: Record<string, number> = {};
  mockFileMovements.forEach(m => {
    actionCounts[m.action] = (actionCounts[m.action] || 0) + 1;
  });

  const tableData = Object.entries(actionCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([action, count], i) => ({
      id: i,
      action,
      count,
      percentage: ((count / totalMovements) * 100).toFixed(1) + '%',
    }));

  const labels = Object.keys(actionCounts);
  const data = Object.values(actionCounts);
  const colors = [
    'rgba(99,102,241,0.85)',
    'rgba(16,185,129,0.85)',
    'rgba(245,158,11,0.85)',
    'rgba(239,68,68,0.85)',
    'rgba(168,85,247,0.85)',
    'rgba(236,72,153,0.85)',
    'rgba(14,165,233,0.85)',
    'rgba(251,146,60,0.85)',
  ];

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Movements',
        data,
        backgroundColor: colors,
        borderRadius: 6,
        barThickness: 36,
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
          label: (ctx: any) =>
            `  ${ctx.parsed.y} movements (${((ctx.parsed.y / totalMovements) * 100).toFixed(1)}%)`,
        },
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

  const pieChartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const pieChartOptions = {
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

  // Timeline data — movements grouped by date
  const dateGroups: Record<string, number> = {};
  mockFileMovements.forEach(m => {
    const date = m.actionDate.split('T')[0];
    dateGroups[date] = (dateGroups[date] || 0) + 1;
  });
  const sortedDates = Object.keys(dateGroups).sort();

  const lineChartData = {
    labels: sortedDates.map(d => {
      const dt = new Date(d);
      return `${dt.getDate()}/${dt.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: 'Daily Movements',
        data: sortedDates.map(d => dateGroups[d]),
        borderColor: 'rgba(99,102,241,0.8)',
        backgroundColor: 'rgba(99,102,241,0.08)',
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

  const lineChartOptions = {
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

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Reports' },
        { label: 'File Movement Report' },
      ]}
      title="File Movement Report"
      description="Analysis of file movement patterns"
    >
      <InfoBanner
        title="About File Movement Report"
        message="Trace the exact path, timestamps, and handlers of any file throughout its entire lifecycle."
      />
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-400 opacity-50" />
        <h3 className="text-xs font-bold text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
          <Icon name="tune" className="text-[16px] text-gray-500" />
          Report Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DropDownList
            label="Date Range"
            value={dateRange}
            onChange={v => setDateRange(v as string)}
            data={[
              { value: 'today', label: 'Today' },
              { value: 'last7', label: 'Last 7 Days' },
              { value: 'last30', label: 'Last 30 Days' },
              { value: 'all', label: 'All Time' },
            ]}
            textField="label"
            valueField="value"
          />
          <DropDownList
            label="Department"
            value={deptFilter}
            onChange={v => setDeptFilter(v as string)}
            data={[
              { value: 'all', label: 'All Departments' },
              { value: 'cs', label: 'Computer Science' },
              { value: 'math', label: 'Mathematics' },
            ]}
            textField="label"
            valueField="value"
          />
          <DropDownList
            label="Movement Action Type"
            value="all"
            onChange={() => {}}
            data={[{ value: 'all', label: 'All Actions' }]}
            textField="label"
            valueField="value"
          />
          <DropDownList
            label="Employee/User"
            value="all"
            onChange={() => {}}
            data={[{ value: 'all', label: 'All Users' }]}
            textField="label"
            valueField="value"
          />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Movements"
          value={totalMovements}
          icon="swap_horiz"
          colorScheme="blue"
          subtitle="All file actions"
        />
        <StatCard
          title="Files Tracked"
          value={uniqueFiles}
          icon="folder_open"
          colorScheme="green"
          subtitle="With movement history"
        />
        <StatCard
          title="Avg Movements/File"
          value={avgPerFile}
          icon="analytics"
          colorScheme="purple"
          subtitle="Transfer frequency"
        />
        <StatCard
          title="Users Involved"
          value={uniqueUsers}
          icon="group"
          colorScheme="orange"
          subtitle="Unique handlers"
        />
      </div>

      {/* Movement Timeline */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-80" />
        <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Icon name="timeline" className="text-[18px]" />
          </div>
          Movement Activity Timeline
          <span className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            Daily Volume
          </span>
        </h3>
        <div className="w-full h-64">
          <Chart
            type="line"
            data={lineChartData}
            options={lineChartOptions}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Icon name="bar_chart" className="text-[18px]" />
            </div>
            Movement Count by Action Type
            <span className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Count
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
              <Icon name="donut_large" className="text-[18px]" />
            </div>
            Action Type Distribution
          </h3>
          <div className="w-full h-72 relative">
            <Chart
              type="doughnut"
              data={pieChartData}
              options={pieChartOptions}
              className="w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -mt-8">
              <div className="text-center">
                <p className="text-2xl font-black text-gray-900">
                  {totalMovements}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  Total
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Breakdown Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-80" />
        <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Icon name="table_chart" className="text-[18px]" />
          </div>
          Movement Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action Type
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Distribution
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableData.map((row, i) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: colors[i % colors.length] }}
                      />
                      <span className="font-semibold text-gray-800">
                        {row.action}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-gray-900">
                    {row.count}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block bg-gray-50 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700">
                      {row.percentage}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: row.percentage,
                          backgroundColor: colors[i % colors.length],
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Movements Grid */}
      <GridPanel
        title="Recent File Movements"
        data={[...mockFileMovements].reverse().slice(0, 20)}
        columns={
          [
            { field: 'fileNumber', header: 'File #' },
            { field: 'action', header: 'Action' },
            {
              field: 'fromUserName',
              header: 'From',
              cell: (row: any) => (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Icon name="person" className="text-[13px]" />
                  </div>
                  <span className="text-sm">{row.fromUserName}</span>
                </div>
              ),
            },
            {
              field: 'toUserName',
              header: 'To',
              cell: (row: any) => (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 shrink-0">
                    <Icon name="person" className="text-[13px]" />
                  </div>
                  <span className="text-sm">{row.toUserName || '—'}</span>
                </div>
              ),
            },
            {
              field: 'actionDate',
              header: 'Date',
              cell: (row: any) => (
                <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                  {row.actionDate}
                </span>
              ),
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
