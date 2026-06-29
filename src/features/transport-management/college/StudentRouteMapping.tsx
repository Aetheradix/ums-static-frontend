import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList, DatePicker } from 'shared/components/forms';

const routes = [
  { name: 'Route 1 (City Center)', value: 'r1' },
  { name: 'Route 2 (South Zone)', value: 'r2' },
];

const stops = [
  { name: 'Stop A (Main Market)', value: 'stop_a' },
  { name: 'Stop B (Square)', value: 'stop_b' },
];

export default function StudentRouteMapping() {
  const [form, setForm] = useState({
    studentName: '',
    class: '',
    section: '',
    admissionNumber: '',
    route: '',
    pickupStop: '',
    dropStop: '',
    pickupTime: '',
    dropTime: '',
    effectiveDate: undefined,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Student to Route & Stop Mapping"
      description="Assign students to pickup/drop stops."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
        { label: 'Student Route Mapping' },
      ]}
    >
      <FormCard title="Student Details (Search)">
        <FormGrid columns={4}>
          <TextBox
            label="Admission Number"
            value={form.admissionNumber}
            onChange={v => handleChange('admissionNumber', v)}
            placeholder="Enter Admission No"
          />
          <TextBox
            label="Student Name"
            value={form.studentName}
            onChange={v => handleChange('studentName', v)}
            placeholder="Search Student"
          />
          <TextBox
            label="Class"
            value={form.class}
            onChange={v => handleChange('class', v)}
            placeholder="Class"
            disabled
          />
          <TextBox
            label="Section"
            value={form.section}
            onChange={v => handleChange('section', v)}
            placeholder="Section"
            disabled
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Transport Allocation" className="mt-4">
        <FormGrid columns={4}>
          <DropDownList
            label="Route"
            data={routes}
            value={form.route}
            onChange={v => handleChange('route', String(v))}
            textField="name"
            optionValue="value"
            placeholder="Select Route"
            required
          />
          <DropDownList
            label="Pickup Stop"
            data={stops}
            value={form.pickupStop}
            onChange={v => handleChange('pickupStop', String(v))}
            textField="name"
            optionValue="value"
            placeholder="Select Pickup Stop"
            required
          />
          <DropDownList
            label="Drop Stop"
            data={stops}
            value={form.dropStop}
            onChange={v => handleChange('dropStop', String(v))}
            textField="name"
            optionValue="value"
            placeholder="Select Drop Stop"
            required
          />
          <TextBox
            label="Pickup Time"
            value={form.pickupTime}
            onChange={v => handleChange('pickupTime', v)}
            placeholder="Ex: 07:45 AM"
          />
          <TextBox
            label="Drop Time"
            value={form.dropTime}
            onChange={v => handleChange('dropTime', v)}
            placeholder="Ex: 03:15 PM"
          />
          <DatePicker
            label="Effective Date"
            value={form.effectiveDate}
            onChange={v => handleChange('effectiveDate', v)}
            placeholder="DD/MM/YYYY"
            required
          />
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
