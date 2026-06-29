import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
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
    requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
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
    return () => chartRef.current?.destroy();
  }, []);

  return (
    <FormPage
      title="Pending Files Report"
      description="All files awaiting action"
    >
      <ReportExportButtons />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormCard title="Pending Summary">
          <canvas ref={canvasRef} className="w-full h-[250px]" />
        </FormCard>
      </div>
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
                <span className="text-xs">{row.dueDate || '—'}</span>
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
