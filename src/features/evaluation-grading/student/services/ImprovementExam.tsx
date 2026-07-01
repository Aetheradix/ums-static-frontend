import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DropDownList, NumberBox } from 'shared/components/forms';

export default function ImprovementExam() {
  const [form, setForm] = useState({
    student: '',
    subject: '',
    attempt: undefined,
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      student: 'Mock student 1',
      subject: 'Mock subject 1',
      attempt: 'Mock attempt 1',
    },
    {
      id: 2,
      student: 'Mock student 2',
      subject: 'Mock subject 2',
      attempt: 'Mock attempt 2',
    },
    {
      id: 3,
      student: 'Mock student 3',
      subject: 'Mock subject 3',
      attempt: 'Mock attempt 3',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      student: '',
      subject: '',
      attempt: undefined,
    });
  };

  const handleClear = () => {
    setForm({
      student: '',
      subject: '',
      attempt: undefined,
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Improvement Exam"
      description="Manage Improvement Exam"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Improvement Exam' },
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
          <DropDownList
            label="Subject"
            value={form.subject}
            onChange={(v: any) => handleChange('subject', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Subject"
          />
          <NumberBox
            label="Attempt"
            value={form.attempt}
            onChange={(v: any) => handleChange('attempt', v)}
            placeholder="Enter Attempt"
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
          <Column field="student" header="Student" />
          <Column field="subject" header="Subject" />
          <Column field="attempt" header="Attempt" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
