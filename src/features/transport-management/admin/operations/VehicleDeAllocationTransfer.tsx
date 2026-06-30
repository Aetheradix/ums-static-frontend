import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  FileUpload,
} from 'shared/components/forms';

const allottedVehicles = [{ name: 'MP04AB1234 (Sports Dept)', value: 'a1' }];

const newDepartments = [
  { name: 'Administration', value: 'admin' },
  { name: 'Guest Transport', value: 'guest' },
];

export default function VehicleDeAllocationTransfer() {
  const [form, setForm] = useState({
    allotmentRef: '',
    actionType: 'deallocate',
    newDepartment: '',
    transferDate: undefined,
    reason: '',
    documentPdf: null,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Vehicle De-Allocation & Transfer"
      description="Release allotted vehicles or transfer them to another department."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'De-Allocation / Transfer' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FormCard title="Process Action">
            <FormGrid columns={1}>
              <DropDownList
                label="Allotment Ref"
                data={allottedVehicles}
                value={form.allotmentRef}
                onChange={v => handleChange('allotmentRef', String(v))}
                textField="name"
                optionValue="value"
                placeholder="Select Vehicle"
                required
              />

              <DropDownList
                label=""
                data={[
                  { name: 'De-Allocate (Return to Pool)', value: 'deallocate' },
                  { name: 'Transfer to Department', value: 'transfer' },
                ]}
                value={form.actionType}
                onChange={v => handleChange('actionType', String(v))}
                textField="name"
                optionValue="value"
                required
              />

              {form.actionType === 'transfer' && (
                <DropDownList
                  label="New Department"
                  data={newDepartments}
                  value={form.newDepartment}
                  onChange={v => handleChange('newDepartment', String(v))}
                  textField="name"
                  optionValue="value"
                  placeholder="Select New Department"
                  required
                />
              )}

              <DatePicker
                label="Transfer Date"
                value={form.transferDate}
                onChange={v => handleChange('transferDate', v)}
                placeholder="DD/MM/YYYY"
                required
              />
              <TextBox
                label="Reason / Remarks"
                value={form.reason}
                onChange={v => handleChange('reason', v)}
                placeholder="Type details"
              />
              <FileUpload
                label="Supporting Document (Optional)"
                value={form.documentPdf}
                onChange={file => handleChange('documentPdf', file)}
              />
            </FormGrid>
            <div className="flex items-center gap-4 mt-6">
              <Button
                label="Process Action"
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
          <FormCard title="Recent History">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg">
                <thead className="bg-[#f48b50] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Vehicle</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                    <th className="px-4 py-3 font-semibold">From / To</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">MP08XY9876</td>
                    <td className="px-4 py-3">De-Allocated</td>
                    <td className="px-4 py-3">From: Guest Transport</td>
                    <td className="px-4 py-3">20/06/2026</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        Completed
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
