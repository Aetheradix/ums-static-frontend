import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { ReportExportButtons } from '../../components';
import { mockFileMovements, mockFiles, mockUsers } from '../../data';

export default function EmployeeProductivityReport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      const employees = mockUsers.filter(u => u.roleId === 7);
      const prodData = employees.map(u => {
        const filesCreated = mockFiles.filter(f => f.createdBy === u.id).length;
        const actions = mockFileMovements.filter(
          m => m.fromUserId === u.id
        ).length;
        return { name: u.name, filesCreated, actions };
      });
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: prodData.map(p => p.name),
          datasets: [
            {
              label: 'Files Created',
              data: prodData.map(p => p.filesCreated),
              backgroundColor: '#3b82f6',
              borderRadius: 4,
            },
            {
              label: 'Actions Taken',
              data: prodData.map(p => p.actions),
              backgroundColor: '#10b981',
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { title: { display: true, text: 'Employee Productivity' } },
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

  const employees = mockUsers.filter(u => u.roleId === 7);
  const totalCreated = mockFiles.length;
  const totalActions = mockFileMovements.length;

  return (
    <FormPage
      title="Employee Productivity Report"
      description="Track file creation and processing by employee"
    >
      <ReportExportButtons />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FormCard title="Total Employees">
          <div className="text-2xl font-bold text-blue-600">
            {employees.length}
          </div>
        </FormCard>
        <FormCard title="Total Files Created">
          <div className="text-2xl font-bold text-green-600">
            {totalCreated}
          </div>
        </FormCard>
        <FormCard title="Total Actions">
          <div className="text-2xl font-bold text-purple-600">
            {totalActions}
          </div>
        </FormCard>
      </div>
      <FormCard title="Productivity by Employee">
        <div className="relative h-[300px]">
          <canvas ref={canvasRef} className="w-full h-[300px]" />
        </div>
      </FormCard>
    </FormPage>
  );
}
