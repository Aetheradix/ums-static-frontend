import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { ReportExportButtons } from '../../components';
import { mockFileMovements } from '../../data';

export default function FileMovementReport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    let frameId: number;
    frameId = requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const actionCounts: Record<string, number> = {};
      mockFileMovements.forEach(m => {
        actionCounts[m.action] = (actionCounts[m.action] || 0) + 1;
      });
      const labels = Object.keys(actionCounts);
      const data = Object.values(actionCounts);
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Movements',
              data,
              backgroundColor: [
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
                '#ec4899',
                '#14b8a6',
                '#f97316',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: 'File Movements by Action Type' },
          },
        },
      });
    });
    return () => {
      cancelAnimationFrame(frameId);
      chartRef.current?.destroy();
    };
  }, []);

  const totalMovements = mockFileMovements.length;
  const uniqueFiles = new Set(mockFileMovements.map(m => m.fileId)).size;
  const avgPerFile = (totalMovements / (uniqueFiles || 1)).toFixed(1);

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
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Movements"
          value={totalMovements}
          icon="swap_horiz"
          colorScheme="blue"
        />
        <StatCard
          title="Files with Movement"
          value={uniqueFiles}
          icon="folder_open"
          colorScheme="green"
        />
        <StatCard
          title="Avg Movements/File"
          value={avgPerFile}
          icon="analytics"
          colorScheme="purple"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
        <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Icon name="bar_chart" className="text-[18px]" />
          </div>
          Movement by Action Type
        </h3>
        <div className="relative h-[300px]">
          <canvas ref={canvasRef} className="w-full h-[300px]" />
        </div>
      </div>
    </FormPage>
  );
}
