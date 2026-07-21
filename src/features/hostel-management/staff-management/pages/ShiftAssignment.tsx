import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

// Mock static shifts for the hostel
const SHIFTS = [
  { id: 'SH-1', name: 'Morning Shift', time: '06:00 AM - 02:00 PM' },
  { id: 'SH-2', name: 'Afternoon Shift', time: '02:00 PM - 10:00 PM' },
  { id: 'SH-3', name: 'Night Shift', time: '10:00 PM - 06:00 AM' },
  { id: 'SH-G', name: 'General Shift', time: '09:00 AM - 05:00 PM' },
];

export default function ShiftAssignment() {
  const { hostelStaff, setHostelStaff, triggerNotification } = useHostel();

  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [newShiftId, setNewShiftId] = useState('');

  const activeStaff = hostelStaff.filter(s => s.status === 'ACTIVE');
  const selectedStaff = activeStaff.find(s => s.id === selectedStaffId);

  const handleUpdateShift = () => {
    if (!selectedStaffId || !newShiftId) {
      triggerNotification('Please select a shift to assign.', 'error');
      return;
    }

    setHostelStaff(prev =>
      prev.map(s =>
        s.id === selectedStaffId ? { ...s, shiftId: newShiftId } : s
      )
    );
    triggerNotification('Shift updated successfully.', 'success');
    setSelectedStaffId(null);
    setNewShiftId('');
  };

  return (
    <FormPage
      title="Shift Assignment"
      description="Manage and update working shifts for hostel staff."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Staff Management',
          to: '/hostel-management/staff/registration',
        },
        { label: 'Shifts' },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <FormCard title="Staff Roster" icon="schedule">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-2">Name</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Current Shift</th>
                    <th className="p-2">Shift Timings</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStaff.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-center text-slate-500"
                      >
                        No active staff members found.
                      </td>
                    </tr>
                  )}
                  {activeStaff.map(staff => {
                    const shiftDetails =
                      SHIFTS.find(s => s.id === staff.shiftId) || SHIFTS[3]; // default to General
                    return (
                      <tr
                        key={staff.id}
                        className="border-b border-slate-200 dark:border-slate-700"
                      >
                        <td className="p-2 font-medium">{staff.name}</td>
                        <td className="p-2">{staff.role}</td>
                        <td className="p-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                            {shiftDetails.name}
                          </span>
                        </td>
                        <td className="p-2 text-slate-500">
                          {shiftDetails.time}
                        </td>
                        <td className="p-2">
                          <Button
                            label="Change Shift"
                            variant={
                              selectedStaffId === staff.id
                                ? 'primary'
                                : 'outlined'
                            }
                            onClick={() => {
                              setSelectedStaffId(staff.id);
                              setNewShiftId(staff.shiftId);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </FormCard>
        </div>

        {selectedStaff && (
          <div className="w-full lg:w-1/3">
            <FormCard title="Update Shift" icon="edit_calendar">
              <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Staff Member
                  </span>
                  <span className="font-semibold">
                    {selectedStaff.name} ({selectedStaff.role})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select New Shift *
                </label>
                <div className="space-y-2 mb-4">
                  {SHIFTS.map(shift => (
                    <label
                      key={shift.id}
                      className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${newShiftId === shift.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                      <input
                        type="radio"
                        name="shiftSelection"
                        value={shift.id}
                        checked={newShiftId === shift.id}
                        onChange={() => setNewShiftId(shift.id)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold text-sm">
                          {shift.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {shift.time}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    label="Update Shift"
                    variant="primary"
                    onClick={handleUpdateShift}
                    className="w-full"
                  />
                </div>
              </div>
            </FormCard>
          </div>
        )}
      </div>
    </FormPage>
  );
}
