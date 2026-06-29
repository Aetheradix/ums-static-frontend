import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { ReportExportButtons } from '../../components';
import { mockFileMovements } from '../../data';

export default function FileMovementReport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
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
    return () => chartRef.current?.destroy();
  }, []);

  const totalMovements = mockFileMovements.length;
  const uniqueFiles = new Set(mockFileMovements.map(m => m.fileId)).size;
  const avgPerFile = (totalMovements / (uniqueFiles || 1)).toFixed(1);

  return (
    <FormPage
      title="File Movement Report"
      description="Analysis of file movement patterns"
    >
      <ReportExportButtons />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FormCard title="Total Movements">
          <div className="text-2xl font-bold text-blue-600">
            {totalMovements}
          </div>
        </FormCard>
        <FormCard title="Files with Movement">
          <div className="text-2xl font-bold text-green-600">{uniqueFiles}</div>
        </FormCard>
        <FormCard title="Avg Movements/File">
          <div className="text-2xl font-bold text-purple-600">{avgPerFile}</div>
        </FormCard>
      </div>
      <FormCard title="Movement by Action Type">
        <div className="relative h-[300px]">
          <canvas ref={canvasRef} className="w-full h-[300px]" />
        </div>
      </FormCard>
    </FormPage>
  );
}
