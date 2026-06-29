import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatusBadge } from 'shared/new-components';
import { FileStatusBadge } from '../../components';
import { mockFileMovements, mockFiles, mockUsers } from '../../data';

export default function ApproverDashboard() {
  const navigate = useNavigate();
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const approver = mockUsers[4];
  const pendingFiles = mockFiles.filter(
    f =>
      f.currentHolderUserId === approver.id &&
      (f.currentStatus === 'Under Review' || f.currentStatus === 'Forwarded')
  );
  const recentActions = mockFileMovements
    .filter(m => m.fromUserId === approver.id)
    .slice(-5)
    .reverse();

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      const myActions = mockFileMovements.filter(
        m => m.fromUserId === approver.id
      );
      const actionTypes = ['Approved', 'Rejected', 'Forwarded', 'Sent Back'];
      const counts = actionTypes.map(
        a => myActions.filter(m => m.action === a).length
      );
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: actionTypes,
          datasets: [
            {
              label: 'Actions',
              data: counts,
              backgroundColor: ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'],
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
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

  return (
    <FormPage
      title={`Approver Dashboard — ${approver.name}`}
      description="Review and process files assigned to you"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <FormCard title="Pending Files" icon="hourglass_empty">
          <div className="text-2xl font-bold text-orange-600">
            {pendingFiles.length}
          </div>
        </FormCard>
        <FormCard title="Approved (30d)" icon="check_circle">
          <div className="text-2xl font-bold text-green-600">
            {
              mockFileMovements.filter(
                m => m.action === 'Approved' && m.fromUserId === approver.id
              ).length
            }
          </div>
        </FormCard>
        <FormCard title="Rejected (30d)" icon="cancel">
          <div className="text-2xl font-bold text-red-600">
            {
              mockFileMovements.filter(
                m => m.action === 'Rejected' && m.fromUserId === approver.id
              ).length
            }
          </div>
        </FormCard>
        <FormCard title="Overdue" icon="warning">
          <div className="text-2xl font-bold text-red-600">
            {
              pendingFiles.filter(
                f => f.dueDate && new Date(f.dueDate) < new Date()
              ).length
            }
          </div>
        </FormCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <FormCard title="My Actions Breakdown" icon="bar_chart">
          <div className="relative h-[240px]">
            <canvas ref={canvasRef} className="w-full h-[240px]" />
          </div>
        </FormCard>
        <FormCard
          title="Files Pending Your Review"
          icon="inbox"
          className="md:col-span-2"
        >
          <div className="space-y-2 max-h-72 overflow-auto">
            {pendingFiles.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">
                No pending files. All caught up!
              </p>
            )}
            {pendingFiles.map(f => (
              <div
                key={f.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer border-b"
                onClick={() =>
                  navigate(
                    `/file-management-tracking/approver/file-details/${f.id}`
                  )
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
          </div>
        </FormCard>
      </div>

      <FormCard title="Recent Actions" icon="history" className="mb-6">
        <div className="space-y-2 max-h-64 overflow-auto">
          {recentActions.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No recent actions.
            </p>
          )}
          {recentActions.map(m => (
            <div
              key={m.id}
              className="flex items-start gap-2 p-2 border-b text-sm"
            >
              <StatusBadge
                label={m.action}
                variant={
                  m.action === 'Approved'
                    ? 'approved'
                    : m.action === 'Rejected'
                      ? 'rejected'
                      : 'pending'
                }
              />
              <span className="text-xs text-gray-500">
                {m.fileNumber} — {m.remarks?.slice(0, 60)}
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
          label="View Inbox"
          icon="inbox"
          onClick={() => navigate('/file-management-tracking/approver/inbox')}
        />
        <Button
          label="View Reports"
          icon="bar_chart"
          onClick={() => navigate('/file-management-tracking/approver/reports')}
        />
      </div>
    </FormPage>
  );
}
