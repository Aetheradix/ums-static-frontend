import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TextBox, DropDownList } from 'shared/components/forms';

export default function SubjectAllocation() {
  const [form, setForm] = useState({
    programme: '',
    semester: '',
    subject: '',
    faculty: '',
    section: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      programme: 'Mock programme 1',
      semester: 'Mock semester 1',
      subject: 'Mock subject 1',
      faculty: 'Mock faculty 1',
      section: 'Mock section 1',
    },
    {
      id: 2,
      programme: 'Mock programme 2',
      semester: 'Mock semester 2',
      subject: 'Mock subject 2',
      faculty: 'Mock faculty 2',
      section: 'Mock section 2',
    },
    {
      id: 3,
      programme: 'Mock programme 3',
      semester: 'Mock semester 3',
      subject: 'Mock subject 3',
      faculty: 'Mock faculty 3',
      section: 'Mock section 3',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      programme: '',
      semester: '',
      subject: '',
      faculty: '',
      section: '',
    });
  };

  const handleClear = () => {
    setForm({
      programme: '',
      semester: '',
      subject: '',
      faculty: '',
      section: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Subject Allocation"
      description="Manage Subject Allocation"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Subject Allocation' },
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
          <DropDownList
            label="Faculty"
            value={form.faculty}
            onChange={(v: any) => handleChange('faculty', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Faculty"
          />
          <TextBox
            label="Section"
            value={form.section}
            onChange={(v: any) => handleChange('section', v)}
            placeholder="Enter Section"
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
          <Column field="faculty" header="Faculty" />
          <Column field="section" header="Section" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
