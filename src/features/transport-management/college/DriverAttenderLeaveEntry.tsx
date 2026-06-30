import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  Checkbox,
} from 'shared/components/forms';

const staffList = [
  { name: 'Ramesh Singh (Driver)', value: 's1' },
  { name: 'Suresh Kumar (Attender)', value: 's2' },
];

export default function DriverAttenderLeaveEntry() {
  const [form, setForm] = useState({
    staff: '',
    fromDate: undefined,
    toDate: undefined,
    reason: '',
    isApproved: false,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Driver & Attender Leave Entry"
      description="Mark transport staff as on leave for specific dates."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
        { label: 'Staff Leave Entry' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FormCard title="Add Leave Record">
            <FormGrid columns={1}>
              <DropDownList
                label="Staff"
                data={staffList}
                value={form.staff}
                onChange={v => handleChange('staff', String(v))}
                textField="name"
                optionValue="value"
                placeholder="Search staff"
                required
              />
              <DatePicker
                label="From Date"
                value={form.fromDate}
                onChange={v => handleChange('fromDate', v)}
                placeholder="DD/MM/YYYY"
                required
              />
              <DatePicker
                label="To Date"
                value={form.toDate}
                onChange={v => handleChange('toDate', v)}
                placeholder="DD/MM/YYYY"
                required
              />
              <TextBox
                label="Reason"
                value={form.reason}
                onChange={v => handleChange('reason', v)}
                placeholder="Ex: Medical, Family emergency"
                required
              />
              <div className="flex items-center pt-2">
                <Checkbox
                  label="Leave Approved"
                  checked={form.isApproved}
                  onChange={(e: any) =>
                    handleChange('isApproved', e.target.checked)
                  }
                />
              </div>
            </FormGrid>
            <div className="flex items-center gap-4 mt-6">
              <Button label="Save Leave" variant="success" className="w-full" />
              <Button
                label="Clear"
                variant="danger"
                className="w-full"
                onClick={() => window.location.reload()}
              />
            </div>
          </FormCard>
        </div>

        <div className="md:col-span-2">
          <FormCard title="Recent Staff Leaves">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg">
                <thead className="bg-[#f48b50] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Staff Name</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Leave Dates</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Ramesh Singh</td>
                    <td className="px-4 py-3">Driver</td>
                    <td className="px-4 py-3">28/06/2026 to 30/06/2026</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        Approved
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        label="Edit"
                        variant="primary"
                        icon="pencil"
                        className="p-1 text-xs h-8"
                      />
                    </td>
                  </tr>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Suresh Kumar</td>
                    <td className="px-4 py-3">Attender</td>
                    <td className="px-4 py-3">01/07/2026 to 02/07/2026</td>
                    <td className="px-4 py-3">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                        Pending
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        label="Edit"
                        variant="primary"
                        icon="pencil"
                        className="p-1 text-xs h-8"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
