import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { ReportExportButtons } from '../../components';
import { mockFileMovements, mockFiles } from '../../data';

export default function AvgApprovalTimeReport() {
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
      const avgTimes = depts.map(dept => {
        const deptFiles = mockFiles.filter(f => f.departmentName === dept);
        const approvals = mockFileMovements.filter(
          m => m.action === 'Approved' && deptFiles.some(f => f.id === m.fileId)
        );
        const times = approvals
          .map(a => {
            const created = mockFiles.find(f => f.id === a.fileId)?.createdAt;
            if (!created) return 0;
            return (
              (new Date(a.actionDate).getTime() - new Date(created).getTime()) /
              (1000 * 60 * 60 * 24)
            );
          })
          .filter(t => t > 0);
        return {
          dept,
          avg:
            times.length > 0
              ? times.reduce((s, t) => s + t, 0) / times.length
              : 0,
        };
      });
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: avgTimes.map(a => a.dept),
          datasets: [
            {
              label: 'Avg Approval Time (days)',
              data: avgTimes.map(a => Math.round(a.avg * 10) / 10),
              backgroundColor: '#3b82f6',
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
              text: 'Average Approval Time by Department',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#94a3b8' },
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

  const totalApprovals = mockFileMovements.filter(
    m => m.action === 'Approved'
  ).length;
  const depts = [...new Set(mockFiles.map(f => f.departmentName))];

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Reports' },
        { label: 'Average Approval Time Report' },
      ]}
      title="Average Approval Time Report"
      description="Track file approval efficiency across departments"
    >
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Approvals"
          value={totalApprovals}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title="Departments"
          value={depts.length}
          icon="domain"
          colorScheme="blue"
        />
        <StatCard
          title="Files Tracked"
          value={mockFiles.length}
          icon="description"
          colorScheme="purple"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
        <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Icon name="stacked_bar_chart" className="text-[18px]" />
          </div>
          Average Approval Time by Department
        </h3>
        <div className="relative h-[300px]">
          <canvas ref={canvasRef} className="w-full h-[300px]" />
        </div>
      </div>
    </FormPage>
  );
}
