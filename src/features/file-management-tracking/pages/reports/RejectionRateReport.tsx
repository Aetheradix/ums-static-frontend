import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { ReportExportButtons } from '../../components';
import { mockFileMovements, mockFiles } from '../../data';

export default function RejectionRateReport() {
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
    return () => {
      cancelAnimationFrame(frameId);
      chartRef.current?.destroy();
    };
  }, []);

  const totalRejected = mockFileMovements.filter(
    m => m.action === 'Rejected'
  ).length;
  const totalFiles = mockFiles.length;
  const overallRate =
    totalFiles > 0 ? Math.round((totalRejected / totalFiles) * 100) : 0;

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
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Files"
          value={totalFiles}
          icon="folder"
          colorScheme="blue"
        />
        <StatCard
          title="Total Rejected"
          value={totalRejected}
          icon="cancel"
          colorScheme="red"
        />
        <StatCard
          title="Overall Rejection Rate"
          value={`${overallRate}%`}
          icon="trending_down"
          colorScheme="orange"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
        <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Icon name="bar_chart" className="text-[18px]" />
          </div>
          Rejection by Department
        </h3>
        <div className="relative h-[300px]">
          <canvas ref={canvasRef} className="w-full h-[300px]" />
        </div>
      </div>
    </FormPage>
  );
}
