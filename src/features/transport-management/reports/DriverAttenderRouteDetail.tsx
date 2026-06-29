import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';

const routes = [
  { name: 'All Routes', value: 'all' },
  { name: 'R-01 (City Center)', value: 'r1' },
];

export default function DriverAttenderRouteDetail() {
  const [form, setForm] = useState({
    route: 'all',
    staffType: 'all',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Driver & Attender Route Details"
      description="Report showing staff assignments across routes and vehicles."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        { label: 'Reports', to: '/transport-management' },
        { label: 'Staff Route Details' },
      ]}
      headerAction={
        <Button label="Export to Excel" variant="success" icon="download" />
      }
    >
      <div className="mb-6">
        <FormCard title="Filter Criteria">
          <FormGrid columns={3}>
            <DropDownList
              label="Route"
              data={routes}
              value={form.route}
              onChange={v => handleChange('route', String(v))}
              textField="name"
              optionValue="value"
            />
            <DropDownList
              label="Staff Type"
              data={[
                { name: 'All', value: 'all' },
                { name: 'Driver', value: 'driver' },
                { name: 'Attender', value: 'attender' },
              ]}
              value={form.staffType}
              onChange={v => handleChange('staffType', String(v))}
              textField="name"
              optionValue="value"
            />
            <div className="flex items-end pb-1">
              <Button
                label="Search"
                variant="primary"
                className="w-full md:w-1/2"
                icon="search"
              />
            </div>
          </FormGrid>
        </FormCard>
      </div>

      <FormCard title="Staff Route Allocation">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border rounded-lg">
            <thead className="bg-[#f48b50] text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Staff Name</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Assigned Route</th>
                <th className="px-4 py-3 font-semibold">Assigned Vehicle</th>
                <th className="px-4 py-3 font-semibold">Contact No</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-white hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">Ramesh Singh</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Driver
                  </span>
                </td>
                <td className="px-4 py-3">R-01 (City Center)</td>
                <td className="px-4 py-3">MP04AB1234 (Bus)</td>
                <td className="px-4 py-3">9876543210</td>
              </tr>
              <tr className="border-b bg-white hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">Suresh Kumar</td>
                <td className="px-4 py-3">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                    Attender
                  </span>
                </td>
                <td className="px-4 py-3">R-01 (City Center)</td>
                <td className="px-4 py-3">MP04AB1234 (Bus)</td>
                <td className="px-4 py-3">8765432109</td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
