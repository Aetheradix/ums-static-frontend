import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
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
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Employee' },
        { label: 'Welcome, ...' },
      ]}
      title={`Welcome, ${currentUser.name}`}
      description={`${currentUser.departmentName} — ${currentUser.roleName}`}
    >
      {/* Top Row KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="My Files"
          value={myFiles.length}
          color="blue"
          icon="folder_open"
        />
        <KpiCard
          label="In Progress"
          value={
            myFiles.filter(
              f =>
                f.currentStatus === 'Under Review' ||
                f.currentStatus === 'Forwarded'
            ).length
          }
          color="orange"
          icon="sync"
        />
        <KpiCard
          label="Approved / Closed"
          value={
            myFiles.filter(
              f =>
                f.currentStatus === 'Approved' || f.currentStatus === 'Closed'
            ).length
          }
          color="green"
          icon="check_circle"
        />
        <KpiCard
          label="Notifications"
          value={unreadNotifs.length}
          color="purple"
          icon="notifications"
        />
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column: Chart & Actions */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Icon name="bolt" className="text-[18px]" />
              </div>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              <QuickActionBtn
                icon="add"
                label="Create New File"
                onClick={() =>
                  navigate('/file-management-tracking/employee/create')
                }
              />
              <QuickActionBtn
                icon="folder_open"
                label="View All Files"
                onClick={() =>
                  navigate('/file-management-tracking/employee/manage')
                }
              />
              <QuickActionBtn
                icon="inbox"
                label="Incoming Files"
                onClick={() =>
                  navigate('/file-management-tracking/employee/incoming')
                }
              />
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 opacity-80" />
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <Icon name="pie_chart" className="text-[18px]" />
              </div>
              My Files by Status
            </h3>
            <div className="relative h-[240px]">
              <canvas ref={canvasRef} className="w-full h-[240px]" />
            </div>
          </div>
        </div>

        {/* Right Column: Lists */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Files */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group h-auto md:h-[420px] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-80" />
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Icon name="description" className="text-[18px]" />
              </div>
              My Recent Files
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {myFiles.slice(0, 6).map(f => (
                <div
                  key={f.id}
                  onClick={() =>
                    navigate(`/file-management-tracking/employee/view/${f.id}`)
                  }
                  className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:border-blue-200 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-gray-900 truncate">
                      {f.fileNumber}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-1">
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
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 opacity-80" />
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Icon name="history" className="text-[18px]" />
              </div>
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {recentMovements.map(m => (
                <div
                  key={m.id}
                  className="flex items-start gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0 ring-4 ring-blue-50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-blue-700 truncate">
                      {m.fileNumber}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold text-gray-800">
                        {m.action}
                      </span>
                      : {m.remarks?.slice(0, 60) || 'No remarks'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      {m.actionDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FormPage>
  );
}

/* ── Sub-components ── */

const KPI_COLORS: Record<
  string,
  { bg: string; border: string; text: string; iconBg: string; iconText: string }
> = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600',
  },
};

function KpiCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string | number;
  color: string;
  icon: string;
}) {
  const c = KPI_COLORS[color] || KPI_COLORS.blue;
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-transform hover:-translate-y-1 relative overflow-hidden ${c.bg} ${c.border}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div
          className={`text-xs font-bold uppercase tracking-wider ${c.text} opacity-80`}
        >
          {label}
        </div>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.iconBg} ${c.iconText}`}
        >
          <Icon name={icon} className="text-lg" />
        </div>
      </div>
      <div
        className={`text-3xl sm:text-4xl font-black tracking-tight ${c.text}`}
      >
        {value}
      </div>
    </div>
  );
}

function QuickActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-start sm:justify-center lg:justify-start gap-3 p-3 lg:p-4 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer bg-gray-50/50 w-full"
    >
      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center shrink-0">
        <Icon name={icon} className="text-[18px] text-indigo-600" />
      </div>
      <span className="text-sm font-bold text-gray-800">{label}</span>
    </button>
  );
}
