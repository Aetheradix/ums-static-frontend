import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, DatePicker, Checkbox } from 'shared/components/forms';

const drivers = [
  { name: 'Ramesh Kumar (DL-1234)', value: 'driver_1' },
  { name: 'Suresh Singh (DL-5678)', value: 'driver_2' },
];

const attenders = [
  { name: 'Mukesh (ATT-01)', value: 'att_1' },
  { name: 'Raju (ATT-02)', value: 'att_2' },
];

const vehicles = [
  { name: 'MP04AB1234 (Bus)', value: 'v1' },
  { name: 'MP08XY9876 (Van)', value: 'v2' },
];

export default function DriverVehicleMapping() {
  const [form, setForm] = useState({
    driver: '',
    vehicle: '',
    attender: '',
    fromDate: undefined,
    toDate: undefined,
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Driver to Vehicle Mapping"
      description="Map drivers and attenders to specific vehicles."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
        { label: 'Driver to Vehicle Mapping' },
      ]}
    >
      <FormCard title="Mapping Details">
        <FormGrid columns={4}>
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
          <DropDownList
            label="Driver"
            data={drivers}
            value={form.driver}
            onChange={v => handleChange('driver', String(v))}
            textField="name"
            optionValue="value"
            placeholder="Select Driver"
            required
          />
          <DropDownList
            label="Attender"
            data={attenders}
            value={form.attender}
            onChange={v => handleChange('attender', String(v))}
            textField="name"
            optionValue="value"
            placeholder="Select Attender"
          />
          <DatePicker
            label="From Date"
            value={form.fromDate}
            onChange={v => handleChange('fromDate', v)}
            placeholder="DD/MM/YYYY"
            required
          />
          <DatePicker
            label="To Date"
            value={form.toDate}
            onChange={v => handleChange('toDate', v)}
            placeholder="DD/MM/YYYY"
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
