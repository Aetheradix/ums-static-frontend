import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DatePicker, Checkbox } from 'shared/components/forms';

export default function InchargeRegistration() {
  const [form, setForm] = useState({
    inchargeName: '',
    dob: null as Date | null,
    contactNo: '',
    emailId: '',
    workingExperience: '',
    fullAddress: '',
    isActive: true,
    declaration: false,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Transport Incharge Registration Detail"
      description="Register a new college transport incharge."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
        { label: 'Transport Incharge Registration' },
      ]}
    >
      <FormCard
        title="College Transport Incharge Registration Master"
        headerAction={
          <Button label="Back to List" variant="primary" icon="undo" />
        }
      >
        <FormGrid columns={4}>
          <TextBox
            label="Incharge Name"
            placeholder="Enter Incharge Name"
            value={form.inchargeName}
            onChange={v => handleChange('inchargeName', v)}
            required
          />
          <DatePicker
            label="Incharge DOB"
            placeholder="dd/mm/yyyy"
            value={form.dob || undefined}
            onChange={v => handleChange('dob', v)}
            required
          />
          <TextBox
            label="Contact No."
            placeholder="Enter Contact No."
            value={form.contactNo}
            onChange={v => handleChange('contactNo', v)}
            required
          />
          <TextBox
            label="Email ID"
            placeholder="Enter Email ID"
            value={form.emailId}
            onChange={v => handleChange('emailId', v)}
            required
          />

          <TextBox
            label="Working Experience"
            placeholder="Enter Working Experience"
            value={form.workingExperience}
            onChange={v => handleChange('workingExperience', v)}
            required
          />
          <TextBox
            label="Full Address"
            placeholder="Enter Full Address"
            value={form.fullAddress}
            onChange={v => handleChange('fullAddress', v)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Pan Card *
            </label>
            <input type="file" className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Driving License *
            </label>
            <input type="file" className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Profile Picture *
            </label>
            <input type="file" className="w-full border p-2 rounded" />
          </div>

          <div className="flex items-center pt-6">
            <Checkbox
              label="Status (Active/InActive)"
              checked={form.isActive}
              onChange={(e: any) => handleChange('isActive', e.target.checked)}
            />
          </div>
        </FormGrid>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <Checkbox
            label="I have verified all the information entered, and there are no errors in the data or documents provided."
            checked={form.declaration}
            onChange={(e: any) => handleChange('declaration', e.target.checked)}
          />
        </div>

        <p className="mt-4 text-xs font-bold text-red-600">
          Note: All Asterisk (*) Marked Fields Are Mandatory
        </p>
      </FormCard>

      <div className="flex items-center gap-4 mt-6">
        <Button label="Save" variant="success" className="min-w-[120px]" />
        <Button
          label="Clear"
          variant="danger"
          className="min-w-[120px]"
          onClick={() =>
            setForm({
              inchargeName: '',
              dob: null,
              contactNo: '',
              emailId: '',
              workingExperience: '',
              fullAddress: '',
              isActive: true,
              declaration: false,
            })
          }
        />
      </div>
    </FormPage>
  );
}
