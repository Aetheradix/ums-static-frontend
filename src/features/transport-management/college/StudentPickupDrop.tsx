import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, DatePicker } from 'shared/components/forms';

const routes = [
  { name: 'Route 1 (City Center)', value: 'r1' },
  { name: 'Route 2 (South Zone)', value: 'r2' },
];

const vehicles = [
  { name: 'MP04AB1234 (Bus)', value: 'v1' },
  { name: 'MP08XY9876 (Van)', value: 'v2' },
];

export default function StudentPickupDrop() {
  const [form, setForm] = useState({
    date: undefined,
    route: '',
    vehicle: '',
  });

  const [isSearched, setIsSearched] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    if (form.date && form.route && form.vehicle) {
      setIsSearched(true);
    }
  };

  const handleClear = () => {
    setForm({
      date: undefined,
      route: '',
      vehicle: '',
    });
    setIsSearched(false);
  };

  return (
    <FormPage
      title="Student Pickup & Drop Entry"
      description="Record daily pickup and drop statuses for students."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
        { label: 'Pickup & Drop Entry' },
      ]}
    >
      <FormCard title="Search Route">
        <FormGrid columns={3}>
          <DatePicker
            label="Date"
            value={form.date}
            onChange={v => handleChange('date', v)}
            placeholder="DD/MM/YYYY"
            required
          />
          <DropDownList
            label="Route"
            data={routes}
            value={form.route}
            onChange={v => handleChange('route', String(v))}
            textField="name"
            optionValue="value"
            placeholder="Select Route"
            required
          />
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
        </FormGrid>
        <div className="flex gap-4 mt-6">
          <Button
            label="Load Students"
            variant="success"
            className="min-w-[120px]"
            onClick={handleSearch}
          />
          <Button
            label="Clear"
            variant="danger"
            className="min-w-[120px]"
            onClick={handleClear}
          />
        </div>
      </FormCard>

      {isSearched && (
        <FormCard title="Student List" className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border rounded-lg">
              <thead className="bg-[#f48b50] text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Admission No.
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Student Name
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Stop
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Pickup Status
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Drop Status
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-white hover:bg-gray-50">
                  <td className="px-4 py-3">ADM-001</td>
                  <td className="px-4 py-3">Rahul Sharma</td>
                  <td className="px-4 py-3">Stop A (Main Market)</td>
                  <td className="px-4 py-3">
                    <select className="border rounded p-1">
                      <option>Pending</option>
                      <option>Picked</option>
                      <option>Not Picked</option>
                      <option>Absent</option>
                      <option>Leave</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select className="border rounded p-1">
                      <option>Pending</option>
                      <option>Dropped</option>
                      <option>Absent</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      className="border rounded p-1 w-full"
                      placeholder="Remarks"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <Button label="Save Entries" variant="primary" />
          </div>
        </FormCard>
      )}
    </FormPage>
  );
}
