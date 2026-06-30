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

export default function ProgrammeEvaluationSchemeMapping() {
  const [form, setForm] = useState({
    academicSession: '',
    programme: '',
    batch: '',
    semester: '',
    subject: '',
    evaluationScheme: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      academicSession: 'Mock academicSession 1',
      programme: 'Mock programme 1',
      batch: 'Mock batch 1',
      semester: 'Mock semester 1',
      subject: 'Mock subject 1',
      evaluationScheme: 'Mock evaluationScheme 1',
    },
    {
      id: 2,
      academicSession: 'Mock academicSession 2',
      programme: 'Mock programme 2',
      batch: 'Mock batch 2',
      semester: 'Mock semester 2',
      subject: 'Mock subject 2',
      evaluationScheme: 'Mock evaluationScheme 2',
    },
    {
      id: 3,
      academicSession: 'Mock academicSession 3',
      programme: 'Mock programme 3',
      batch: 'Mock batch 3',
      semester: 'Mock semester 3',
      subject: 'Mock subject 3',
      evaluationScheme: 'Mock evaluationScheme 3',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      academicSession: '',
      programme: '',
      batch: '',
      semester: '',
      subject: '',
      evaluationScheme: '',
    });
  };

  const handleClear = () => {
    setForm({
      academicSession: '',
      programme: '',
      batch: '',
      semester: '',
      subject: '',
      evaluationScheme: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Programme Evaluation Scheme Mapping"
      description="Manage Programme Evaluation Scheme Mapping"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Programme Evaluation Scheme Mapping' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Academic Session"
            value={form.academicSession}
            onChange={(v: any) => handleChange('academicSession', v)}
            placeholder="Enter Academic Session"
          />
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
            label="Batch"
            value={form.batch}
            onChange={(v: any) => handleChange('batch', v)}
            data={[
              { text: '2021', value: '2021' },
              { text: '2022', value: '2022' },
              { text: '2023', value: '2023' },
            ]}
            placeholder="Select Batch"
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
            label="Evaluation Scheme"
            value={form.evaluationScheme}
            onChange={(v: any) => handleChange('evaluationScheme', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Evaluation Scheme"
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
          <Column field="academicSession" header="Academic Session" />
          <Column field="programme" header="Programme" />
          <Column field="batch" header="Batch" />
          <Column field="semester" header="Semester" />
          <Column field="subject" header="Subject" />
          <Column field="evaluationScheme" header="Evaluation Scheme" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
