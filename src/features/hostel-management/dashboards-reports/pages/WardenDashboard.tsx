import { useMemo } from 'react';
import { FormPage, StatCard, FormCard } from 'shared/new-components';
import { useHostel } from '../../context';
import { Link } from 'react-router-dom';
import { Chart } from 'primereact/chart';

// ─── Mock Data & Chart Configs ───────────────────────────────────────────────

const GATE_PASS_TREND = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  requests: [5, 8, 4, 12, 25, 30, 15],
};

const LEAVE_STATUS = {
  approved: 120,
  pending: 15,
  rejected: 5,
};

const DISCIPLINARY_SEVERITY = {
  labels: ['Low', 'Medium', 'High', 'Critical'],
  data: [12, 5, 2, 0],
};

const gatePassChartData = {
  labels: GATE_PASS_TREND.days,
  datasets: [
    {
      label: 'Gate Pass Requests',
      data: GATE_PASS_TREND.requests,
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    },
  ],
};

const leaveStatusChartData = {
  labels: ['Approved', 'Pending', 'Rejected'],
  datasets: [
    {
      data: [
        LEAVE_STATUS.approved,
        LEAVE_STATUS.pending,
        LEAVE_STATUS.rejected,
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      hoverOffset: 4,
      borderWidth: 0,
    },
  ],
};

const disciplinaryChartData = {
  labels: DISCIPLINARY_SEVERITY.labels,
  datasets: [
    {
      label: 'Active Cases',
      data: DISCIPLINARY_SEVERITY.data,
      backgroundColor: 'rgba(239, 68, 68, 0.85)',
      borderRadius: 4,
    },
  ],
};

const commonOptions = {
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: '#94a3b8', padding: 16, font: { size: 12 } },
    },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(148,163,184,0.1)' },
      ticks: { color: '#94a3b8' },
    },
  },
  maintainAspectRatio: false,
};

const doughnutOptions = {
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: '#94a3b8',
        padding: 16,
        font: { size: 12 },
        boxWidth: 12,
        borderRadius: 4,
      },
    },
  },
  cutout: '65%',
  maintainAspectRatio: false,
};

export default function WardenDashboard() {
  const { gatePasses, leaveRequests, disciplinaryActions } = useHostel();

  // Mock warden ID / assigned hostel
  const wardenHostelId = 'H-001';

  const dashboardData = useMemo(() => {
    // Pending Approvals
    const pendingGatePasses = gatePasses.filter(
      g => g.hostelId === wardenHostelId && g.status === 'PENDING'
    ).length;
    const pendingLeaves = leaveRequests.filter(
      l => l.hostelId === wardenHostelId && l.status === 'PENDING'
    ).length;

    // Active Issues (Disciplinary)
    const activeDisciplinary = disciplinaryActions.filter(
      d => d.hostelId === wardenHostelId
    );

    // Attendance alerts (Mocking students who haven't checked in)
    const outStudents = gatePasses.filter(
      g =>
        g.hostelId === wardenHostelId &&
        g.status === 'APPROVED' &&
        !g.actualInTime
    );

    return {
      pendingGatePasses,
      pendingLeaves,
      activeDisciplinary,
      outStudents,
    };
  }, [gatePasses, leaveRequests, disciplinaryActions, wardenHostelId]);

  return (
    <FormPage
      title="Warden Dashboard"
      description={`Overview for Hostel ${wardenHostelId}. Manage approvals and student well-being.`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Dashboards',
          to: '/hostel-management/reports/admin-dashboard',
        },
        { label: 'Warden Dashboard' },
      ]}
    >
      {/* Top Cards for Action Items */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Link to="/hostel-management/student/gate-pass">
          <StatCard
            title="Pending Gate Passes"
            value={dashboardData.pendingGatePasses}
            icon="directions_walk"
            colorScheme="orange"
            subtitle="Awaiting Approval"
          />
        </Link>
        <Link to="/hostel-management/student/leave">
          <StatCard
            title="Pending Leave Requests"
            value={dashboardData.pendingLeaves}
            icon="flight_takeoff"
            colorScheme="purple"
            subtitle="Awaiting Approval"
          />
        </Link>
        <Link to="/hostel-management/student/disciplinary">
          <StatCard
            title="Active Disciplinary Cases"
            value={dashboardData.activeDisciplinary.length}
            icon="gavel"
            colorScheme="red"
            subtitle="Needs attention"
          />
        </Link>
        <Link to="/hostel-management/student/attendance">
          <StatCard
            title="Students Currently Out"
            value={dashboardData.outStudents.length}
            icon="group"
            colorScheme="blue"
            subtitle="Out on approved pass"
          />
        </Link>
      </div>

      {/* ─── Analytics Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FormCard
          title="Gate Pass Trend"
          icon="trending_up"
          className="lg:col-span-2"
        >
          <div className="h-[250px] w-full">
            <Chart
              type="line"
              data={gatePassChartData}
              options={commonOptions}
              className="h-full w-full"
            />
          </div>
        </FormCard>
        <FormCard title="Leave Distribution" icon="donut_large">
          <div className="h-[250px] w-full flex items-center justify-center">
            <Chart
              type="doughnut"
              data={leaveStatusChartData}
              options={doughnutOptions}
              className="h-full w-full"
            />
          </div>
        </FormCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Out Students List */}
        <div className="lg:col-span-2 flex flex-col">
          <FormCard
            title="Missing / Out Students"
            icon="night_shelter"
            className="flex-1"
          >
            <div className="overflow-y-auto max-h-[400px]">
              {dashboardData.outStudents.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">
                  All students are accounted for.
                </p>
              ) : (
                <div className="space-y-3">
                  {dashboardData.outStudents.map(student => {
                    const isLate =
                      new Date() > new Date(student.expectedInTime);
                    return (
                      <div
                        key={student.id}
                        className="flex justify-between items-center p-3 border border-slate-100 dark:border-slate-700 rounded-lg"
                      >
                        <div>
                          <div className="font-semibold text-sm">
                            {student.studentName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {student.studentId}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500 mb-1">
                            Expected:{' '}
                            {student.expectedInTime.split('T')[1]?.slice(0, 5)}
                          </div>
                          {isLate ? (
                            <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded">
                              Late
                            </span>
                          ) : (
                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              On Pass
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </FormCard>
        </div>

        {/* Side Panel: Disciplinary & Actions */}
        <div className="flex flex-col gap-6">
          <FormCard title="Disciplinary Cases" icon="gavel">
            <div className="h-[180px] w-full">
              <Chart
                type="bar"
                data={disciplinaryChartData}
                options={commonOptions}
                className="h-full w-full"
              />
            </div>
          </FormCard>

          <FormCard title="Warden Actions" icon="star">
            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/hostel-management/student/attendance"
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                <span className="material-symbols-outlined text-primary-600 text-3xl">
                  how_to_reg
                </span>
                <span className="text-sm font-semibold">Mark Roll Call</span>
              </Link>
              <Link
                to="/hostel-management/student/incident"
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                <span className="material-symbols-outlined text-primary-600 text-3xl">
                  report
                </span>
                <span className="text-sm font-semibold">Report Incident</span>
              </Link>
              <Link
                to="/hostel-management/health/sick-diet"
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                <span className="material-symbols-outlined text-primary-600 text-3xl">
                  restaurant
                </span>
                <span className="text-sm font-semibold">
                  Sick Diet Approvals
                </span>
              </Link>
              <Link
                to="/hostel-management/health/first-aid"
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                <span className="material-symbols-outlined text-primary-600 text-3xl">
                  healing
                </span>
                <span className="text-sm font-semibold">Log First Aid</span>
              </Link>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
