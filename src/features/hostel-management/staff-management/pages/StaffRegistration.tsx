import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function StaffRegistration() {
  const { hostels, hostelStaff, setHostelStaff, triggerNotification } =
    useHostel();

  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('WARDEN');
  const [hostelId, setHostelId] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [shiftId, setShiftId] = useState('');

  const [isEditing, setIsEditing] = useState<string | null>(null);

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));

  const handleSubmit = () => {
    if (!name || !role || !hostelId || !contactNumber) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    if (isEditing) {
      setHostelStaff(prev =>
        prev.map(s =>
          s.id === isEditing
            ? {
                ...s,
                employeeId,
                name,
                role: role as any,
                hostelId,
                contactNumber,
                shiftId,
              }
            : s
        )
      );
      triggerNotification('Staff record updated successfully.', 'success');
      setIsEditing(null);
    } else {
      const newStaff: HostelManagement.HostelStaff = {
        id: `STF-${Date.now()}`,
        employeeId: employeeId || `EMP-${Date.now().toString().slice(-4)}`, // Generate one if empty
        name,
        role: role as any,
        hostelId,
        contactNumber,
        shiftId: shiftId || 'SH-1', // Defaulting for now
        status: 'ACTIVE',
      };
      setHostelStaff([...hostelStaff, newStaff]);
      triggerNotification('Staff registered successfully.', 'success');
    }

    setEmployeeId('');
    setName('');
    setRole('WARDEN');
    setHostelId('');
    setContactNumber('');
    setShiftId('');
  };

  const handleEdit = (staff: HostelManagement.HostelStaff) => {
    setIsEditing(staff.id);
    setEmployeeId(staff.employeeId);
    setName(staff.name);
    setRole(staff.role);
    setHostelId(staff.hostelId);
    setContactNumber(staff.contactNumber);
    setShiftId(staff.shiftId);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    setHostelStaff(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
            }
          : s
      )
    );
    triggerNotification(
      `Staff status changed to ${currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}.`,
      'success'
    );
  };

  return (
    <FormPage
      title="Staff Registration"
      description="Register and manage hostel staff (wardens, caretakers, security, cleaners)."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Staff Management',
          to: '/hostel-management/staff/registration',
        },
        { label: 'Registration' },
      ]}
    >
      <FormCard
        title={isEditing ? 'Edit Staff Details' : 'Register New Staff'}
        icon="person_add"
      >
        <FormGrid columns={2}>
          <TextBox label="Full Name *" value={name} onChange={setName} />
          <TextBox
            label="Employee ID (Optional)"
            value={employeeId}
            onChange={setEmployeeId}
            placeholder="Link to HR Employee ID"
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Role *
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            >
              <option value="WARDEN">Warden</option>
              <option value="CARETAKER">Caretaker</option>
              <option value="SECURITY">Security Guard</option>
              <option value="CLEANER">Cleaner</option>
              <option value="ELECTRICIAN">Electrician</option>
              <option value="PLUMBER">Plumber</option>
            </select>
          </div>

          <OptionDropDown
            label="Assigned Hostel *"
            data={hostelOptions}
            value={hostelId}
            onChange={(v: any) => setHostelId(v)}
            textField="text"
            valueField="id"
          />

          <TextBox
            label="Contact Number *"
            value={contactNumber}
            onChange={setContactNumber}
          />
          <TextBox
            label="Default Shift ID"
            value={shiftId}
            onChange={setShiftId}
            placeholder="e.g. SH-1 (Morning)"
          />
        </FormGrid>

        <div className="flex gap-3 mt-4">
          <Button
            label={isEditing ? 'Update Staff' : 'Register Staff'}
            variant="primary"
            onClick={handleSubmit}
          />
          {isEditing && (
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => {
                setIsEditing(null);
                setEmployeeId('');
                setName('');
                setRole('WARDEN');
                setHostelId('');
                setContactNumber('');
                setShiftId('');
              }}
            />
          )}
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="Registered Staff" icon="group">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Emp ID</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Hostel</th>
                  <th className="p-2">Contact</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hostelStaff.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-500">
                      No staff registered.
                    </td>
                  </tr>
                )}
                {hostelStaff.map(staff => (
                  <tr
                    key={staff.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2 font-medium">{staff.name}</td>
                    <td className="p-2">{staff.employeeId}</td>
                    <td className="p-2">{staff.role}</td>
                    <td className="p-2">{staff.hostelId}</td>
                    <td className="p-2">{staff.contactNumber}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          staff.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : staff.status === 'ON_LEAVE'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {staff.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button
                          label="Edit"
                          variant="outlined"
                          onClick={() => handleEdit(staff)}
                        />
                        {staff.status !== 'ON_LEAVE' && (
                          <Button
                            label={
                              staff.status === 'ACTIVE'
                                ? 'Deactivate'
                                : 'Activate'
                            }
                            variant="outlined"
                            onClick={() =>
                              handleToggleStatus(staff.id, staff.status)
                            }
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
