import { Chart } from 'primereact/chart';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { InfoBanner, ReportExportButtons } from '../../components';
import { mockFileMovements, mockFiles } from '../../data';

export default function RejectionRateReport() {
  const depts = [...new Set(mockFiles.map(f => f.departmentName))];
  const deptData = depts.map(dept => {
    const deptFiles = mockFiles.filter(f => f.departmentName === dept);
    const total = deptFiles.length;
    const rejected = mockFileMovements.filter(
      m => m.action === 'Rejected' && deptFiles.some(f => f.id === m.fileId)
    ).length;
    return {
      dept,
      total,
      rejected,
      rate: total > 0 ? Math.round((rejected / total) * 100) : 0,
    };
  });

  const sortedByRate = [...deptData].sort((a, b) => b.rate - a.rate);
  const totalRejected = mockFileMovements.filter(
    m => m.action === 'Rejected'
  ).length;
  const totalFiles = mockFiles.length;
  const overallRate =
    totalFiles > 0 ? Math.round((totalRejected / totalFiles) * 100) : 0;

  const barChartData = {
    labels: deptData.map(d => d.dept),
    datasets: [
      {
        label: 'Total Files',
        data: deptData.map(d => d.total),
        backgroundColor: 'rgba(99,102,241,0.75)',
        borderRadius: 6,
        barThickness: 22,
      },
      {
        label: 'Rejected',
        data: deptData.map(d => d.rejected),
        backgroundColor: 'rgba(239,68,68,0.75)',
        borderRadius: 6,
        barThickness: 22,
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

  const doughnutData = {
    labels: ['Approved/Other', 'Rejected'],
    datasets: [
      {
        data: [totalFiles - totalRejected, totalRejected],
        backgroundColor: ['rgba(99,102,241,0.75)', 'rgba(239,68,68,0.75)'],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
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
  };

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Reports' },
        { label: 'Rejection Rate Report' },
      ]}
      title="Rejection Rate Report"
      description="Analyze file rejection patterns across departments"
    >
      <InfoBanner
        title="About Rejection Rate Report"
        message="Analyze metrics for returned or rejected files to pinpoint common issues and improve compliance."
      />
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Files"
          value={totalFiles}
          icon="folder"
          colorScheme="blue"
          subtitle="All departments"
        />
        <StatCard
          title="Total Rejected"
          value={totalRejected}
          icon="cancel"
          colorScheme="red"
          subtitle="Returned or denied"
        />
        <StatCard
          title="Overall Rate"
          value={`${overallRate}%`}
          icon="percent"
          colorScheme="orange"
          subtitle="System-wide rejection"
        />
        <StatCard
          title="Clean Rate"
          value={`${100 - overallRate}%`}
          icon="verified"
          colorScheme="green"
          subtitle="First-pass acceptance"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Icon name="bar_chart" className="text-[18px]" />
            </div>
            Rejection by Department
            <span className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Total vs Rejected
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
              <Icon name="donut_large" className="text-[18px]" />
            </div>
            Overall Split
          </h3>
          <div className="w-full h-72 flex items-center justify-center">
            <Chart
              type="doughnut"
              data={doughnutData}
              options={doughnutOptions}
              className="w-full h-full"
            />
          </div>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -mt-5">
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900">
                {overallRate}%
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                Rejection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-80" />
        <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Icon name="table_chart" className="text-[18px]" />
          </div>
          Department Rejection Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Files
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rejected
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedByRate.map((d, i) => {
                const risk =
                  d.rate === 0
                    ? 'Clean'
                    : d.rate <= 15
                      ? 'Low'
                      : d.rate <= 30
                        ? 'Medium'
                        : 'High';
                const riskColor =
                  d.rate === 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : d.rate <= 15
                      ? 'bg-blue-50 text-blue-700'
                      : d.rate <= 30
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700';
                const maxRate = sortedByRate[0]?.rate || 1;
                const barWidth =
                  maxRate > 0 ? Math.max(3, (d.rate / maxRate) * 100) : 3;
                return (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {d.dept}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700 font-medium">
                      {d.total}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-bold ${d.rejected > 0 ? 'text-red-600' : 'text-gray-400'}`}
                      >
                        {d.rejected}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-gray-900">
                      {d.rate}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${riskColor}`}
                      >
                        {risk}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor:
                              d.rate === 0
                                ? '#10b981'
                                : d.rate <= 15
                                  ? '#3b82f6'
                                  : d.rate <= 30
                                    ? '#f59e0b'
                                    : '#ef4444',
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
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="warning" className="text-red-600 text-[20px]" />
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Highest Risk
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {sortedByRate[0]?.dept || '—'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {sortedByRate[0]?.rate || 0}% rejection rate —{' '}
            {sortedByRate[0]?.rejected || 0} files rejected
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="verified" className="text-emerald-600 text-[20px]" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Best Compliance
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {sortedByRate[sortedByRate.length - 1]?.dept || '—'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {sortedByRate[sortedByRate.length - 1]?.rate || 0}% rejection rate
          </p>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="lightbulb" className="text-indigo-600 text-[20px]" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Recommendation
            </span>
          </div>
          <p className="text-sm font-medium text-gray-800">
            {overallRate > 20
              ? 'High rejection rate detected. Consider implementing pre-submission checklists and training workshops.'
              : 'Rejection rates are within acceptable limits. Continue monitoring for trending changes.'}
          </p>
        </div>
      </div>
    </FormPage>
  );
}
