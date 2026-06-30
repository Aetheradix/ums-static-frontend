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

export default function MarksLock() {
  const [form, setForm] = useState({
    programme: '',
    semester: '',
    subject: '',
    lockDate: undefined,
    lockedBy: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      programme: 'Mock programme 1',
      semester: 'Mock semester 1',
      subject: 'Mock subject 1',
      lockDate: '01/01/2024',
      lockedBy: 'Mock lockedBy 1',
    },
    {
      id: 2,
      programme: 'Mock programme 2',
      semester: 'Mock semester 2',
      subject: 'Mock subject 2',
      lockDate: '01/01/2024',
      lockedBy: 'Mock lockedBy 2',
    },
    {
      id: 3,
      programme: 'Mock programme 3',
      semester: 'Mock semester 3',
      subject: 'Mock subject 3',
      lockDate: '01/01/2024',
      lockedBy: 'Mock lockedBy 3',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      programme: '',
      semester: '',
      subject: '',
      lockDate: undefined,
      lockedBy: '',
    });
  };

  const handleClear = () => {
    setForm({
      programme: '',
      semester: '',
      subject: '',
      lockDate: undefined,
      lockedBy: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Marks Lock"
      description="Manage Marks Lock"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Marks Lock' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Programme"
            value={form.programme}
            onChange={(v: any) => handleChange('programme', v)}
            data={[
              { text: 'B.Tech', value: 'B.Tech' },
              { text: 'MBA', value: 'MBA' },
              { text: 'M.Tech', value: 'M.Tech' },
            ]}
            placeholder="Select Programme"
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
          <DatePicker
            label="Lock Date"
            value={form.lockDate}
            onChange={(v: any) => handleChange('lockDate', v)}
            placeholder="Select Lock Date"
          />
          <TextBox
            label="Locked By"
            value={form.lockedBy}
            onChange={(v: any) => handleChange('lockedBy', v)}
            placeholder="Enter Locked By"
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
          <Column field="programme" header="Programme" />
          <Column field="semester" header="Semester" />
          <Column field="subject" header="Subject" />
          <Column field="lockDate" header="Lock Date" />
          <Column field="lockedBy" header="Locked By" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
