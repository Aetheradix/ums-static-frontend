import { useMemo, useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { Button } from 'shared/components/buttons';

export default function StaffPerformanceReport() {
  const { hostels, hostelStaff, staffAttendance, maintenanceRequests } =
    useHostel();

  const [selectedHostel, setSelectedHostel] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  const reportData = useMemo(() => {
    let targetStaff = hostelStaff;
    if (selectedHostel) {
      targetStaff = targetStaff.filter(s => s.hostelId === selectedHostel);
    }
    if (selectedRole) {
      targetStaff = targetStaff.filter(s => s.role === selectedRole);
    }

    // Generate performance metrics for each staff member
    return targetStaff.map(staff => {
      // 1. Attendance Rate
      const sAttendance = staffAttendance.filter(a => a.staffId === staff.id);
      const totalDays = sAttendance.length || 1; // avoid div by 0
      const presentDays = sAttendance.filter(
        a => a.status === 'PRESENT'
      ).length;
      const attendanceRate = Math.round((presentDays / totalDays) * 100);

      // 2. Task Resolution (For maintenance staff)
      let tasksAssigned = 0;
      let tasksResolved = 0;
      let averageResolutionTime = 'N/A'; // Mock string

      if (
        staff.role === 'ELECTRICIAN' ||
        staff.role === 'PLUMBER' ||
        staff.role === 'CLEANER'
      ) {
        const assignedTasks = maintenanceRequests.filter(
          m => m.assignedTo === staff.id
        );
        tasksAssigned = assignedTasks.length;
        tasksResolved = assignedTasks.filter(
          m => m.status === 'RESOLVED' || m.status === 'CLOSED'
        ).length;
        if (tasksResolved > 0) averageResolutionTime = '2.4 days'; // Mock data
      }

      // 3. Overall Performance Score (Mock logic)
      let performanceScore = attendanceRate * 0.5;
      if (tasksAssigned > 0) {
        performanceScore += (tasksResolved / tasksAssigned) * 100 * 0.5;
      } else {
        performanceScore += 40; // Default score for non-maintenance roles based on other unknown factors
      }

      return {
        ...staff,
        attendanceRate,
        tasksAssigned,
        tasksResolved,
        averageResolutionTime,
        performanceScore: Math.round(performanceScore),
        hostelName:
          hostels.find(h => h.id === staff.hostelId)?.hostelName || 'Unknown',
      };
    });
  }, [
    hostels,
    hostelStaff,
    staffAttendance,
    maintenanceRequests,
    selectedHostel,
    selectedRole,
  ]);

  const roles = [
    'WARDEN',
    'CARETAKER',
    'SECURITY',
    'CLEANER',
    'ELECTRICIAN',
    'PLUMBER',
  ];

  const exportToCSV = () => {
    alert('Exporting Staff Performance Report to CSV...');
  };

  return (
    <FormPage
      title="Staff Performance Report"
      description="Analyze attendance, task resolution rates, and overall performance of hostel staff."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        { label: 'Reports', to: '/hostel-management/reports/admin-dashboard' },
        { label: 'Staff Performance' },
      ]}
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Filter by Hostel
            </label>
            <select
              value={selectedHostel}
              onChange={e => setSelectedHostel(e.target.value)}
              className="w-full sm:w-48 border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            >
              <option value="">All Hostels</option>
              {hostels.map(h => (
                <option key={h.id} value={h.id}>
                  {h.hostelName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Filter by Role
            </label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full sm:w-48 border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            >
              <option value="">All Roles</option>
              {roles.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button label="Export CSV" variant="outlined" onClick={exportToCSV} />
      </div>

      <FormCard title="Staff Metrics" icon="badge">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700">
                  Staff Member
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700">
                  Role & Location
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 text-center">
                  Attendance Rate
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 text-center">
                  Tasks (Res/Ass)
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 text-center border-l border-slate-200 dark:border-slate-700">
                  Performance Score
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    No staff members found matching the criteria.
                  </td>
                </tr>
              )}
              {reportData.map(staff => (
                <tr
                  key={staff.id}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="p-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {staff.name}
                    </div>
                    <div className="text-xs text-slate-500">{staff.id}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-primary-600">
                      {staff.role}
                    </div>
                    <div className="text-xs text-slate-500">
                      {staff.hostelName}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="inline-flex items-center gap-1">
                      <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 hidden sm:block">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${staff.attendanceRate}%` }}
                        ></div>
                      </div>
                      <span className="font-bold">{staff.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    {staff.tasksAssigned > 0 ? (
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        <span className="text-green-600">
                          {staff.tasksResolved}
                        </span>{' '}
                        / {staff.tasksAssigned}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">N/A</span>
                    )}
                  </td>
                  <td className="p-3 text-center border-l border-slate-200 dark:border-slate-700">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                        staff.performanceScore > 85
                          ? 'bg-green-500'
                          : staff.performanceScore > 65
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                    >
                      {staff.performanceScore} / 100
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
