import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage, StatusBadge } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { FileStatusBadge, InfoBanner } from '../../components';
import { mockFileMovements, mockFiles, mockUsers } from '../../data';

export default function ApproverDashboard() {
  const navigate = useNavigate();
  const approver = mockUsers[4];

  const pendingFiles = mockFiles.filter(
    f =>
      f.currentHolderUserId === approver.id &&
      (f.currentStatus === 'Under Review' || f.currentStatus === 'Forwarded')
  );

  const approvedCount = mockFileMovements.filter(
    m => m.action === 'Approved' && m.fromUserId === approver.id
  ).length;
  const rejectedCount = mockFileMovements.filter(
    m => m.action === 'Rejected' && m.fromUserId === approver.id
  ).length;
  const overdueCount = pendingFiles.filter(
    f => f.dueDate && new Date(f.dueDate) < new Date()
  ).length;
  const totalActions = mockFileMovements.filter(
    m => m.fromUserId === approver.id
  ).length;

  const recentActions = mockFileMovements
    .filter(m => m.fromUserId === approver.id)
    .slice(-6)
    .reverse();

  const myActions = mockFileMovements.filter(m => m.fromUserId === approver.id);
  const actionTypes = ['Approved', 'Rejected', 'Forwarded', 'Sent Back'];
  const counts = actionTypes.map(
    a => myActions.filter(m => m.action === a).length
  );
  const actionColors = [
    'rgba(16,185,129,0.85)',
    'rgba(239,68,68,0.85)',
    'rgba(59,130,246,0.85)',
    'rgba(245,158,11,0.85)',
  ];

  const barData = {
    labels: actionTypes,
    datasets: [
      {
        label: 'Actions',
        data: counts,
        backgroundColor: actionColors,
        borderRadius: 6,
        barThickness: 36,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.9)',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#94a3b8', font: { size: 11 } },
        grid: { color: 'rgba(148,163,184,0.08)', drawBorder: false },
        border: { display: false },
      },
      x: {
        ticks: { color: '#64748b', font: { size: 11, weight: '500' } },
        grid: { display: false },
        border: { display: false },
      },
    },
  };
  const approvalRate =
    totalActions > 0 ? Math.round((approvedCount / totalActions) * 100) : 0;

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
      <InfoBanner
        title="About Pending Files"
        message="Manage and view details for pending files here. Ensure that all records and logs are up-to-date."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Pending Files"
          value={pendingFiles.length}
          icon="hourglass_empty"
          colorScheme="blue"
          subtitle="Awaiting your review"
        />
        <StatCard
          title="Approved (30d)"
          value={approvedCount}
          icon="check_circle"
          colorScheme="green"
          subtitle="Files processed"
        />
        <StatCard
          title="Rejected (30d)"
          value={rejectedCount}
          icon="cancel"
          colorScheme="red"
          subtitle="Files returned"
        />
        <StatCard
          title="Overdue"
          value={overdueCount}
          icon="warning"
          colorScheme="orange"
          subtitle="Past due date"
        />
      </div>

      {/* Approval Rate Banner */}
      <div
        className={`rounded-2xl p-5 mb-8 flex items-center gap-5 ${
          approvalRate >= 70
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
            : approvalRate >= 40
              ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
        }`}
      >
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
            approvalRate >= 70
              ? 'bg-emerald-100 text-emerald-700'
              : approvalRate >= 40
                ? 'bg-amber-100 text-amber-700'
                : 'bg-blue-100 text-blue-700'
          }`}
        >
          <span className="text-2xl font-black">{approvalRate}%</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-base">
            Your Approval Rate
          </h4>
          <p className="text-sm text-gray-600 mt-0.5">
            {approvedCount} approved out of {totalActions} total actions.{' '}
            {rejectedCount} rejected, {pendingFiles.length} still in queue.
          </p>
          <div className="w-full bg-white/60 rounded-full h-2 mt-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all"
              style={{ width: `${approvalRate}%` }}
            />
          </div>
        </div>
        <div className="hidden md:block shrink-0">
          <Icon
            name={approvalRate >= 70 ? 'verified' : 'info'}
            className={`text-[36px] ${approvalRate >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}
          />
        </div>
      </div>

      {/* Charts + Pending List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Icon name="bar_chart" className="text-[18px]" />
            </div>
            Actions Breakdown
          </h3>
          <div className="w-full h-72">
            <Chart
              type="bar"
              data={barData}
              options={barOptions}
              className="w-full h-full"
            />
          </div>
          {/* Mini legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {actionTypes.map((a, i) => (
              <div
                key={a}
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50/80"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: actionColors[i] }}
                />
                <span className="text-xs text-gray-600 font-medium">{a}</span>
                <span className="text-xs font-bold text-gray-900 ml-auto">
                  {counts[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <Icon name="inbox" className="text-[18px]" />
            </div>
            Files Pending Your Review
            <span className="ml-auto text-[11px] font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">
              {pendingFiles.length} files
            </span>
          </h3>
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {pendingFiles.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <Icon
                    name="check_circle"
                    className="text-4xl text-emerald-400"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-600">
                  All caught up!
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  No pending files to review
                </p>
              </div>
            )}
            {pendingFiles.map(f => {
              const isOverdue = f.dueDate && new Date(f.dueDate) < new Date();
              return (
                <div
                  key={f.id}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border group ${
                    isOverdue
                      ? 'bg-red-50/40 border-red-100 hover:border-red-300 hover:bg-red-50'
                      : 'bg-gray-50/50 border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                  onClick={() =>
                    navigate(
                      `/file-management-tracking/approver/file-details/${f.id}`
                    )
                  }
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {f.fileNumber}
                      </span>
                      {isOverdue && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-md shrink-0">
                          <Icon name="schedule" className="text-[10px]" />
                          OVERDUE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-1">
                      {f.title}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 font-medium">
                      {f.departmentName}
                    </div>
                  </div>
                  <div className="ml-4 shrink-0 flex items-center gap-2">
                    <FileStatusBadge status={f.currentStatus} />
                    <Icon
                      name="chevron_right"
                      className="text-[18px] text-gray-300 group-hover:text-blue-400 transition-colors"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-violet-500 opacity-80" />
        <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Icon name="history" className="text-[18px]" />
          </div>
          Recent Actions
          <span className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            Last Activity
          </span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentActions.map(m => (
                <tr
                  key={m.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {m.fileNumber}
                  </td>
                  <td className="py-3 px-4 text-center">
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
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-xs truncate max-w-[200px]">
                    {m.remarks || '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                      {m.actionDate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Buttons */}
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
