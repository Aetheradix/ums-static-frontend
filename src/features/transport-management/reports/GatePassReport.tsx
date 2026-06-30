import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, DatePicker } from 'shared/components/forms';

const vehicles = [
  { name: 'All Vehicles', value: 'all' },
  { name: 'MP04AB1234', value: 'v1' },
];

export default function GatePassReport() {
  const [form, setForm] = useState({
    vehicle: 'all',
    fromDate: undefined,
    toDate: undefined,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Bus Gate Pass Report"
      description="View logs of buses entering and exiting the campus."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        { label: 'Reports', to: '/transport-management' },
        { label: 'Gate Pass Report' },
      ]}
      headerAction={
        <Button label="Export to Excel" variant="success" icon="download" />
      }
    >
      <div className="mb-6">
        <FormCard title="Filter Logs">
          <FormGrid columns={4}>
            <DropDownList
              label="Vehicle"
              data={vehicles}
              value={form.vehicle}
              onChange={v => handleChange('vehicle', String(v))}
              textField="name"
              optionValue="value"
            />
            <DatePicker
              label="From Date"
              value={form.fromDate}
              onChange={v => handleChange('fromDate', v)}
              placeholder="DD/MM/YYYY"
            />
            <DatePicker
              label="To Date"
              value={form.toDate}
              onChange={v => handleChange('toDate', v)}
              placeholder="DD/MM/YYYY"
            />
            <div className="flex items-end pb-1">
              <Button
                label="Search"
                variant="primary"
                className="w-full"
                icon="search"
              />
            </div>
          </FormGrid>
        </FormCard>
      </div>

      <FormCard title="Gate Entry/Exit Logs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border rounded-lg">
            <thead className="bg-[#f48b50] text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Vehicle</th>
                <th className="px-4 py-3 font-semibold">Driver Name</th>
                <th className="px-4 py-3 font-semibold">Meter Reading</th>
                <th className="px-4 py-3 font-semibold text-green-300">
                  In Time
                </th>
                <th className="px-4 py-3 font-semibold text-red-300">
                  Out Time
                </th>
                <th className="px-4 py-3 font-semibold">Duration Inside</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-white hover:bg-gray-50">
                <td className="px-4 py-3">29/06/2026</td>
                <td className="px-4 py-3 font-medium">MP04AB1234</td>
                <td className="px-4 py-3">Ramesh Singh</td>
                <td className="px-4 py-3">45,120 km</td>
                <td className="px-4 py-3 text-green-600 font-bold">07:30 AM</td>
                <td className="px-4 py-3 text-red-600 font-bold">02:15 PM</td>
                <td className="px-4 py-3">6h 45m</td>
              </tr>
              <tr className="border-b bg-white hover:bg-gray-50">
                <td className="px-4 py-3">29/06/2026</td>
                <td className="px-4 py-3 font-medium">MP08XY9876</td>
                <td className="px-4 py-3">Suresh Kumar</td>
                <td className="px-4 py-3">12,450 km</td>
                <td className="px-4 py-3 text-green-600 font-bold">08:00 AM</td>
                <td className="px-4 py-3 text-red-600 font-bold">-</td>
                <td className="px-4 py-3 text-yellow-600">Still Inside</td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
