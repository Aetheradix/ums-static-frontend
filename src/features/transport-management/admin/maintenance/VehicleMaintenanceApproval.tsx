import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';

const pendingRequests = [
  { name: 'REQ-001 (MP04AB1234 - Routine Service)', value: 'req1' },
];

export default function VehicleMaintenanceApproval() {
  const [form, setForm] = useState({
    requestRef: '',
    approvalStatus: 'Approve',
    approvedAmount: '',
    adminRemarks: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Vehicle Maintenance Approval"
      description="Review and approve maintenance requests from colleges."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Maintenance Approval' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FormCard title="Process Request">
            <FormGrid columns={1}>
              <DropDownList
                label="Request Ref"
                data={pendingRequests}
                value={form.requestRef}
                onChange={v => handleChange('requestRef', String(v))}
                textField="name"
                optionValue="value"
                placeholder="Select Request"
                required
              />

              <div className="p-3 bg-gray-50 border rounded text-sm mb-4">
                <p>
                  <strong>College:</strong> SISTec Gandhi Nagar
                </p>
                <p>
                  <strong>Vehicle:</strong> MP04AB1234
                </p>
                <p>
                  <strong>Issue:</strong> Need engine oil change.
                </p>
                <p>
                  <strong>Est Cost:</strong> ₹5,000
                </p>
              </div>

              <DropDownList
                label=""
                data={[
                  { name: 'Approve', value: 'Approve' },
                  { name: 'Reject', value: 'Reject' },
                  { name: 'Hold', value: 'Hold' },
                ]}
                value={form.approvalStatus}
                onChange={v => handleChange('approvalStatus', String(v))}
                textField="name"
                optionValue="value"
                required
              />

              {form.approvalStatus === 'Approve' && (
                <TextBox
                  label="Approved Amount"
                  value={form.approvedAmount}
                  onChange={v => handleChange('approvedAmount', v)}
                  placeholder="Ex: 4500"
                  required
                />
              )}

              <TextBox
                label="Admin Remarks"
                value={form.adminRemarks}
                onChange={v => handleChange('adminRemarks', v)}
                placeholder="Type remarks"
              />
            </FormGrid>
            <div className="flex items-center gap-4 mt-6">
              <Button
                label="Submit Decision"
                variant="success"
                className="w-full"
              />
            </div>
          </FormCard>
        </div>

        <div className="md:col-span-2">
          <FormCard title="Recent Approvals History">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg">
                <thead className="bg-[#f48b50] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Req ID</th>
                    <th className="px-4 py-3 font-semibold">Vehicle</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Approved Amt</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">REQ-000</td>
                    <td className="px-4 py-3">MP08XY9876</td>
                    <td className="px-4 py-3">Accidental Repair</td>
                    <td className="px-4 py-3">₹12,000</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        Approved
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
