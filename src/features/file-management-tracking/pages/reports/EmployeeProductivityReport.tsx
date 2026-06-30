import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { ReportExportButtons } from '../../components';
import { mockFileMovements, mockFiles, mockUsers } from '../../data';

export default function EmployeeProductivityReport() {
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
    return () => {
      cancelAnimationFrame(frameId);
      chartRef.current?.destroy();
    };
  }, []);

  const employees = mockUsers.filter(u => u.roleId === 7);
  const totalCreated = mockFiles.length;
  const totalActions = mockFileMovements.length;

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Reports' },
        { label: 'Employee Productivity Report' },
      ]}
      title="Employee Productivity Report"
      description="Track file creation and processing by employee"
    >
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon="groups"
          colorScheme="blue"
        />
        <StatCard
          title="Total Files Created"
          value={totalCreated}
          icon="post_add"
          colorScheme="green"
        />
        <StatCard
          title="Total Actions"
          value={totalActions}
          icon="assignment_turned_in"
          colorScheme="purple"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
        <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Icon name="insert_chart" className="text-[18px]" />
          </div>
          Productivity by Employee
        </h3>
        <div className="relative h-[300px]">
          <canvas ref={canvasRef} className="w-full h-[300px]" />
        </div>
      </div>
    </FormPage>
  );
}
