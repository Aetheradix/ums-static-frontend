import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  Checkbox,
} from 'shared/components/forms';

const staffTypes = [
  { name: 'Driver', value: 'driver' },
  { name: 'Attender', value: 'attender' },
];

export default function DriverAttenderRegistration() {
  const [form, setForm] = useState({
    staffType: 'driver',
    name: '',
    fatherName: '',
    mobile: '',
    aadhaar: '',
    drivingLicenseNo: '',
    licenseExpiry: undefined,
    experience: '',
    address: '',
    joiningDate: undefined,
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isDriver = form.staffType === 'driver';

  return (
    <FormPage
      title="Driver & Attender Registration"
      description="Register drivers and attenders."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Driver & Attender Registration' },
      ]}
    >
      <FormCard title="Staff Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Staff Type"
            data={staffTypes}
            value={form.staffType}
            onChange={v => handleChange('staffType', String(v))}
            textField="name"
            optionValue="value"
            required
          />
          <TextBox
            label="Name"
            value={form.name}
            onChange={v => handleChange('name', v)}
            placeholder="Enter Name"
            required
          />
          {isDriver && (
            <TextBox
              label="Father Name"
              value={form.fatherName}
              onChange={v => handleChange('fatherName', v)}
              placeholder="Enter Father Name"
            />
          )}
          <TextBox
            label="Mobile Number"
            value={form.mobile}
            onChange={v => handleChange('mobile', v)}
            placeholder="Enter Mobile"
            required
          />
          <TextBox
            label="Aadhaar Number"
            value={form.aadhaar}
            onChange={v => handleChange('aadhaar', v)}
            placeholder="Enter Aadhaar"
            required
          />
          <TextBox
            label="Address"
            value={form.address}
            onChange={v => handleChange('address', v)}
            placeholder="Enter Full Address"
          />
          <DatePicker
            label="Joining Date"
            value={form.joiningDate}
            onChange={v => handleChange('joiningDate', v)}
            placeholder="DD/MM/YYYY"
            required
          />

          {isDriver && (
            <>
              <TextBox
                label="Driving License No"
                value={form.drivingLicenseNo}
                onChange={v => handleChange('drivingLicenseNo', v)}
                placeholder="Enter DL Number"
                required
              />
              <DatePicker
                label="License Expiry"
                value={form.licenseExpiry}
                onChange={v => handleChange('licenseExpiry', v)}
                placeholder="DD/MM/YYYY"
                required
              />
              <TextBox
                label="Experience (Years)"
                value={form.experience}
                onChange={v => handleChange('experience', v)}
                placeholder="Ex: 5"
              />
            </>
          )}

          <div className="flex items-center pt-6">
            <Checkbox
              label="Status (Active/InActive)"
              checked={form.isActive}
              onChange={(e: any) => handleChange('isActive', e.target.checked)}
            />
          </div>
        </FormGrid>
      </FormCard>

      <div className="flex items-center gap-4 mt-8">
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
