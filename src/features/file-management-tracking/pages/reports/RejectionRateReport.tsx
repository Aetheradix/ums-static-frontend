import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { ReportExportButtons } from '../../components';
import { mockFileMovements, mockFiles } from '../../data';

export default function RejectionRateReport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
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
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: deptData.map(d => d.dept),
          datasets: [
            {
              label: 'Total Files',
              data: deptData.map(d => d.total),
              backgroundColor: '#3b82f6',
              borderRadius: 4,
            },
            {
              label: 'Rejected',
              data: deptData.map(d => d.rejected),
              backgroundColor: '#ef4444',
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Rejection Rate by Department',
              font: { size: 14 },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1, color: '#94a3b8' },
              grid: { color: 'rgba(148,163,184,0.1)' },
            },
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
          },
        },
      });
    });
    return () => chartRef.current?.destroy();
  }, []);

  const totalRejected = mockFileMovements.filter(
    m => m.action === 'Rejected'
  ).length;
  const totalFiles = mockFiles.length;
  const overallRate =
    totalFiles > 0 ? Math.round((totalRejected / totalFiles) * 100) : 0;

  return (
    <FormPage
      title="Rejection Rate Report"
      description="Analyze file rejection patterns across departments"
    >
      <ReportExportButtons />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FormCard title="Total Files">
          <div className="text-2xl font-bold text-blue-600">{totalFiles}</div>
        </FormCard>
        <FormCard title="Total Rejected">
          <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
        </FormCard>
        <FormCard title="Overall Rejection Rate">
          <div className="text-2xl font-bold text-orange-600">
            {overallRate}%
          </div>
        </FormCard>
      </div>
      <FormCard title="Rejection by Department">
        <div className="relative h-[300px]">
          <canvas ref={canvasRef} className="w-full h-[300px]" />
        </div>
      </FormCard>
    </FormPage>
  );
}
