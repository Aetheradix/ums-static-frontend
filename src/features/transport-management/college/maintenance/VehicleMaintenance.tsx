import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  FileUpload,
} from 'shared/components/forms';

const approvedRequests = [
  { name: 'REQ-000 (MP08XY9876 - Approved)', value: 'req0' },
];

export default function VehicleMaintenance() {
  const [form, setForm] = useState({
    requestRef: '',
    garageName: '',
    completionDate: undefined,
    actualCost: '',
    invoiceNumber: '',
    invoicePdf: null,
    remarks: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Vehicle Maintenance Log (Execution)"
      description="Record completed maintenance and upload actual invoices."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
        { label: 'Maintenance Log' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FormCard title="Log Maintenance">
            <FormGrid columns={1}>
              <DropDownList
                label="Request Ref"
                data={approvedRequests}
                value={form.requestRef}
                onChange={v => handleChange('requestRef', String(v))}
                textField="name"
                optionValue="value"
                placeholder="Select Request"
                required
              />

              <TextBox
                label="Garage Name"
                value={form.garageName}
                onChange={v => handleChange('garageName', v)}
                placeholder="Ex: Tata Motors Service"
                required
              />
              <DatePicker
                label="Completion Date"
                value={form.completionDate}
                onChange={v => handleChange('completionDate', v)}
                placeholder="DD/MM/YYYY"
                required
              />
              <TextBox
                label="Actual Cost"
                value={form.actualCost}
                onChange={v => handleChange('actualCost', v)}
                placeholder="Ex: 11500"
                required
              />
              <TextBox
                label="Invoice Number"
                value={form.invoiceNumber}
                onChange={v => handleChange('invoiceNumber', v)}
                placeholder="Ex: INV-9988"
                required
              />
              <FileUpload
                label="Invoice Pdf"
                value={form.invoicePdf}
                onChange={file => handleChange('invoicePdf', file)}
              />
              <TextBox
                label="Remarks"
                value={form.remarks}
                onChange={v => handleChange('remarks', v)}
                placeholder="Type remarks"
              />
            </FormGrid>
            <div className="flex items-center gap-4 mt-6">
              <Button
                label="Save Record"
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
          <FormCard title="Completed Maintenance Logs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg">
                <thead className="bg-[#f48b50] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Req ID</th>
                    <th className="px-4 py-3 font-semibold">Garage</th>
                    <th className="px-4 py-3 font-semibold">Completion Date</th>
                    <th className="px-4 py-3 font-semibold">Actual Cost</th>
                    <th className="px-4 py-3 font-semibold">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">REQ-000</td>
                    <td className="px-4 py-3">Tata Motors Service</td>
                    <td className="px-4 py-3">25/06/2026</td>
                    <td className="px-4 py-3">₹11,500</td>
                    <td className="px-4 py-3 text-blue-600 underline cursor-pointer">
                      INV-9988.pdf
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
