import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  FileUpload,
} from 'shared/components/forms';

const allottedVehicles = [
  { name: 'MP04AB1234 (Bus)', value: 'v1' },
  { name: 'MP08XY9876 (Van)', value: 'v2' },
];

const maintenanceTypes = [
  { name: 'Routine Service', value: 'routine' },
  { name: 'Accidental Repair', value: 'repair' },
];

export default function VehicleMaintenanceRequest() {
  const [form, setForm] = useState({
    vehicle: '',
    maintenanceType: '',
    requestDate: undefined,
    estimatedCost: '',
    description: '',
    documentPdf: null,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Vehicle Maintenance Request"
      description="Raise a maintenance or repair request for a college vehicle."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
        { label: 'Maintenance Request' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FormCard title="New Request">
            <FormGrid columns={1}>
              <DropDownList
                label="Vehicle"
                data={allottedVehicles}
                value={form.vehicle}
                onChange={v => handleChange('vehicle', String(v))}
                textField="name"
                optionValue="value"
                placeholder="Select Vehicle"
                required
              />
              <DropDownList
                label="Maintenance Type"
                data={maintenanceTypes}
                value={form.maintenanceType}
                onChange={v => handleChange('maintenanceType', String(v))}
                textField="name"
                optionValue="value"
                placeholder="Select Type"
                required
              />
              <DatePicker
                label="Request Date"
                value={form.requestDate}
                onChange={v => handleChange('requestDate', v)}
                placeholder="DD/MM/YYYY"
                required
              />
              <TextBox
                label="Estimated Cost (Optional)"
                value={form.estimatedCost}
                onChange={v => handleChange('estimatedCost', v)}
                placeholder="Ex: 5000"
              />
              <TextBox
                label="Description"
                value={form.description}
                onChange={v => handleChange('description', v)}
                placeholder="Type details"
                required
              />
              <FileUpload
                label="Upload Image/Quotation"
                value={form.documentPdf}
                onChange={file => handleChange('documentPdf', file)}
              />
            </FormGrid>
            <div className="flex items-center gap-4 mt-6">
              <Button
                label="Submit Request"
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
          <FormCard title="My Maintenance Requests">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg">
                <thead className="bg-[#f48b50] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Req ID</th>
                    <th className="px-4 py-3 font-semibold">Vehicle</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Approval Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">REQ-001</td>
                    <td className="px-4 py-3">MP04AB1234</td>
                    <td className="px-4 py-3">Routine Service</td>
                    <td className="px-4 py-3">28/06/2026</td>
                    <td className="px-4 py-3">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                        Pending Admin Approval
                      </span>
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
