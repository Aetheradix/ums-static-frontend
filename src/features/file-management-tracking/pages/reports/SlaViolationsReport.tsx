import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage, GridPanel } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { ReportExportButtons } from '../../components';
import { mockFileMovements } from '../../data';

export default function SlaViolationsReport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const violations = mockFileMovements.filter(m => m.slaStatus === 'Violated');
  const approaching = mockFileMovements.filter(
    m => m.slaStatus === 'Approaching'
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

      const onTrack = mockFileMovements.filter(
        m => m.slaStatus === 'OnTrack'
      ).length;
      chartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['On Track', 'Approaching', 'Violated'],
          datasets: [
            {
              data: [onTrack, approaching.length, violations.length],
              backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'SLA Status Distribution',
              font: { size: 14 },
            },
            legend: {
              position: 'bottom',
              labels: { font: { size: 11 }, color: '#64748b' },
            },
          },
        },
      });
    });
    return () => {
      cancelAnimationFrame(frameId);
      chartRef.current?.destroy();
    };
  }, []);

  const onTrack = mockFileMovements.filter(
    m => m.slaStatus === 'OnTrack'
  ).length;

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
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Movements"
          value={mockFileMovements.length}
          icon="swap_horiz"
          colorScheme="blue"
        />
        <StatCard
          title="On Track"
          value={onTrack}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title="Approaching"
          value={approaching.length}
          icon="warning"
          colorScheme="orange"
        />
        <StatCard
          title="Violated"
          value={violations.length}
          icon="cancel"
          colorScheme="red"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
        <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Icon name="pie_chart" className="text-[18px]" />
          </div>
          SLA Overview
        </h3>
        <div className="relative h-[280px]">
          <canvas ref={canvasRef} className="w-full h-[280px]" />
        </div>
      </div>
      {violations.length > 0 && (
        <GridPanel
          title="SLA Violations"
          data={violations}
          columns={
            [
              { field: 'fileNumber', header: 'File #' },
              { field: 'action', header: 'Action' },
              { field: 'fromUserName', header: 'From' },
              { field: 'toUserName', header: 'To' },
              {
                field: 'daysPending',
                header: 'Days Overdue',
                cell: (row: any) => (
                  <span className="font-bold text-red-600">
                    {row.daysPending}d
                  </span>
                ),
              },
              {
                field: 'actionDate',
                header: 'Date',
                cell: (row: any) => (
                  <span className="text-xs">{row.actionDate}</span>
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
