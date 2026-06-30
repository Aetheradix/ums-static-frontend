import { Chart } from 'primereact/chart';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage, GridPanel } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { InfoBanner, ReportExportButtons } from '../../components';
import { mockFileMovements } from '../../data';

export default function SlaViolationsReport() {
  const violations = mockFileMovements.filter(m => m.slaStatus === 'Violated');
  const approaching = mockFileMovements.filter(
    m => m.slaStatus === 'Approaching'
  );
  const onTrack = mockFileMovements.filter(
    m => m.slaStatus === 'OnTrack'
  ).length;
  const total = mockFileMovements.length;
  const complianceRate = total > 0 ? Math.round((onTrack / total) * 100) : 100;

  const doughnutData = {
    labels: ['On Track', 'Approaching', 'Violated'],
    datasets: [
      {
        data: [onTrack, approaching.length, violations.length],
        backgroundColor: [
          'rgba(16,185,129,0.85)',
          'rgba(245,158,11,0.85)',
          'rgba(239,68,68,0.85)',
        ],
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
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  // Build action-type breakdown for violated movements
  const violationsByAction: Record<string, number> = {};
  violations.forEach(v => {
    violationsByAction[v.action] = (violationsByAction[v.action] || 0) + 1;
  });

  const actionBarData = {
    labels: Object.keys(violationsByAction),
    datasets: [
      {
        label: 'Violations',
        data: Object.values(violationsByAction),
        backgroundColor: [
          'rgba(239,68,68,0.8)',
          'rgba(245,158,11,0.8)',
          'rgba(168,85,247,0.8)',
          'rgba(236,72,153,0.8)',
        ],
        borderRadius: 6,
        barThickness: 32,
      },
    ],
  };

  const actionBarOptions = {
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

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Reports' },
        { label: 'SLA Violations Report' },
      ]}
      title="SLA Violations Report"
      description="Monitor SLA compliance across file movements"
    >
      <InfoBanner
        title="About SLA Violations Report"
        message="Identify files that have exceeded their designated processing time limits (Service Level Agreements)."
      />
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Movements"
          value={total}
          icon="swap_horiz"
          colorScheme="blue"
          subtitle="All file actions"
        />
        <StatCard
          title="On Track"
          value={onTrack}
          icon="check_circle"
          colorScheme="green"
          subtitle="Within SLA limits"
        />
        <StatCard
          title="Approaching"
          value={approaching.length}
          icon="warning"
          colorScheme="orange"
          subtitle="Nearing deadline"
        />
        <StatCard
          title="Violated"
          value={violations.length}
          icon="cancel"
          colorScheme="red"
          subtitle="Exceeded SLA"
        />
      </div>

      {/* Compliance Score Banner */}
      <div
        className={`rounded-2xl p-5 mb-8 flex items-center gap-5 ${
          complianceRate >= 80
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
            : complianceRate >= 60
              ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
              : 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200'
        }`}
      >
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            complianceRate >= 80
              ? 'bg-emerald-100 text-emerald-700'
              : complianceRate >= 60
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'
          }`}
        >
          <span className="text-2xl font-black">{complianceRate}%</span>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-base">
            SLA Compliance Rate
          </h4>
          <p className="text-sm text-gray-600 mt-0.5">
            {complianceRate >= 80
              ? 'Excellent! Most file movements are processed within SLA limits.'
              : complianceRate >= 60
                ? 'Moderate compliance. Some areas need attention to meet SLA targets.'
                : 'Low compliance detected. Immediate action required to address SLA violations.'}
          </p>
        </div>
        <div className="ml-auto hidden md:block">
          <Icon
            name={
              complianceRate >= 80
                ? 'verified'
                : complianceRate >= 60
                  ? 'info'
                  : 'error'
            }
            className={`text-[36px] ${
              complianceRate >= 80
                ? 'text-emerald-500'
                : complianceRate >= 60
                  ? 'text-amber-500'
                  : 'text-red-500'
            }`}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Icon name="donut_large" className="text-[18px]" />
            </div>
            SLA Status Distribution
          </h3>
          <div className="w-full h-72 relative">
            <Chart
              type="doughnut"
              data={doughnutData}
              options={doughnutOptions}
              className="w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -mt-8">
              <div className="text-center">
                <p className="text-2xl font-black text-gray-900">{total}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  Total
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 shrink-0">
              <Icon name="bar_chart" className="text-[18px]" />
            </div>
            Violations by Action Type
            <span className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Count
            </span>
          </h3>
          <div className="w-full h-72">
            <Chart
              type="bar"
              data={actionBarData}
              options={actionBarOptions}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* SLA Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Icon
                name="check_circle"
                className="text-emerald-600 text-[22px]"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                On Track
              </p>
              <p className="text-2xl font-black text-gray-900">{onTrack}</p>
            </div>
          </div>
          <div className="w-full bg-emerald-100 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${total > 0 ? (onTrack / total) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {total > 0 ? Math.round((onTrack / total) * 100) : 0}% of all
            movements
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Icon name="schedule" className="text-amber-600 text-[22px]" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Approaching
              </p>
              <p className="text-2xl font-black text-gray-900">
                {approaching.length}
              </p>
            </div>
          </div>
          <div className="w-full bg-amber-100 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all"
              style={{
                width: `${total > 0 ? (approaching.length / total) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {total > 0 ? Math.round((approaching.length / total) * 100) : 0}% of
            all movements
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Icon name="cancel" className="text-red-600 text-[22px]" />
            </div>
            <div>
              <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Violated
              </p>
              <p className="text-2xl font-black text-gray-900">
                {violations.length}
              </p>
            </div>
          </div>
          <div className="w-full bg-red-100 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all"
              style={{
                width: `${total > 0 ? (violations.length / total) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {total > 0 ? Math.round((violations.length / total) * 100) : 0}% of
            all movements
          </p>
        </div>
      </div>

      {/* Violations Table */}
      {violations.length > 0 && (
        <GridPanel
          title="SLA Violation Details"
          data={violations}
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
                    <span className="text-sm">{row.toUserName}</span>
                  </div>
                ),
              },
              {
                field: 'daysPending',
                header: 'Days Overdue',
                cell: (row: any) => (
                  <span className="inline-flex items-center gap-1 font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg text-xs">
                    <Icon name="schedule" className="text-[13px]" />
                    {row.daysPending}d
                  </span>
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
      )}
    </FormPage>
  );
}
