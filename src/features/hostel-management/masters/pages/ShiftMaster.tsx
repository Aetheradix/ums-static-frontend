import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function ShiftMaster() {
  const { shifts, setShifts, triggerNotification } = useHostel();
  const [showList, setShowList] = useState(false);

  const [shiftName, setShiftName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('');
  const [isOvernight, setIsOvernight] = useState(false);
  const [status, setStatus] = useState('ACTIVE');

  const reset = () => {
    setShiftName('');
    setStartTime('');
    setEndTime('');
    setDuration('');
    setIsOvernight(false);
    setStatus('ACTIVE');
  };

  const handleSave = () => {
    if (!shiftName || !startTime || !endTime || !duration) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const newShift: HostelManagement.Shift = {
      id: `SH-${Date.now()}`,
      shiftName,
      startTime,
      endTime,
      duration,
      isOvernight,
      status: status as any,
    };
    setShifts([...shifts, newShift]);
    triggerNotification('Shift saved successfully');
    reset();
    setShowList(true);
  };

  if (showList) {
    return (
      <FormPage
        title="Shift Master"
        description="Manage work shifts for hostel staff"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Hostel Management', to: '/hostel-management/admin' },
          {
            label: 'Masters',
            to: '/hostel-management/masters/new-hostel-registration',
          },
          { label: 'Shifts' },
        ]}
      >
        <FormCard title="Configured Shifts" icon="schedule">
          <Button
            label="Add Shift"
            icon="plus"
            variant="primary"
            onClick={() => setShowList(false)}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Shift Name</th>
                  <th className="p-2">Start Time</th>
                  <th className="p-2">End Time</th>
                  <th className="p-2">Duration</th>
                  <th className="p-2">Overnight?</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map(sh => (
                  <tr
                    key={sh.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">{sh.shiftName}</td>
                    <td className="p-2">{sh.startTime}</td>
                    <td className="p-2">{sh.endTime}</td>
                    <td className="p-2">{sh.duration}</td>
                    <td className="p-2">{sh.isOvernight ? 'Yes' : 'No'}</td>
                    <td className="p-2">{sh.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Shift Master"
      description="Create a new work shift"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Masters',
          to: '/hostel-management/masters/new-hostel-registration',
        },
        { label: 'Shifts' },
      ]}
    >
      <Button
        label="View List"
        icon="list"
        variant="outlined"
        onClick={() => setShowList(true)}
      />

      <FormCard title="Shift Details" icon="schedule">
        <FormGrid columns={3}>
          <TextBox
            label="Shift Name *"
            value={shiftName}
            onChange={setShiftName}
            placeholder="e.g. Morning Shift"
          />
          <TextBox
            label="Start Time *"
            type="time"
            value={startTime}
            onChange={setStartTime}
          />
          <TextBox
            label="End Time *"
            type="time"
            value={endTime}
            onChange={setEndTime}
          />

          <TextBox
            label="Duration *"
            value={duration}
            onChange={setDuration}
            placeholder="e.g. 8 Hours"
          />

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={isOvernight}
              onChange={e => setIsOvernight(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">Is Overnight Shift?</span>
          </div>

          <OptionDropDown
            label="Status"
            data={[
              { id: 'ACTIVE', text: 'Active' },
              { id: 'INACTIVE', text: 'Inactive' },
            ]}
            value={status}
            onChange={(v: any) => setStatus(v)}
            textField="text"
            valueField="id"
          />
        </FormGrid>
      </FormCard>

      <div className="flex gap-3 mt-4">
        <Button label="Save Shift" variant="primary" onClick={handleSave} />
        <Button label="Clear" variant="outlined" onClick={reset} />
      </div>
    </FormPage>
  );
}
