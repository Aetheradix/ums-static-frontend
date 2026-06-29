import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  FileUpload,
  Checkbox,
} from 'shared/components/forms';

const stateOptions = [
  { name: 'State A', value: 'a' },
  { name: 'State B', value: 'b' },
];

const districtOptions = [
  { name: 'District X', value: 'x' },
  { name: 'District Y', value: 'y' },
];

export default function TransporterRegistration() {
  const [form, setForm] = useState({
    firmName: '',
    firmRegistrationNumber: '',
    stateName: '',
    gstinNumber: '',
    panCardNumber: '',
    firmAddress: '',
    contactPersonName: '',
    contactNumber: '',
    firmLadlineNumber: '',
    emailId: '',
    firmDocument: null,
    isActive: true,

    ifscCode: '',
    bankName: '',
    branchName: '',
    accountNo: '',
    accountHolderName: '',
    bankDocument: null,

    districtMapping: '',
    agreementDocument: null,
    agreementValidity: undefined,
    declaration: false,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Transporter Registration Detail"
      description="Register new transporters through this page."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Transporter Registration Detail' },
      ]}
    >
      <FormCard title="Transporter Details">
        <FormGrid columns={4}>
          <TextBox
            label="Firm Name"
            placeholder="Enter Firm Name"
            value={form.firmName}
            onChange={v => handleChange('firmName', v)}
            required
          />
          <TextBox
            label="Firm Registration Number"
            placeholder="Enter Firm Registration Number"
            value={form.firmRegistrationNumber}
            onChange={v => handleChange('firmRegistrationNumber', v)}
            required
          />
          <DropDownList
            label="State Name"
            data={stateOptions}
            textField="name"
            optionValue="value"
            value={form.stateName}
            onChange={v => handleChange('stateName', String(v))}
            placeholder="Select"
            required
          />
          <TextBox
            label="GSTIN Number"
            placeholder="Enter GSTIN Number"
            value={form.gstinNumber}
            onChange={v => handleChange('gstinNumber', v)}
            required
          />
          <TextBox
            label="PAN Card Number"
            placeholder="Enter PAN Card Number"
            value={form.panCardNumber}
            onChange={v => handleChange('panCardNumber', v)}
            required
          />
          <TextBox
            label="Firm Address"
            placeholder="Enter Firm Address"
            value={form.firmAddress}
            onChange={v => handleChange('firmAddress', v)}
            required
          />
          <TextBox
            label="Contact Person Name"
            placeholder="Enter Contact Person Name"
            value={form.contactPersonName}
            onChange={v => handleChange('contactPersonName', v)}
            required
          />
          <TextBox
            label="Contact Number"
            placeholder="Enter Contact Number"
            value={form.contactNumber}
            onChange={v => handleChange('contactNumber', v)}
            required
          />
          <TextBox
            label="Firm Ladline Number"
            placeholder="Enter Firm Ladline Number"
            value={form.firmLadlineNumber}
            onChange={v => handleChange('firmLadlineNumber', v)}
            required
          />
          <TextBox
            label="Email-ID"
            placeholder="Enter Email-ID"
            value={form.emailId}
            onChange={v => handleChange('emailId', v)}
            required
          />
          <FileUpload
            label="Upload Firm Document (size 500Kb)"
            value={form.firmDocument}
            onChange={file => handleChange('firmDocument', file)}
          />
          <div className="flex items-center pt-6">
            <Checkbox
              label="Status (Active/InActive)"
              checked={form.isActive}
              onChange={(e: any) => handleChange('isActive', e.target.checked)}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard title="Bank Account Information" className="mt-4">
        <FormGrid columns={4}>
          <TextBox
            label="IFSC Code"
            placeholder="Enter IFSC Code"
            value={form.ifscCode}
            onChange={v => handleChange('ifscCode', v)}
            required
          />
          <TextBox
            label="Bank Name"
            placeholder="Enter Bank Name"
            value={form.bankName}
            onChange={v => handleChange('bankName', v)}
            required
          />
          <TextBox
            label="Branch Name"
            placeholder="Enter Branch Name"
            value={form.branchName}
            onChange={v => handleChange('branchName', v)}
            required
          />
          <TextBox
            label="Account No."
            placeholder="Enter Account No."
            value={form.accountNo}
            onChange={v => handleChange('accountNo', v)}
            required
          />
          <TextBox
            label="Account Holder Name"
            placeholder="Enter Account Holder Name"
            value={form.accountHolderName}
            onChange={v => handleChange('accountHolderName', v)}
            required
          />
          <FileUpload
            label="Upload Bank Document (size 500Kb)"
            value={form.bankDocument}
            onChange={file => handleChange('bankDocument', file)}
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Upload Agreement" className="mt-4">
        <FormGrid columns={4}>
          <DropDownList
            label="Trasporter District Mapping"
            data={districtOptions}
            textField="name"
            optionValue="value"
            value={form.districtMapping}
            onChange={v => handleChange('districtMapping', String(v))}
            placeholder="Select"
            required
          />
          <FileUpload
            label="Upload Agreement (Size 10mb)"
            value={form.agreementDocument}
            onChange={file => handleChange('agreementDocument', file)}
          />
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <DatePicker
                label="Agreement Validity"
                placeholder="DD/MM/YYYY"
                value={form.agreementValidity}
                onChange={v => handleChange('agreementValidity', v)}
                required
              />
            </div>
            <div className="pb-1">
              <Button label="Add" variant="success" className="min-w-[80px]" />
            </div>
          </div>
        </FormGrid>

        <div className="mt-6 border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold text-center">
                  District
                </th>
                <th className="px-4 py-3 font-semibold text-center">
                  Validity
                </th>
                <th className="px-4 py-3 font-semibold text-center">
                  Document
                </th>
                <th className="px-4 py-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-gray-400 bg-white"
                >
                  No records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormCard>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <Checkbox
          label="I have verified all the information entered, and there are no errors in the data or documents provided."
          checked={form.declaration}
          onChange={(e: any) => handleChange('declaration', e.target.checked)}
        />
        <p className="mt-4 text-xs font-bold text-red-600">
          Note: All Asterisk (*) Marked Fields Are Mandatory
        </p>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <Button label="Save" variant="success" className="min-w-[120px]" />
        <Button
          label="Clear"
          variant="danger"
          className="min-w-[120px]"
          onClick={() => window.location.reload()}
        />
      </div>
    </FormPage>
  );
}
