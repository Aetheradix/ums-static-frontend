import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage, GridPanel, StatusBadge } from 'shared/new-components';
import { ReportExportButtons } from '../../components';
import { mockFiles } from '../../data';

export default function PendingFilesReport() {
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pendingFiles = mockFiles.filter(
    f =>
      f.currentStatus === 'Under Review' ||
      f.currentStatus === 'Forwarded' ||
      f.currentStatus === 'Returned for Clarification'
  );

  useEffect(() => {
    let frameId: number;
    frameId = requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const statusCounts: Record<string, number> = {};
      pendingFiles.forEach(f => {
        statusCounts[f.currentStatus] =
          (statusCounts[f.currentStatus] || 0) + 1;
      });
      chartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(statusCounts),
          datasets: [
            {
              data: Object.values(statusCounts),
              backgroundColor: ['#f59e0b', '#3b82f6', '#ef4444'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Pending Files by Status' },
          },
        },
      });
    });
    return () => {
      cancelAnimationFrame(frameId);
      chartRef.current?.destroy();
    };
  }, []);

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
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
          <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Icon name="pie_chart" className="text-[18px]" />
            </div>
            Pending Summary
          </h3>
          <div className="relative h-[250px] flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-[250px]" />
          </div>
        </div>

        <div className="lg:col-span-2">
          <GridPanel
            title="Pending Files List"
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
                  header: 'With',
                  cell: (row: any) => (
                    <span>{row.currentHolderUserName || '—'}</span>
                  ),
                },
                {
                  field: 'dueDate',
                  header: 'Due',
                  cell: (row: any) => (
                    <span className="text-xs font-medium">
                      {row.dueDate || '—'}
                    </span>
                  ),
                },
              ] as any
            }
            dataKey="id"
            searchBox
            pagination={{ rows: 10 }}
          />
        </div>
      </div>
    </FormPage>
  );
}
