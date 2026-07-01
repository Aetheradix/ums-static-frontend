import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormGrid,
  FormActions,
} from 'shared/new-components';

import { TextBox, DropDownList, DatePicker } from 'shared/components/forms';

const routes = [
  { name: 'Route 1 (City Center)', value: 'r1' },
  { name: 'Route 2 (South Zone)', value: 'r2' },
];

const vehicles = [
  { name: 'MP04AB1234 (Bus)', value: 'v1' },
  { name: 'MP08XY9876 (Van)', value: 'v2' },
];

const drivers = [
  { name: 'Ramesh Kumar (DL-1234)', value: 'driver_1' },
  { name: 'Suresh Singh (DL-5678)', value: 'driver_2' },
];

const attenders = [
  { name: 'Mukesh (ATT-01)', value: 'att_1' },
  { name: 'Raju (ATT-02)', value: 'att_2' },
];

export default function RouteBusMapping() {
  const [form, setForm] = useState({
    route: '',
    vehicle: '',
    driver: '',
    attender: '',
    startTime: '',
    endTime: '',
    effectiveDate: undefined,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Route to Bus Mapping"
      description="Map routes to specific buses/vehicles."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
        { label: 'Route to Bus Mapping' },
      ]}
    >
      <FormCard title="Mapping Details">
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
          <TextBox
            label="Start Time"
            value={form.startTime}
            onChange={v => handleChange('startTime', v)}
            placeholder="Ex: 07:30 AM"
            required
          />
          <TextBox
            label="End Time"
            value={form.endTime}
            onChange={v => handleChange('endTime', v)}
            placeholder="Ex: 09:00 AM"
            required
          />
          <DatePicker
            label="Effective Date"
            value={form.effectiveDate}
            onChange={v => handleChange('effectiveDate', v)}
            placeholder="DD/MM/YYYY"
            required
          />
        </FormGrid>

        <FormActions align="left" onReset={() => window.location.reload()} />
      </FormCard>
    </FormPage>
  );
}
