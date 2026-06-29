import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel, Tabs } from 'shared/new-components';
import { ToastService } from 'services';
import { rtiUrls } from '../../urls';
import { rtis, rtiAssignments, departmentOptions } from '../../data';

function BarChart({
  labels,
  datasets,
}: {
  labels: string[];
  datasets: { label: string; data: number[]; color: string }[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: datasets.map(d => ({
          label: d.label,
          data: d.data,
          backgroundColor: d.color + 'cc',
          borderColor: d.color,
          borderWidth: 1,
          borderRadius: 4,
        })),
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
  }, [labels, datasets]);
  return <canvas ref={ref} />;
}

function DoughnutChart({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              '#3b82f6',
              '#22c55e',
              '#f59e0b',
              '#ef4444',
              '#a855f7',
              '#14b8a6',
              '#f97316',
            ],
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
  }, [labels, values]);
  return <canvas ref={ref} />;
}

export default function ReportsAnalytics() {
  const statusCounts = (() => {
    const counts: Record<string, number> = {};
    rtis.forEach(r => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return { labels: Object.keys(counts), values: Object.values(counts) };
  })();

  const deptData = departmentOptions.map(dept => {
    const deptRtis = rtiAssignments.filter(a => a.department === dept);
    return {
      department: dept,
      total: deptRtis.length,
      completed: deptRtis.filter(a => a.status === 'Replied').length,
      pending: deptRtis.filter(a => a.status !== 'Replied').length,
      overdue: deptRtis.filter(a => a.status === 'Overdue').length,
    };
  });

  const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  const handleExport = (format: string) => {
    ToastService.success(`Report exported as ${format}.`);
  };

  return (
    <FormPage
      title="Reports & Analytics"
      description="Analyze RTI data with charts, department-wise statistics, and export options."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'RTI Management', to: rtiUrls.portal },
        { label: 'Admin Portal', to: rtiUrls.admin.portal },
        { label: 'Reports' },
      ]}
      headerAction={
        <div className="flex gap-2">
          <Button
            label="PDF"
            icon="file"
            variant="outlined"
            size="small"
            onClick={() => handleExport('PDF')}
          />
          <Button
            label="Excel"
            icon="table"
            variant="outlined"
            size="small"
            onClick={() => handleExport('Excel')}
          />
          <Button
            label="CSV"
            icon="download"
            variant="outlined"
            size="small"
            onClick={() => handleExport('CSV')}
          />
        </div>
      }
    >
      <FormCard>
        <Tabs
          tabs={[
            {
              title: 'Summary',
              content: (
                <div className="grid grid-cols-2 gap-4">
                  <FormCard title="RTI Status Distribution">
                    <div className="h-64">
                      <DoughnutChart
                        labels={statusCounts.labels}
                        values={statusCounts.values}
                      />
                    </div>
                  </FormCard>
                  <FormCard title="Monthly RTI Trend">
                    <div className="h-64">
                      <BarChart
                        labels={monthlyLabels}
                        datasets={[
                          {
                            label: 'Received',
                            data: [0, 0, 0, 0, 0, 8, 4],
                            color: '#3b82f6',
                          },
                          {
                            label: 'Closed',
                            data: [0, 0, 0, 0, 0, 2, 1],
                            color: '#22c55e',
                          },
                        ]}
                      />
                    </div>
                  </FormCard>
                </div>
              ),
            },
            {
              title: 'Department-wise',
              content: (
                <GridPanel
                  data={deptData}
                  columns={[
                    { field: 'department', header: 'Department' },
                    { field: 'total', header: 'Total Assigned' },
                    {
                      header: 'Completed',
                      cell: (item: (typeof deptData)[0]) => (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          {item.completed}
                        </span>
                      ),
                    },
                    {
                      header: 'Pending',
                      cell: (item: (typeof deptData)[0]) => (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.pending > 0 ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-500'}`}
                        >
                          {item.pending}
                        </span>
                      ),
                    },
                    {
                      header: 'Overdue',
                      cell: (item: (typeof deptData)[0]) => (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.overdue > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-500'}`}
                        >
                          {item.overdue}
                        </span>
                      ),
                    },
                    {
                      header: 'Completion Rate',
                      cell: (item: (typeof deptData)[0]) => (
                        <span className="text-sm font-medium">
                          {item.total > 0
                            ? Math.round((item.completed / item.total) * 100)
                            : 0}
                          %
                        </span>
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: 'Priority Analysis',
              content: (
                <div className="h-64">
                  <BarChart
                    labels={['Normal', 'High', 'Urgent']}
                    datasets={[
                      {
                        label: 'Total RTIs',
                        data: [
                          rtis.filter(r => r.priority === 'Normal').length,
                          rtis.filter(r => r.priority === 'High').length,
                          rtis.filter(r => r.priority === 'Urgent').length,
                        ],
                        color: '#3b82f6',
                      },
                    ]}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
