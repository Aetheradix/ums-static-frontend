import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList, TimePicker } from 'shared/components/forms';

const shifts = [
  { name: 'Morning', value: 'morning' },
  { name: 'Afternoon', value: 'afternoon' },
  { name: 'Evening', value: 'evening' },
];

const routes = [
  { name: 'Route 1', value: 'r1' },
  { name: 'Route 2', value: 'r2' },
];

const busStops = [
  { name: 'Stop A', value: 'stop_a' },
  { name: 'Stop B', value: 'stop_b' },
];

export default function RouteBusStopMapping() {
  const [form, setForm] = useState({
    shift: '',
    routeNumber: '',
    routeDistance: '',
    busStop: '',
    busStopDistance: '',
    arrivalTime: undefined,
    departureTime: undefined,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Route To Bus Stop Mapping Master Details"
      description="Map routes to respective bus stops through this page."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
        { label: 'Route to Bus Stop Mapping' },
      ]}
    >
      <FormCard
        title="Route To Bus Stop Mapping"
        headerAction={
          <Button label="Back to List" variant="primary" icon="undo" />
        }
      >
        <FormGrid columns={4}>
          <DropDownList
            label="Shift"
            data={shifts}
            textField="name"
            optionValue="value"
            value={form.shift}
            onChange={v => handleChange('shift', String(v))}
            required
            placeholder="Select"
          />
          <DropDownList
            label="Route Number"
            data={routes}
            textField="name"
            optionValue="value"
            value={form.routeNumber}
            onChange={v => handleChange('routeNumber', String(v))}
            required
            placeholder="Select"
          />
          <TextBox
            label="Route Distance (in Km.)"
            placeholder="Distance(in Km.)"
            value={form.routeDistance}
            onChange={v => handleChange('routeDistance', v)}
            disabled
          />
          <DropDownList
            label="Bus Stop"
            data={busStops}
            textField="name"
            optionValue="value"
            value={form.busStop}
            onChange={v => handleChange('busStop', String(v))}
            required
            placeholder="Select"
          />

          <TextBox
            label="Bus Stop Distance (in Km.)"
            placeholder="Enter Distance(in Km.)"
            value={form.busStopDistance}
            onChange={v => handleChange('busStopDistance', v)}
            required
          />
          <TimePicker
            label="Arrival Time"
            placeholder="--:--"
            value={form.arrivalTime}
            onChange={v => handleChange('arrivalTime', v)}
            required
          />
          <TimePicker
            label="Departure Time"
            placeholder="--:--"
            value={form.departureTime}
            onChange={v => handleChange('departureTime', v)}
            required
          />
        </FormGrid>

        <div className="flex items-center gap-4 mt-8">
          <Button label="Add" variant="success" className="min-w-[120px]" />
          <Button
            label="Clear"
            variant="danger"
            className="min-w-[120px]"
            onClick={() =>
              setForm({
                shift: '',
                routeNumber: '',
                routeDistance: '',
                busStop: '',
                busStopDistance: '',
                arrivalTime: undefined,
                departureTime: undefined,
              })
            }
          />
        </div>

        <p className="mt-4 text-xs font-bold text-red-600">
          Note: All Asterisk (*) Marked Fields Are Mandatory
        </p>
      </FormCard>
    </FormPage>
  );
}
