import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, DatePicker, Checkbox } from 'shared/components/forms';

const colleges = [
  { name: 'SISTec Gandhi Nagar', value: 'sistec_gn' },
  { name: 'SISTec Ratibad', value: 'sistec_r' },
  { name: 'SISTec College', value: 'sps' },
];

const vehicles = [
  { name: 'MP04AB1234 (Bus)', value: 'v1' },
  { name: 'MP08XY9876 (Van)', value: 'v2' },
];

export default function VehicleCollegeMapping() {
  const [form, setForm] = useState({
    college: '',
    vehicle: '',
    effectiveDate: undefined,
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Vehicle to College Mapping"
      description="Allocate registered vehicles to colleges."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Vehicle to College Mapping' },
      ]}
      headerAction={
        <Button label="Back to List" variant="primary" icon="undo" />
      }
    >
      <FormCard title="Mapping Details">
        <FormGrid columns={4}>
          <DropDownList
            label="College"
            data={colleges}
            value={form.college}
            onChange={v => handleChange('college', String(v))}
            textField="name"
            optionValue="value"
            placeholder="Select College"
            required
          />
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
          <DatePicker
            label="Effective Date"
            value={form.effectiveDate}
            onChange={v => handleChange('effectiveDate', v)}
            placeholder="DD/MM/YYYY"
            required
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

      <FormCard>
        <div className="flex items-center gap-4 mt-8">
          <Button label="Save" variant="success" className="min-w-[120px]" />
          <Button
            label="Clear"
            variant="danger"
            className="min-w-[120px]"
            onClick={() => window.location.reload()}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
