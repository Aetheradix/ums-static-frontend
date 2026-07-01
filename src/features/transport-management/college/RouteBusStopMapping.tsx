import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormGrid,
  FormActions,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import Grid from 'shared/components/grid/Grid';
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
    arrivalTime: undefined as Date | undefined,
    departureTime: undefined as Date | undefined,
  });

  const [records, setRecords] = useState([
    {
      routeNumber: 'Route 1',
      shift: 'Morning',
      busStop: 'Stop A',
      arrivalTime: '08:00 AM',
      departureTime: '08:05 AM',
    },
    {
      routeNumber: 'Route 1',
      shift: 'Morning',
      busStop: 'Stop B',
      arrivalTime: '08:15 AM',
      departureTime: '08:20 AM',
    },
    {
      routeNumber: 'Route 2',
      shift: 'Evening',
      busStop: 'Stop A',
      arrivalTime: '04:00 PM',
      departureTime: '04:05 PM',
    },
  ]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (!form.routeNumber || !form.shift || !form.busStop) return;
    setRecords(prev => [
      ...prev,
      {
        routeNumber:
          routes.find(r => r.value === form.routeNumber)?.name ||
          form.routeNumber,
        shift: shifts.find(s => s.value === form.shift)?.name || form.shift,
        busStop:
          busStops.find(s => s.value === form.busStop)?.name || form.busStop,
        arrivalTime:
          form.arrivalTime instanceof Date
            ? (form.arrivalTime as Date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-',
        departureTime:
          form.departureTime instanceof Date
            ? (form.departureTime as Date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-',
      },
    ]);

    setForm({
      shift: '',
      routeNumber: '',
      routeDistance: '',
      busStop: '',
      busStopDistance: '',
      arrivalTime: undefined,
      departureTime: undefined,
    });
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

        <p className="mt-4 text-xs font-bold text-red-600">
          Note: All Asterisk (*) Marked Fields Are Mandatory
        </p>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <FormActions
            align="left"
            onSave={handleAdd}
            onReset={() => window.location.reload()}
          />
        </div>
      </FormCard>

      <FormCard title="Mapped Route to Bus Stops (Dummy Data)" className="mt-4">
        <Grid
          data={records}
          columns={[
            { field: 'routeNumber', header: 'Route' },
            { field: 'shift', header: 'Shift' },
            { field: 'busStop', header: 'Bus Stop' },
            { field: 'arrivalTime', header: 'Arrival Time' },
            { field: 'departureTime', header: 'Departure Time' },
          ]}
          onEdit={() => {}}
          onRemove={() => {}}
        />
      </FormCard>
    </FormPage>
  );
}
