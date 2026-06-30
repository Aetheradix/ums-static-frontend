import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  FileUpload,
} from 'shared/components/forms';

const vehicles = [
  { name: 'MP04AB1234 (Bus)', value: 'v1' },
  { name: 'MP08XY9876 (Van)', value: 'v2' },
];

const insuranceCompanies = [
  { name: 'Bajaj Allianz', value: 'c1' },
  { name: 'LIC', value: 'c2' },
];

export default function VehicleInsurance() {
  const [form, setForm] = useState({
    vehicle: '',
    insuranceCompany: '',
    policyNumber: '',
    startDate: undefined,
    endDate: undefined,
    premiumAmount: '',
    documentPdf: null,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Vehicle Insurance Details"
      description="Track and manage insurance policies for vehicles."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Vehicle Insurance' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FormCard title="Add / Update Insurance">
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
                label="Insurance Company"
                data={insuranceCompanies}
                value={form.insuranceCompany}
                onChange={v => handleChange('insuranceCompany', String(v))}
                textField="name"
                optionValue="value"
                placeholder="Select Company"
                required
              />
              <TextBox
                label="Policy Number"
                value={form.policyNumber}
                onChange={v => handleChange('policyNumber', v)}
                placeholder="Ex: POL12345"
                required
              />
              <DatePicker
                label="Start Date"
                value={form.startDate}
                onChange={v => handleChange('startDate', v)}
                placeholder="DD/MM/YYYY"
                required
              />
              <DatePicker
                label="End Date"
                value={form.endDate}
                onChange={v => handleChange('endDate', v)}
                placeholder="DD/MM/YYYY"
                required
              />
              <TextBox
                label="Premium Amount (₹)"
                value={form.premiumAmount}
                onChange={v => handleChange('premiumAmount', v)}
                placeholder="Ex: 15000"
              />
              <FileUpload
                label="Upload Policy PDF"
                value={form.documentPdf}
                onChange={file => handleChange('documentPdf', file)}
              />
            </FormGrid>
            <div className="flex items-center gap-4 mt-6">
              <Button
                label="Save Policy"
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
          <FormCard title="Active Policies List">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg">
                <thead className="bg-[#f48b50] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Vehicle</th>
                    <th className="px-4 py-3 font-semibold">Company</th>
                    <th className="px-4 py-3 font-semibold">Policy No</th>
                    <th className="px-4 py-3 font-semibold">Expiry Date</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">MP04AB1234</td>
                    <td className="px-4 py-3">Bajaj Allianz</td>
                    <td className="px-4 py-3">BAJ9876543</td>
                    <td className="px-4 py-3">15/08/2026</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
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
                  <tr className="border-b bg-red-50 hover:bg-red-100">
                    <td className="px-4 py-3 font-medium">MP08XY9876</td>
                    <td className="px-4 py-3">LIC</td>
                    <td className="px-4 py-3">LIC1122334</td>
                    <td className="px-4 py-3 text-red-600 font-bold">
                      10/05/2026
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        Expired
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        label="Renew"
                        variant="success"
                        icon="refresh"
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
