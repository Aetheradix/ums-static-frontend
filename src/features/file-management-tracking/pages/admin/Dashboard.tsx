import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { mockDepartments, mockFileMovements, mockFiles } from '../../data';

export default function FMTSAdminDashboard() {
  const navigate = useNavigate();

  const totalFiles = mockFiles.length;
  const pendingFiles = mockFiles.filter(
    f => f.currentStatus === 'Under Review' || f.currentStatus === 'Forwarded'
  );
  const approvedFiles = mockFiles.filter(
    f => f.currentStatus === 'Approved' || f.currentStatus === 'Closed'
  );
  const overdueFiles = mockFiles.filter(
    f =>
      f.dueDate &&
      new Date(f.dueDate) < new Date() &&
      !['Closed', 'Archived', 'Approved'].includes(f.currentStatus)
  );

  const slaViolations = pendingFiles.filter(f =>
    mockFileMovements.some(m => m.fileId === f.id && m.slaStatus === 'Violated')
  ).length;

  const approvalRate =
    totalFiles > 0 ? Math.round((approvedFiles.length / totalFiles) * 100) : 0;

  const statusLabels = [
    'Draft',
    'Submitted',
    'Under Review',
    'Forwarded',
    'Approved',
    'Rejected',
    'Closed',
    'Archived',
  ];
  const statusCounts = statusLabels.map(
    s => mockFiles.filter(f => f.currentStatus === s).length
  );

  const deptLabels = mockDepartments.filter(d => d.isActive).map(d => d.name);
  const deptCounts = deptLabels.map(
    d => mockFiles.filter(f => f.departmentName === d).length
  );

  const barRef = useRef<HTMLCanvasElement>(null);
  const hbarRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<Chart | null>(null);
  const hbarChartRef = useRef<Chart | null>(null);

  const initChart = (
    canvas: HTMLCanvasElement,
    config: {
      type: any;
      labels: string[];
      data: number[];
      colors: string[];
      horizontal?: boolean;
    }
  ): Chart | null => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    return new Chart(ctx, {
      type: config.type,
      data: {
        labels: config.labels,
        datasets: [
          {
            label: 'Files',
            data: config.data,
            backgroundColor: config.colors,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: config.horizontal ? ('y' as const) : undefined,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#fff',
            bodyColor: '#cbd5e1',
          },
        },
        scales: {
          x: {
            ...(config.horizontal
              ? {
                  beginAtZero: true,
                  ticks: { stepSize: 1, color: '#94a3b8' },
                  grid: { color: 'rgba(148,163,184,0.1)' },
                }
              : {
                  grid: { display: false },
                  ticks: { color: '#94a3b8', font: { size: 11 } },
                }),
          },
          y: {
            ...(config.horizontal
              ? {
                  grid: { display: false },
                  ticks: { color: '#94a3b8', font: { size: 11 } },
                }
              : {
                  beginAtZero: true,
                  ticks: { stepSize: 1, color: '#94a3b8' },
                  grid: { color: 'rgba(148,163,184,0.1)' },
                }),
          },
        },
      },
    });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      if (barRef.current)
        barChartRef.current = initChart(barRef.current, {
          type: 'bar',
          labels: statusLabels,
          data: statusCounts,
          colors: [
            '#94a3b8',
            '#60a5fa',
            '#fbbf24',
            '#818cf8',
            '#34d399',
            '#f87171',
            '#9ca3af',
            '#a78bfa',
          ],
        });
      if (hbarRef.current)
        hbarChartRef.current = initChart(hbarRef.current, {
          type: 'bar',
          labels: deptLabels,
          data: deptCounts,
          colors: [
            '#60a5fa',
            '#34d399',
            '#fbbf24',
            '#f472b6',
            '#a78bfa',
            '#fb923c',
          ],
          horizontal: true,
        });
    });
    return () => {
      barChartRef.current?.destroy();
      hbarChartRef.current?.destroy();
    };
  }, []);

  const recentMovements = [...mockFileMovements]
    .sort(
      (a, b) =>
        new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime()
    )
    .slice(0, 5);

  return (
    <FormPage
      title="File Management Dashboard"
      description="System-wide overview of eFile tracking, approvals, and compliance"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Files"
          value={totalFiles}
          icon="folder"
          colorScheme="blue"
          subtitle="All time"
          trend={{ value: 2, direction: 'up', label: 'this week' }}
        />
        <StatCard
          title="Pending"
          value={pendingFiles.length}
          icon="hourglass_empty"
          colorScheme="orange"
          subtitle={`${slaViolations} near SLA violation`}
        />
        <StatCard
          title="Approved / Closed"
          value={approvedFiles.length}
          icon="check_circle"
          colorScheme="green"
          subtitle={`${approvalRate}% approval rate`}
        />
        <StatCard
          title="Overdue"
          value={overdueFiles.length}
          icon="warning"
          colorScheme="red"
          subtitle="Past due date — action required"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <FormCard title="Files by Status" icon="bar_chart">
          <div className="relative h-[280px]">
            <canvas ref={barRef} className="w-full h-[280px]" />
          </div>
        </FormCard>
        <FormCard title="Files by Department" icon="business">
          <div className="relative h-[280px]">
            <canvas ref={hbarRef} className="w-full h-[280px]" />
          </div>
        </FormCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <FormCard title="Recent Activity" icon="history">
          <div className="space-y-0">
            {recentMovements.map((m, i) => (
              <div
                key={m.id}
                className={`flex items-start gap-3 py-3 ${i < recentMovements.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                      m.action === 'Approved' || m.action === 'Created'
                        ? 'bg-green-400'
                        : m.action === 'Rejected' || m.action === 'Revoked'
                          ? 'bg-red-400'
                          : m.action === 'Forwarded'
                            ? 'bg-blue-400'
                            : 'bg-gray-300'
                    }`}
                  />
                  {i < recentMovements.length - 1 && (
                    <div className="w-px flex-1 bg-gray-100 min-h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900">
                      {m.fileNumber}
                    </span>
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
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {m.fromUserName} → {m.toUserName || '—'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {m.actionDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FormCard>

        <FormCard title="Overdue Files" icon="warning">
          {overdueFiles.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-400">
              No overdue files. All on track.
            </div>
          ) : (
            <div className="space-y-0">
              {overdueFiles.map((f, i) => {
                const daysOverdue = f.dueDate
                  ? Math.floor(
                      (new Date().getTime() - new Date(f.dueDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : 0;
                return (
                  <div
                    key={f.id}
                    className={`flex items-center gap-3 py-3 ${i < overdueFiles.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${daysOverdue > 5 ? 'bg-red-500' : daysOverdue > 2 ? 'bg-orange-400' : 'bg-yellow-400'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-900">
                          {f.fileNumber}
                        </span>
                        <span className="text-[10px] font-medium text-red-600">
                          {daysOverdue}d overdue
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {f.title}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Holder: {f.currentHolderUserName || 'Unassigned'}
                      </p>
                    </div>
                    <Button
                      icon="visibility"
                      variant="text"
                      size="small"
                      onClick={() =>
                        navigate(`/file-management-tracking/admin/inbox`)
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}
        </FormCard>
      </div>

      <FormCard title="Quick Actions" icon="bolt">
        <div className="flex flex-wrap gap-3">
          <Button
            label="File Types"
            icon="description"
            onClick={() =>
              navigate('/file-management-tracking/admin/file-types')
            }
          />
          <Button
            label="Departments"
            icon="business"
            onClick={() =>
              navigate('/file-management-tracking/admin/departments')
            }
          />
          <Button
            label="Users"
            icon="people"
            onClick={() => navigate('/file-management-tracking/admin/users')}
          />
          <Button
            label="Workflows"
            icon="alt_route"
            onClick={() =>
              navigate('/file-management-tracking/admin/workflows')
            }
          />
          <Button
            label="Diary Config"
            icon="settings"
            onClick={() =>
              navigate('/file-management-tracking/admin/diary-config')
            }
          />
          <Button
            label="Audit Logs"
            icon="history"
            onClick={() =>
              navigate('/file-management-tracking/admin/audit-logs')
            }
          />
          <Button
            label="Retention Policies"
            icon="archive"
            onClick={() =>
              navigate('/file-management-tracking/admin/retention-policies')
            }
          />
          <Button
            label="Print Center"
            icon="print"
            onClick={() =>
              navigate('/file-management-tracking/admin/print-center')
            }
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
