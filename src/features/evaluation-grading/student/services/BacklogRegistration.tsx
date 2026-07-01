import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DropDownList } from 'shared/components/forms';

export default function BacklogRegistration() {
  const [form, setForm] = useState({
    student: '',
    subject: '',
    semester: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      student: 'Mock student 1',
      subject: 'Mock subject 1',
      semester: 'Mock semester 1',
    },
    {
      id: 2,
      student: 'Mock student 2',
      subject: 'Mock subject 2',
      semester: 'Mock semester 2',
    },
    {
      id: 3,
      student: 'Mock student 3',
      subject: 'Mock subject 3',
      semester: 'Mock semester 3',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      student: '',
      subject: '',
      semester: '',
    });
  };

  const handleClear = () => {
    setForm({
      student: '',
      subject: '',
      semester: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Backlog Registration"
      description="Manage Backlog Registration"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Backlog Registration' },
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
          <DropDownList
            label="Semester"
            value={form.semester}
            onChange={(v: any) => handleChange('semester', v)}
            data={[
              { text: '1', value: '1' },
              { text: '2', value: '2' },
              { text: '3', value: '3' },
              { text: '4', value: '4' },
            ]}
            placeholder="Select Semester"
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
          <Column field="semester" header="Semester" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
