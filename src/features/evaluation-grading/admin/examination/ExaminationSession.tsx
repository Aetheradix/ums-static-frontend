import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TextBox, DropDownList, DatePicker } from 'shared/components/forms';

export default function ExaminationSession() {
  const [form, setForm] = useState({
    session: '',
    examSession: '',
    startDate: undefined,
    endDate: undefined,
    resultDate: undefined,
    status: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      session: 'Mock session 1',
      examSession: 'Mock examSession 1',
      startDate: '01/01/2024',
      endDate: '01/01/2024',
      resultDate: '01/01/2024',
      status: 'Active',
    },
    {
      id: 2,
      session: 'Mock session 2',
      examSession: 'Mock examSession 2',
      startDate: '01/01/2024',
      endDate: '01/01/2024',
      resultDate: '01/01/2024',
      status: 'Active',
    },
    {
      id: 3,
      session: 'Mock session 3',
      examSession: 'Mock examSession 3',
      startDate: '01/01/2024',
      endDate: '01/01/2024',
      resultDate: '01/01/2024',
      status: 'Active',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      session: '',
      examSession: '',
      startDate: undefined,
      endDate: undefined,
      resultDate: undefined,
      status: '',
    });
  };

  const handleClear = () => {
    setForm({
      session: '',
      examSession: '',
      startDate: undefined,
      endDate: undefined,
      resultDate: undefined,
      status: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Examination Session"
      description="Manage Examination Session"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Examination Session' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Session"
            value={form.session}
            onChange={(v: any) => handleChange('session', v)}
            data={[
              { text: '2023-2024', value: '2023-2024' },
              { text: '2024-2025', value: '2024-2025' },
            ]}
            placeholder="Select Session"
          />
          <TextBox
            label="Exam Session"
            value={form.examSession}
            onChange={(v: any) => handleChange('examSession', v)}
            placeholder="Enter Exam Session"
          />
          <DatePicker
            label="Start Date"
            value={form.startDate}
            onChange={(v: any) => handleChange('startDate', v)}
            placeholder="Select Start Date"
          />
          <DatePicker
            label="End Date"
            value={form.endDate}
            onChange={(v: any) => handleChange('endDate', v)}
            placeholder="Select End Date"
          />
          <DatePicker
            label="Result Date"
            value={form.resultDate}
            onChange={(v: any) => handleChange('resultDate', v)}
            placeholder="Select Result Date"
          />
          <DropDownList
            label="Status"
            value={form.status}
            onChange={(v: any) => handleChange('status', v)}
            data={[
              { text: 'Active', value: 'active' },
              { text: 'Inactive', value: 'inactive' },
            ]}
            placeholder="Select Status"
          />
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
          <Column field="session" header="Session" />
          <Column field="examSession" header="Exam Session" />
          <Column field="startDate" header="Start Date" />
          <Column field="endDate" header="End Date" />
          <Column field="resultDate" header="Result Date" />
          <Column field="status" header="Status" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
