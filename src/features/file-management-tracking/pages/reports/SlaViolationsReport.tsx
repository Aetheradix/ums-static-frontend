import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
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
    requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
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
    return () => chartRef.current?.destroy();
  }, []);

  const onTrack = mockFileMovements.filter(
    m => m.slaStatus === 'OnTrack'
  ).length;
  const noSla = mockFileMovements.filter(m => !m.slaStatus).length;

  return (
    <FormPage
      title="SLA Violations Report"
      description="Monitor SLA compliance across file movements"
    >
      <ReportExportButtons />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormCard title="SLA Overview">
          <div className="relative h-[280px]">
            <canvas ref={canvasRef} className="w-full h-[280px]" />
          </div>
        </FormCard>
        <FormCard title="Summary">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span>On Track</span>
              <span className="font-bold text-green-600">{onTrack}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <span>Approaching SLA</span>
              <span className="font-bold text-yellow-600">
                {approaching.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span>Violations</span>
              <span className="font-bold text-red-600">
                {violations.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>No SLA Set</span>
              <span className="font-bold text-gray-400">{noSla}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between">
              <span>Total Movements</span>
              <span className="font-bold">{mockFileMovements.length}</span>
            </div>
          </div>
        </FormCard>
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
