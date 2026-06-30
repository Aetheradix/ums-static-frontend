import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  Checkbox,
} from 'shared/components/forms';

const vehicles = [
  { name: 'MP04AB1234 (Bus)', value: 'v1' },
  { name: 'MP08XY9876 (Van)', value: 'v2' },
];

const departments = [
  { name: 'Administration', value: 'admin' },
  { name: 'Sports Dept', value: 'sports' },
  { name: 'Guest Transport', value: 'guest' },
];

export default function VehicleAllotment() {
  const [form, setForm] = useState({
    vehicle: '',
    department: '',
    purpose: '',
    allotmentDate: undefined,
    returnDate: undefined,
    allottedTo: '',
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Vehicle Allotment"
      description="Allot vehicles to departments or staff for specific purposes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Vehicle Allotment' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FormCard title="New Allotment">
            <FormGrid columns={1}>
              <DropDownList
                label="Vehicle"
                data={vehicles}
                value={form.vehicle}
                onChange={v => handleChange('vehicle', String(v))}
                textField="name"
                optionValue="value"
                placeholder="Select Vehicle"
                required
              />
              <DropDownList
                label="Department"
                data={departments}
                value={form.department}
                onChange={v => handleChange('department', String(v))}
                textField="name"
                optionValue="value"
                placeholder="Select Department"
                required
              />
              <TextBox
                label="Allotted To (Person)"
                value={form.allottedTo}
                onChange={v => handleChange('allottedTo', v)}
                placeholder="Name of person"
              />
              <TextBox
                label="Purpose"
                value={form.purpose}
                onChange={v => handleChange('purpose', v)}
                placeholder="Ex: Sports tournament"
              />
              <DatePicker
                label="Allotment Date"
                value={form.allotmentDate}
                onChange={v => handleChange('allotmentDate', v)}
                placeholder="DD/MM/YYYY"
                required
              />
              <DatePicker
                label="Expected Return Date"
                value={form.returnDate}
                onChange={v => handleChange('returnDate', v)}
                placeholder="DD/MM/YYYY"
              />
              <div className="flex items-center pt-2">
                <Checkbox
                  label="Is Active Allotment"
                  checked={form.isActive}
                  onChange={(e: any) =>
                    handleChange('isActive', e.target.checked)
                  }
                />
              </div>
            </FormGrid>
            <div className="flex items-center gap-4 mt-6">
              <Button
                label="Save Allotment"
                variant="success"
                className="w-full"
              />
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
          <FormCard title="Current Allotments">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg">
                <thead className="bg-[#f48b50] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Vehicle</th>
                    <th className="px-4 py-3 font-semibold">Department</th>
                    <th className="px-4 py-3 font-semibold">Purpose</th>
                    <th className="px-4 py-3 font-semibold">Allotted On</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">MP04AB1234</td>
                    <td className="px-4 py-3">Sports Dept</td>
                    <td className="px-4 py-3">Cricket Team Travel</td>
                    <td className="px-4 py-3">28/06/2026</td>
                    <td className="px-4 py-3">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                        Active
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
