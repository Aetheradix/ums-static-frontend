import { useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function StaffAttendance() {
  const {
    hostelStaff,
    staffAttendance,
    setStaffAttendance,
    triggerNotification,
  } = useHostel();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Find active staff members
  const activeStaff = hostelStaff.filter(s => s.status === 'ACTIVE');

  const handleMarkAttendance = (
    staffId: string,
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE'
  ) => {
    // Check if record exists for this date and staff
    const existingIndex = staffAttendance.findIndex(
      a => a.staffId === staffId && a.date === date
    );

    if (existingIndex >= 0) {
      const updated = [...staffAttendance];
      updated[existingIndex] = { ...updated[existingIndex], status };
      setStaffAttendance(updated);
    } else {
      const newRecord: HostelManagement.StaffAttendance = {
        id: `ATT-${Date.now()}`,
        staffId,
        date,
        status,
        inTime:
          status === 'PRESENT'
            ? new Date().toTimeString().split(' ')[0]
            : undefined,
        markedBy: 'Admin',
      };
      setStaffAttendance([...staffAttendance, newRecord]);
    }

    triggerNotification(
      `Attendance marked as ${status} for staff member.`,
      'success'
    );
  };

  const handleMarkOutTime = (staffId: string) => {
    const existingIndex = staffAttendance.findIndex(
      a => a.staffId === staffId && a.date === date
    );
    if (
      existingIndex >= 0 &&
      staffAttendance[existingIndex].status === 'PRESENT'
    ) {
      const updated = [...staffAttendance];
      updated[existingIndex] = {
        ...updated[existingIndex],
        outTime: new Date().toTimeString().split(' ')[0],
      };
      setStaffAttendance(updated);
      triggerNotification('Out time recorded successfully.', 'success');
    }
  };

  return (
    <FormPage
      title="Staff Attendance"
      description="Mark daily attendance and log working hours for hostel staff."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Staff Management',
          to: '/hostel-management/staff/registration',
        },
        { label: 'Attendance' },
      ]}
    >
      <FormCard title="Daily Staff Roster" icon="how_to_reg">
        <div className="mb-6 flex items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
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
                <th className="p-2">Shift</th>
                <th className="p-2">Status</th>
                <th className="p-2">In/Out Times</th>
                <th className="p-2 text-right">Mark Status</th>
              </tr>
            </thead>
            <tbody>
              {activeStaff.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">
                    No active staff found.
                  </td>
                </tr>
              )}
              {activeStaff.map(staff => {
                const record = staffAttendance.find(
                  a => a.staffId === staff.id && a.date === date
                );

                return (
                  <tr
                    key={staff.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2 font-medium">
                      {staff.name}
                      <div className="text-xs text-slate-500">
                        {staff.employeeId}
                      </div>
                    </td>
                    <td className="p-2">{staff.role}</td>
                    <td className="p-2 text-slate-500">{staff.shiftId}</td>
                    <td className="p-2">
                      {record ? (
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            record.status === 'PRESENT'
                              ? 'bg-green-100 text-green-700'
                              : record.status === 'ABSENT'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {record.status.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">
                          Not Marked
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      {record?.inTime && (
                        <div className="text-xs">In: {record.inTime}</div>
                      )}
                      {record?.outTime && (
                        <div className="text-xs">Out: {record.outTime}</div>
                      )}
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          className={`px-2 py-1 text-xs border rounded transition-colors ${record?.status === 'PRESENT' ? 'bg-green-500 text-white border-green-600' : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600'}`}
                          onClick={() =>
                            handleMarkAttendance(staff.id, 'PRESENT')
                          }
                        >
                          P
                        </button>
                        <button
                          className={`px-2 py-1 text-xs border rounded transition-colors ${record?.status === 'ABSENT' ? 'bg-red-500 text-white border-red-600' : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600'}`}
                          onClick={() =>
                            handleMarkAttendance(staff.id, 'ABSENT')
                          }
                        >
                          A
                        </button>
                        <button
                          className={`px-2 py-1 text-xs border rounded transition-colors ${record?.status === 'HALF_DAY' ? 'bg-yellow-500 text-white border-yellow-600' : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600'}`}
                          onClick={() =>
                            handleMarkAttendance(staff.id, 'HALF_DAY')
                          }
                        >
                          HD
                        </button>
                        {record?.status === 'PRESENT' && !record.outTime && (
                          <button
                            className="ml-2 px-2 py-1 text-xs border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            onClick={() => handleMarkOutTime(staff.id)}
                          >
                            Mark Out
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
