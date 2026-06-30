import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage, StatusBadge } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
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
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Approver' },
        { label: 'Approver Dashboard — ...' },
      ]}
      title={`Approver Dashboard — ${approver.name}`}
      description="Review and process files assigned to you"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pending Files"
          value={pendingFiles.length}
          icon="hourglass_empty"
          colorScheme="blue"
        />
        <StatCard
          title="Approved (30d)"
          value={
            mockFileMovements.filter(
              m => m.action === 'Approved' && m.fromUserId === approver.id
            ).length
          }
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title="Rejected (30d)"
          value={
            mockFileMovements.filter(
              m => m.action === 'Rejected' && m.fromUserId === approver.id
            ).length
          }
          icon="cancel"
          colorScheme="red"
        />
        <StatCard
          title="Overdue"
          value={
            pendingFiles.filter(
              f => f.dueDate && new Date(f.dueDate) < new Date()
            ).length
          }
          icon="warning"
          colorScheme="orange"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
          <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Icon name="bar_chart" className="text-[18px]" />
            </div>
            My Actions Breakdown
          </h3>
          <div className="relative h-[280px] w-full flex-grow">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 opacity-80" />
          <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <Icon name="inbox" className="text-[18px]" />
            </div>
            Files Pending Your Review
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {pendingFiles.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Icon
                  name="check_circle"
                  className="text-4xl mb-3 text-gray-300"
                />
                <p className="text-sm font-medium">
                  No pending files. All caught up!
                </p>
              </div>
            )}
            {pendingFiles.map(f => (
              <div
                key={f.id}
                className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-xl cursor-pointer transition-colors group"
                onClick={() =>
                  navigate(
                    `/file-management-tracking/approver/file-details/${f.id}`
                  )
                }
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {f.fileNumber}
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-1">
                    {f.title}
                  </div>
                </div>
                <div className="ml-4 shrink-0">
                  <FileStatusBadge status={f.currentStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 opacity-80" />
        <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Icon name="history" className="text-[18px]" />
          </div>
          Recent Actions
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {recentActions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Icon name="history" className="text-3xl mb-2 text-gray-300" />
              <p className="text-sm">No recent actions.</p>
            </div>
          )}
          {recentActions.map(m => (
            <div
              key={m.id}
              className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
            >
              <div className="shrink-0 w-28">
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
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {m.fileNumber}
                </div>
                {m.remarks && (
                  <div className="text-xs text-gray-500 truncate mt-0.5">
                    {m.remarks}
                  </div>
                )}
              </div>
              <div className="shrink-0 text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                {m.actionDate}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button
          label="View Inbox"
          icon="inbox"
          onClick={() => navigate('/file-management-tracking/approver/inbox')}
        />
        <Button
          label="View Reports"
          icon="chart-bar"
          variant="outlined"
          onClick={() => navigate('/file-management-tracking/approver/reports')}
        />
      </div>
    </FormPage>
  );
}
