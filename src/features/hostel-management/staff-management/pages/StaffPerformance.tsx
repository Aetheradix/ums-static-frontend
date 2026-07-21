import { useState, useMemo } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function StaffPerformance() {
  const { hostelStaff, maintenanceRequests, staffAttendance } = useHostel();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM

  // Calculate performance metrics for each active staff member
  const performanceData = useMemo(() => {
    return hostelStaff
      .filter(s => s.status === 'ACTIVE')
      .map(staff => {
        // 1. Attendance Metrics
        const monthlyAttendance = staffAttendance.filter(
          a => a.staffId === staff.id && a.date.startsWith(selectedMonth)
        );
        const daysPresent = monthlyAttendance.filter(
          a => a.status === 'PRESENT' || a.status === 'HALF_DAY'
        ).length;

        // 2. Task / Maintenance Metrics
        const assignedTasks = maintenanceRequests.filter(
          m =>
            m.assignedTo === staff.id && m.requestDate.startsWith(selectedMonth)
        );
        const resolvedTasks = assignedTasks.filter(
          m => m.status === 'RESOLVED' || m.status === 'CLOSED'
        );

        const completionRate =
          assignedTasks.length > 0
            ? Math.round((resolvedTasks.length / assignedTasks.length) * 100)
            : 100;

        // 3. Feedback Metrics (Average Score)
        const tasksWithFeedback = resolvedTasks.filter(
          m => typeof m.feedbackScore === 'number'
        );
        const avgFeedback =
          tasksWithFeedback.length > 0
            ? (
                tasksWithFeedback.reduce(
                  (sum, task) => sum + (task.feedbackScore || 0),
                  0
                ) / tasksWithFeedback.length
              ).toFixed(1)
            : 'N/A';

        return {
          ...staff,
          daysPresent,
          tasksAssigned: assignedTasks.length,
          tasksResolved: resolvedTasks.length,
          completionRate,
          avgFeedback,
        };
      });
  }, [hostelStaff, maintenanceRequests, staffAttendance, selectedMonth]);

  return (
    <FormPage
      title="Staff Performance Tracking"
      description="Monitor attendance, task completion rates, and student feedback for hostel staff."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Staff Management',
          to: '/hostel-management/staff/registration',
        },
        { label: 'Performance' },
      ]}
    >
      <FormCard title="Monthly Performance Overview" icon="bar_chart">
        <div className="mb-6 flex items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                <th className="p-2">Staff Member</th>
                <th className="p-2">Role</th>
                <th className="p-2">Days Present</th>
                <th className="p-2">Tasks Assigned</th>
                <th className="p-2">Completion Rate</th>
                <th className="p-2">Avg Feedback</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">
                    No active staff data available.
                  </td>
                </tr>
              )}
              {performanceData.map(data => (
                <tr
                  key={data.id}
                  className="border-b border-slate-200 dark:border-slate-700"
                >
                  <td className="p-2 font-medium">
                    {data.name}
                    <div className="text-xs text-slate-500">
                      {data.employeeId}
                    </div>
                  </td>
                  <td className="p-2">{data.role}</td>
                  <td className="p-2 font-semibold text-primary-600">
                    {data.daysPresent} days
                  </td>
                  <td className="p-2">
                    {data.tasksResolved} / {data.tasksAssigned}
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            data.completionRate >= 80
                              ? 'bg-green-500'
                              : data.completionRate >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${data.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{data.completionRate}%</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        data.avgFeedback === 'N/A'
                          ? 'bg-slate-100 text-slate-500'
                          : parseFloat(data.avgFeedback) >= 4.0
                            ? 'bg-green-100 text-green-700'
                            : parseFloat(data.avgFeedback) <= 2.5
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {data.avgFeedback !== 'N/A'
                        ? `${data.avgFeedback} / 5.0`
                        : 'No Data'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
