import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {
  TextBox,
  DropDownList,
  Checkbox,
  NumberBox,
} from 'shared/components/forms';

export default function StudentEligibility() {
  const [form, setForm] = useState({
    student: '',
    attendancePercentage: undefined,
    feeStatus: '',
    hallTicketStatus: '',
    eligible: false,
    debarred: false,
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      student: 'Mock student 1',
      attendancePercentage: 'Mock attendancePercentage 1',
      feeStatus: 'Active',
      hallTicketStatus: 'Active',
      eligible: true,
      debarred: true,
    },
    {
      id: 2,
      student: 'Mock student 2',
      attendancePercentage: 'Mock attendancePercentage 2',
      feeStatus: 'Active',
      hallTicketStatus: 'Active',
      eligible: true,
      debarred: true,
    },
    {
      id: 3,
      student: 'Mock student 3',
      attendancePercentage: 'Mock attendancePercentage 3',
      feeStatus: 'Active',
      hallTicketStatus: 'Active',
      eligible: true,
      debarred: true,
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      student: '',
      attendancePercentage: undefined,
      feeStatus: '',
      hallTicketStatus: '',
      eligible: false,
      debarred: false,
    });
  };

  const handleClear = () => {
    setForm({
      student: '',
      attendancePercentage: undefined,
      feeStatus: '',
      hallTicketStatus: '',
      eligible: false,
      debarred: false,
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Student Eligibility"
      description="Manage Student Eligibility"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Student Eligibility' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Student"
            value={form.student}
            onChange={(v: any) => handleChange('student', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Student"
          />
          <NumberBox
            label="Attendance Percentage"
            value={form.attendancePercentage}
            onChange={(v: any) => handleChange('attendancePercentage', v)}
            placeholder="Enter Attendance Percentage"
          />
          <TextBox
            label="Fee Status"
            value={form.feeStatus}
            onChange={(v: any) => handleChange('feeStatus', v)}
            placeholder="Enter Fee Status"
          />
          <TextBox
            label="Hall Ticket Status"
            value={form.hallTicketStatus}
            onChange={(v: any) => handleChange('hallTicketStatus', v)}
            placeholder="Enter Hall Ticket Status"
          />
          <div className="flex items-center pt-6">
            <Checkbox
              label="Eligible"
              checked={Boolean(form.eligible)}
              onChange={(e: any) => handleChange('eligible', e.target.checked)}
            />
          </div>
          <div className="flex items-center pt-6">
            <Checkbox
              label="Debarred"
              checked={Boolean(form.debarred)}
              onChange={(e: any) => handleChange('debarred', e.target.checked)}
            />
          </div>
        </FormGrid>
        <FormActions onSave={handleSave} onReset={handleClear} />
      </FormCard>

      <FormCard title="Records List" className="mt-8">
        <DataTable
          value={records}
          stripedRows
          paginator
          rows={5}
          className="w-full"
        >
          <Column field="id" header="ID" />
          <Column field="student" header="Student" />
          <Column field="attendancePercentage" header="Attendance Percentage" />
          <Column field="feeStatus" header="Fee Status" />
          <Column field="hallTicketStatus" header="Hall Ticket Status" />
          <Column field="eligible" header="Eligible" />
          <Column field="debarred" header="Debarred" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
