import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList, DatePicker } from 'shared/components/forms';

export default function PickupCancellationDetails() {
  const [form, setForm] = useState({
    route: '',
    date: undefined,
    studentAdmissionNo: '',
    reason: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Pickup Cancellation Details"
      description="Record or view one-time pickup cancellations for students."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
        { label: 'Pickup Cancellation' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FormCard title="Register Cancellation">
            <FormGrid columns={1}>
              <TextBox
                label="Student Admission No"
                value={form.studentAdmissionNo}
                onChange={v => handleChange('studentAdmissionNo', v)}
                placeholder="Ex: 2026/001"
                required
              />

              {/* Optional: Show student info if admission no is valid */}
              <div className="p-3 bg-gray-50 border rounded text-sm mb-4">
                <p>
                  <strong>Name:</strong> Rahul Sharma
                </p>
                <p>
                  <strong>Route:</strong> R-01 (Stop: Main Square)
                </p>
              </div>

              <DatePicker
                label="Date"
                value={form.date}
                onChange={v => handleChange('date', v)}
                placeholder="DD/MM/YYYY"
                required
              />
              <DropDownList
                label="Reason"
                data={[
                  { name: 'Parent Pickup', value: 'parent' },
                  { name: 'Self Transport', value: 'self' },
                  { name: 'Absent', value: 'absent' },
                ]}
                value={form.reason}
                onChange={v => handleChange('reason', String(v))}
                textField="name"
                optionValue="value"
                placeholder="Select Reason"
                required
              />
            </FormGrid>
            <div className="flex items-center gap-4 mt-6">
              <Button
                label="Save Cancellation"
                variant="danger"
                className="w-full"
              />
            </div>
          </FormCard>
        </div>

        <div className="md:col-span-2">
          <FormCard title="Cancellations for Today">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg">
                <thead className="bg-[#f48b50] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Adm No</th>
                    <th className="px-4 py-3 font-semibold">Student Name</th>
                    <th className="px-4 py-3 font-semibold">Route & Stop</th>
                    <th className="px-4 py-3 font-semibold">Reason</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-red-50 hover:bg-red-100">
                    <td className="px-4 py-3 font-medium">2026/012</td>
                    <td className="px-4 py-3">Amit Verma</td>
                    <td className="px-4 py-3">R-01 (Clock Tower)</td>
                    <td className="px-4 py-3">Parent Pickup</td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        label="Revoke"
                        variant="primary"
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
