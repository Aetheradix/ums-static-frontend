import { useMemo } from 'react';
import { FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { Link } from 'react-router-dom';

export default function WardenDashboard() {
  const { gatePasses, leaveRequests, disciplinaryActions } = useHostel();

  // Mock warden ID / assigned hostel
  const wardenHostelId = 'H1';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-3xl text-orange-500">
              directions_walk
            </span>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {dashboardData.pendingGatePasses}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            Pending Gate Passes
          </p>
          <Link
            to="/hostel-management/student/gate-pass"
            className="text-xs text-primary-600 hover:underline font-semibold"
          >
            Review Passes →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-3xl text-purple-500">
              flight_takeoff
            </span>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {dashboardData.pendingLeaves}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            Pending Leave Requests
          </p>
          <Link
            to="/hostel-management/student/leave"
            className="text-xs text-primary-600 hover:underline font-semibold"
          >
            Review Leaves →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-3xl text-red-500">
              gavel
            </span>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {dashboardData.activeDisciplinary.length}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            Active Disciplinary Cases
          </p>
          <Link
            to="/hostel-management/student/disciplinary"
            className="text-xs text-primary-600 hover:underline font-semibold"
          >
            View Cases →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-3xl text-blue-500">
              group
            </span>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {dashboardData.outStudents.length}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            Students Currently Out
          </p>
          <Link
            to="/hostel-management/student/attendance"
            className="text-xs text-primary-600 hover:underline font-semibold"
          >
            Check Attendance →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Out Students List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">night_shelter</span>
            Missing / Out Students
          </h3>
          <div className="overflow-y-auto max-h-[300px]">
            {dashboardData.outStudents.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">
                All students are accounted for.
              </p>
            ) : (
              <div className="space-y-3">
                {dashboardData.outStudents.map(student => {
                  const isLate = new Date() > new Date(student.expectedInTime);
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
        </div>

        {/* Quick Links specific to Warden */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">star</span>
            Warden Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
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
              <span className="text-sm font-semibold">Sick Diet Approvals</span>
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
        </div>
      </div>
    </FormPage>
  );
}
