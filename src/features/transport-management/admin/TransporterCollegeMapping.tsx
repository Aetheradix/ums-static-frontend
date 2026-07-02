import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormGrid,
  FormActions,
} from 'shared/new-components';
import {
  TextBox,
  DropDownList,
  DatePicker,
  Checkbox,
} from 'shared/components/forms';

const colleges = [
  { name: 'SISTec Gandhi Nagar', value: 'sistec_gn' },
  { name: 'SISTec Ratibad', value: 'sistec_r' },
  { name: 'SISTec College', value: 'sps' },
];

const transporters = [
  { name: 'Rajesh Travels', value: 'rajesh_travels' },
  { name: 'City Bus Service', value: 'cbs' },
];

export default function TransporterCollegeMapping() {
  const [form, setForm] = useState({
    college: '',
    transporter: '',
    agreementNumber: '',
    effectiveDate: undefined,
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Transporter to College Mapping"
      description="Map transporters to respective colleges."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Transporter to College Mapping' },
      ]}
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
            label="Transporter"
            data={transporters}
            value={form.transporter}
            onChange={v => handleChange('transporter', String(v))}
            textField="name"
            optionValue="value"
            placeholder="Select Transporter"
            required
          />
          <TextBox
            label="Agreement Number"
            value={form.agreementNumber}
            onChange={v => handleChange('agreementNumber', v)}
            placeholder="Enter Agreement No"
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

        <FormActions align="left" onReset={() => window.location.reload()} />
      </FormCard>
    </FormPage>
  );
}
