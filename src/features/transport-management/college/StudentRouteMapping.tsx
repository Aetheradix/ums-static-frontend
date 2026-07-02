import { useState } from 'react';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import Grid from 'shared/components/grid/Grid';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
} from 'shared/new-components';

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

  const [records, setRecords] = useState([
    {
      studentName: 'Amit Kumar',
      enrollmentNo: '1200456',
      route: 'Route 1 (City Center)',
      pickupStop: 'Stop A',
      timing: '07:45 AM / 03:15 PM',
    },
    {
      studentName: 'Sneha Patel',
      enrollmentNo: '1200457',
      route: 'Route 2 (South Zone)',
      pickupStop: 'Stop B',
      timing: '08:10 AM / 03:40 PM',
    },
    {
      studentName: 'Rahul Verma',
      enrollmentNo: '1200458',
      route: 'Route 1 (City Center)',
      pickupStop: 'Stop A',
      timing: '07:45 AM / 03:15 PM',
    },
  ]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.studentName || !form.route) return;
    setRecords(prev => [
      ...prev,
      {
        studentName: form.studentName,
        enrollmentNo: form.admissionNumber || '-',
        route: routes.find(r => r.value === form.route)?.name || form.route,
        pickupStop:
          stops.find(s => s.value === form.pickupStop)?.name || form.pickupStop,
        timing: `${form.pickupTime || '-'} / ${form.dropTime || '-'}`,
      },
    ]);

    setForm({
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

        <div className="mt-6 border-t border-gray-100 dark:border-slate-800 pt-6">
          <FormActions
            align="left"
            onSave={handleSave}
            onReset={() => window.location.reload()}
          />
        </div>
      </FormCard>

      <FormCard title="Student Mapping Details (Dummy Data)" className="mt-4">
        <Grid
          data={records}
          columns={[
            { field: 'studentName', header: 'Student Name' },
            { field: 'enrollmentNo', header: 'Enrollment No' },
            { field: 'route', header: 'Route' },
            { field: 'pickupStop', header: 'Pickup Stop' },
            { field: 'timing', header: 'Timing' },
          ]}
          onEdit={() => {}}
          onRemove={() => {}}
        />
      </FormCard>
    </FormPage>
  );
}
