import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { departmentOptions, rtiAssignments, rtis } from '../../data';
import { rtiUrls } from '../../urls';

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

function ChartContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <FormCard title={title}>
      <div className="h-64">{children}</div>
    </FormCard>
  );
}

const totalNew = rtis.filter(r => r.status === 'New').length;
const totalPending = rtis.filter(
  r => r.status === 'Forwarded' || r.status === 'In Progress'
).length;
const totalResponded = rtis.filter(r => r.status === 'Responded').length;
const totalClosed = rtis.filter(r => r.status === 'Closed').length;
const totalAppealed = rtis.filter(r => r.isAppealed).length;
const totalOverdue = rtis.filter(r => r.status === 'Overdue').length;

const criticalAlerts = rtis.filter(
  r =>
    r.remainingDays === 0 && r.status !== 'Closed' && r.status !== 'Responded'
);
const threeDayAlerts = rtis.filter(
  r =>
    r.remainingDays > 0 &&
    r.remainingDays <= 3 &&
    r.status !== 'Closed' &&
    r.status !== 'Responded'
);
const sevenDayAlerts = rtis.filter(
  r =>
    r.remainingDays > 3 &&
    r.remainingDays <= 7 &&
    r.status !== 'Closed' &&
    r.status !== 'Responded'
);
const overdueAlerts = rtis.filter(r => r.status === 'Overdue');

const deptPerformance = departmentOptions.map(dept => {
  const deptAssignments = rtiAssignments.filter(a => a.department === dept);
  const completed = deptAssignments.filter(a => a.status === 'Replied').length;
  const pending = deptAssignments.filter(a => a.status !== 'Replied').length;
  const avgDays =
    completed > 0
      ? Math.round(
          deptAssignments
            .filter(a => a.repliedOn)
            .reduce((sum, a) => {
              const assigned = new Date(a.assignedOn);
              const replied = new Date(a.repliedOn);
              return (
                sum +
                Math.round(
                  (replied.getTime() - assigned.getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              );
            }, 0) / completed
        )
      : 0;
  return { department: dept, completed, pending, avgDays };
});

const monthlyTrend = (() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const received = [0, 0, 0, 0, 0, 8, 4];
  const closed = [0, 0, 0, 0, 0, 2, 1];
  return { months, received, closed };
})();

function BarChart({
  data,
}: {
  data: { months: string[]; received: number[]; closed: number[] };
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.months,
        datasets: [
          {
            label: 'Received',
            data: data.received,
            backgroundColor: '#3b82f6cc',
            borderColor: '#3b82f6',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Closed',
            data: data.closed,
            backgroundColor: '#22c55ecc',
            borderColor: '#22c55e',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
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
  return <canvas ref={ref} />;
}

function DoughnutChart({
  data,
}: {
  data: { labels: string[]; values: number[] };
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#a855f7'],
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
  return <canvas ref={ref} />;
}

export default function Dashboard() {
  const statusCounts = {
    labels: ['Closed', 'Responded', 'Pending', 'New', 'Overdue', 'Appealed'],
    values: [
      totalClosed,
      totalResponded,
      totalPending,
      totalNew,
      totalOverdue,
      totalAppealed,
    ],
  };

  return (
    <FormPage
      title="RTI Dashboard"
      description="Overview of RTI applications, deadlines, and department performance."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'RTI Management', to: rtiUrls.portal },
        { label: 'Admin Portal', to: rtiUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grid grid-cols-7 gap-4 mb-6">
        <KpiCard label="Total RTIs" value={rtis.length} color="blue" />
        <KpiCard label="New" value={totalNew} color="indigo" />
        <KpiCard label="Pending" value={totalPending} color="orange" />
        <KpiCard label="Responded" value={totalResponded} color="teal" />
        <KpiCard label="Closed" value={totalClosed} color="green" />
        <KpiCard label="Appealed" value={totalAppealed} color="purple" />
        <KpiCard label="Overdue" value={totalOverdue} color="red" />
      </div>

      <div className="mb-6">
        <FormCard title="Deadline Alerts">
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 rounded-lg border border-red-200 bg-red-50">
              <div className="text-xs font-semibold text-red-700 mb-1">
                Critical (Today)
              </div>
              {criticalAlerts.length > 0 ? (
                criticalAlerts.map(r => (
                  <div key={r.id} className="text-xs text-red-600">
                    {r.rtiNumber} - {r.subject.slice(0, 30)}...
                  </div>
                ))
              ) : (
                <div className="text-xs text-red-400">None</div>
              )}
            </div>
            <div className="p-3 rounded-lg border border-orange-200 bg-orange-50">
              <div className="text-xs font-semibold text-orange-700 mb-1">
                3 Days Left
              </div>
              {threeDayAlerts.length > 0 ? (
                threeDayAlerts.map(r => (
                  <div key={r.id} className="text-xs text-orange-600">
                    {r.rtiNumber} - {r.subject.slice(0, 30)}...
                  </div>
                ))
              ) : (
                <div className="text-xs text-orange-400">None</div>
              )}
            </div>
            <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
              <div className="text-xs font-semibold text-yellow-700 mb-1">
                7 Days Left
              </div>
              {sevenDayAlerts.length > 0 ? (
                sevenDayAlerts.map(r => (
                  <div key={r.id} className="text-xs text-yellow-600">
                    {r.rtiNumber} - {r.subject.slice(0, 30)}...
                  </div>
                ))
              ) : (
                <div className="text-xs text-yellow-400">None</div>
              )}
            </div>
            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
              <div className="text-xs font-semibold text-gray-700 mb-1">
                Overdue
              </div>
              {overdueAlerts.length > 0 ? (
                overdueAlerts.map(r => (
                  <div key={r.id} className="text-xs text-gray-600">
                    {r.rtiNumber} - {r.subject.slice(0, 30)}...
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400">None</div>
              )}
            </div>
          </div>
        </FormCard>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <ChartContainer title="Monthly RTI Trend (Last 7 Months)">
          <BarChart data={monthlyTrend} />
        </ChartContainer>
        <ChartContainer title="Overall Status Distribution">
          <DoughnutChart data={statusCounts} />
        </ChartContainer>
      </div>

      <FormCard title="Department Performance">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 text-gray-600 font-medium">
                Department
              </th>
              <th className="text-center py-2 px-3 text-gray-600 font-medium">
                Pending
              </th>
              <th className="text-center py-2 px-3 text-gray-600 font-medium">
                Completed
              </th>
              <th className="text-center py-2 px-3 text-gray-600 font-medium">
                Avg Response Time
              </th>
            </tr>
          </thead>
          <tbody>
            {deptPerformance.map(d => (
              <tr
                key={d.department}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-2 px-3 font-medium text-gray-800">
                  {d.department}
                </td>
                <td className="py-2 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.pending > 0 ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {d.pending}
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    {d.completed}
                  </span>
                </td>
                <td className="py-2 px-3 text-center text-gray-700">
                  {d.avgDays} days
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
