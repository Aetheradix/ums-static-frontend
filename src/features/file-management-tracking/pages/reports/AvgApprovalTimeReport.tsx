import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { ReportExportButtons } from '../../components';
import { mockFileMovements, mockFiles } from '../../data';

export default function AvgApprovalTimeReport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
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
    return () => chartRef.current?.destroy();
  }, []);

  const totalApprovals = mockFileMovements.filter(
    m => m.action === 'Approved'
  ).length;
  const depts = [...new Set(mockFiles.map(f => f.departmentName))];

  return (
    <FormPage
      title="Average Approval Time Report"
      description="Track file approval efficiency across departments"
    >
      <ReportExportButtons />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FormCard title="Total Approvals">
          <div className="text-2xl font-bold text-green-600">
            {totalApprovals}
          </div>
        </FormCard>
        <FormCard title="Departments">
          <div className="text-2xl font-bold text-blue-600">{depts.length}</div>
        </FormCard>
        <FormCard title="Files Tracked">
          <div className="text-2xl font-bold text-purple-600">
            {mockFiles.length}
          </div>
        </FormCard>
      </div>
      <FormCard title="Avg Approval Time by Department">
        <div className="relative h-[300px]">
          <canvas ref={canvasRef} className="w-full h-[300px]" />
        </div>
      </FormCard>
    </FormPage>
  );
}
