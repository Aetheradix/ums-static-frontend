import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormGrid,
  FormActions,
} from 'shared/new-components';
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
    agreementDocument: null as File | null,
    agreementValidity: undefined as Date | undefined,
    declaration: false,
  });

  const [agreements, setAgreements] = useState<any[]>([]);

  const handleAddAgreement = () => {
    if (!form.districtMapping || !form.agreementValidity) return;

    const newAgreement = {
      district: form.districtMapping,
      validity: form.agreementValidity,
      document: form.agreementDocument,
    };

    setAgreements(prev => [...prev, newAgreement]);

    // Clear the fields
    setForm(prev => ({
      ...prev,
      districtMapping: '',
      agreementDocument: null,
      agreementValidity: undefined,
    }));
  };

  const handleRemoveAgreement = (index: number) => {
    setAgreements(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.firmName || !form.contactNumber) return;
    // Add save logic here

    setForm({
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
              onChange={(checked: boolean) => handleChange('isActive', checked)}
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
              <Button
                label="Add"
                variant="success"
                className="min-w-[80px]"
                onClick={handleAddAgreement}
                disabled={!form.districtMapping || !form.agreementValidity}
              />
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
              {agreements.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-400 bg-white"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                agreements.map((item, index) => {
                  const districtName =
                    districtOptions.find(d => d.value === item.district)
                      ?.name || item.district;
                  const dateStr =
                    item.validity instanceof Date
                      ? item.validity.toLocaleDateString()
                      : String(item.validity);

                  return (
                    <tr
                      key={index}
                      className="bg-white border-b border-gray-100"
                    >
                      <td className="px-4 py-3 text-center">{districtName}</td>
                      <td className="px-4 py-3 text-center">{dateStr}</td>
                      <td className="px-4 py-3 text-center">
                        {item.document
                          ? (item.document as File).name
                          : 'No file'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          label=""
                          icon="trash"
                          variant="danger"
                          className="px-2 py-1 min-w-0"
                          onClick={() => handleRemoveAgreement(index)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <Checkbox
            label="I have verified all the information entered, and there are no errors in the data or documents provided."
            checked={form.declaration}
            onChange={(checked: boolean) =>
              handleChange('declaration', checked)
            }
          />
          <p className="text-xs font-bold text-red-600">
            Note: All Asterisk (*) Marked Fields Are Mandatory
          </p>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <FormActions
            align="left"
            onSave={handleSave}
            onReset={() => window.location.reload()}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
