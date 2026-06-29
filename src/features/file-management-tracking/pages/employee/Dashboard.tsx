import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { FileStatusBadge } from '../../components';
import {
  mockFileMovements,
  mockFiles,
  mockNotifications,
  mockUsers,
} from '../../data';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentUser = mockUsers[9];
  const myFiles = mockFiles.filter(f => f.createdBy === currentUser.id);
  const unreadNotifs = mockNotifications.filter(
    n => n.recipientUserId === currentUser.id && !n.isRead
  );
  const recentMovements = mockFileMovements.slice(-5).reverse();

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      const statuses = [
        'Draft',
        'Under Review',
        'Approved',
        'Rejected',
        'Closed',
      ];
      const counts = statuses.map(
        s => myFiles.filter(f => f.currentStatus === s).length
      );
      chartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: statuses,
          datasets: [
            {
              data: counts,
              backgroundColor: [
                '#94a3b8',
                '#f59e0b',
                '#10b981',
                '#ef4444',
                '#6366f1',
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { size: 11 }, color: '#64748b' },
            },
          },
        },
      });
    });
    return () => chartRef.current?.destroy();
  }, [myFiles.length]);

  return (
    <FormPage
      title={`Welcome, ${currentUser.name}`}
      description={`${currentUser.departmentName} — ${currentUser.roleName}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <FormCard title="My Files" icon="folder_open">
          <div className="text-2xl font-bold text-blue-600">
            {myFiles.length}
          </div>
        </FormCard>
        <FormCard title="In Progress" icon="sync">
          <div className="text-2xl font-bold text-orange-600">
            {
              myFiles.filter(
                f =>
                  f.currentStatus === 'Under Review' ||
                  f.currentStatus === 'Forwarded'
              ).length
            }
          </div>
        </FormCard>
        <FormCard title="Approved / Closed" icon="check_circle">
          <div className="text-2xl font-bold text-green-600">
            {
              myFiles.filter(
                f =>
                  f.currentStatus === 'Approved' || f.currentStatus === 'Closed'
              ).length
            }
          </div>
        </FormCard>
        <FormCard title="Notifications" icon="notifications">
          <div className="text-2xl font-bold text-purple-600">
            {unreadNotifs.length}
          </div>
        </FormCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <FormCard title="My Files by Status" icon="pie_chart">
          <div className="relative h-[240px]">
            <canvas ref={canvasRef} className="w-full h-[240px]" />
          </div>
        </FormCard>
        <FormCard
          title="My Recent Files"
          icon="description"
          className="md:col-span-2"
        >
          <div className="space-y-2 max-h-72 overflow-auto">
            {myFiles.slice(0, 6).map(f => (
              <div
                key={f.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer border-b"
                onClick={() =>
                  navigate(`/file-management-tracking/employee/view/${f.id}`)
                }
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {f.fileNumber}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {f.title}
                  </div>
                </div>
                <FileStatusBadge status={f.currentStatus} />
              </div>
            ))}
            {myFiles.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">
                No files yet. Create your first file!
              </p>
            )}
          </div>
        </FormCard>
      </div>

      <FormCard title="Recent Activity" icon="history" className="mb-6">
        <div className="space-y-2 max-h-64 overflow-auto">
          {recentMovements.map(m => (
            <div
              key={m.id}
              className="flex items-start gap-3 p-2 border-b text-sm"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <span className="text-xs font-medium text-blue-600 min-w-[80px]">
                {m.fileNumber}
              </span>
              <span className="text-xs text-gray-500">
                {m.action}: {m.remarks?.slice(0, 60) || 'No remarks'}
              </span>
              <span className="text-[10px] text-gray-400 ml-auto whitespace-nowrap">
                {m.actionDate}
              </span>
            </div>
          ))}
        </div>
      </FormCard>

      <div className="flex gap-3">
        <Button
          label="Create New File"
          icon="add"
          onClick={() => navigate('/file-management-tracking/employee/create')}
        />
        <Button
          label="View All Files"
          icon="folder_open"
          onClick={() => navigate('/file-management-tracking/employee/manage')}
        />
        <Button
          label="Incoming Files"
          icon="inbox"
          onClick={() =>
            navigate('/file-management-tracking/employee/incoming')
          }
        />
      </div>
    </FormPage>
  );
}
