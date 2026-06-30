import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, DatePicker } from 'shared/components/forms';

const vehicles = [
  { name: 'All Vehicles', value: 'all' },
  { name: 'MP04AB1234', value: 'v1' },
  { name: 'MP08XY9876', value: 'v2' },
];

export default function VehicleMaintenanceReport() {
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
      title="Vehicle Maintenance Report"
      description="View and export maintenance records and expenses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        { label: 'Reports', to: '/transport-management' },
        { label: 'Maintenance Report' },
      ]}
      headerAction={
        <Button label="Export to Excel" variant="success" icon="download" />
      }
    >
      <div className="mb-6">
        <FormCard title="Filter Criteria">
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

      <FormCard title="Maintenance Records">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border rounded-lg">
            <thead className="bg-[#f48b50] text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Req ID</th>
                <th className="px-4 py-3 font-semibold">Vehicle</th>
                <th className="px-4 py-3 font-semibold">Maintenance Type</th>
                <th className="px-4 py-3 font-semibold">Completion Date</th>
                <th className="px-4 py-3 font-semibold">Garage</th>
                <th className="px-4 py-3 font-semibold">Actual Cost</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-white hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">REQ-000</td>
                <td className="px-4 py-3">MP08XY9876</td>
                <td className="px-4 py-3">Accidental Repair</td>
                <td className="px-4 py-3">25/06/2026</td>
                <td className="px-4 py-3">Tata Motors Service</td>
                <td className="px-4 py-3">₹11,500</td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="bg-gray-50 font-bold border-t-2 border-gray-200">
                <td colSpan={5} className="px-4 py-3 text-right">
                  Total Expenditure
                </td>
                <td className="px-4 py-3 text-red-600">₹11,500</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
