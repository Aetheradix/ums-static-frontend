import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DropDownList, DatePicker } from 'shared/components/forms';

export default function ExamCreation() {
  const [form, setForm] = useState({
    session: '',
    programme: '',
    semester: '',
    subject: '',
    examType: '',
    evaluationScheme: '',
    startDate: undefined,
    endDate: undefined,
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      session: 'Mock session 1',
      programme: 'Mock programme 1',
      semester: 'Mock semester 1',
      subject: 'Mock subject 1',
      examType: 'Mock examType 1',
      evaluationScheme: 'Mock evaluationScheme 1',
      startDate: '01/01/2024',
      endDate: '01/01/2024',
    },
    {
      id: 2,
      session: 'Mock session 2',
      programme: 'Mock programme 2',
      semester: 'Mock semester 2',
      subject: 'Mock subject 2',
      examType: 'Mock examType 2',
      evaluationScheme: 'Mock evaluationScheme 2',
      startDate: '01/01/2024',
      endDate: '01/01/2024',
    },
    {
      id: 3,
      session: 'Mock session 3',
      programme: 'Mock programme 3',
      semester: 'Mock semester 3',
      subject: 'Mock subject 3',
      examType: 'Mock examType 3',
      evaluationScheme: 'Mock evaluationScheme 3',
      startDate: '01/01/2024',
      endDate: '01/01/2024',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      session: '',
      programme: '',
      semester: '',
      subject: '',
      examType: '',
      evaluationScheme: '',
      startDate: undefined,
      endDate: undefined,
    });
  };

  const handleClear = () => {
    setForm({
      session: '',
      programme: '',
      semester: '',
      subject: '',
      examType: '',
      evaluationScheme: '',
      startDate: undefined,
      endDate: undefined,
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Exam Creation"
      description="Manage Exam Creation"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Exam Creation' },
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
            label="Exam Type"
            value={form.examType}
            onChange={(v: any) => handleChange('examType', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Exam Type"
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
          <Column field="programme" header="Programme" />
          <Column field="semester" header="Semester" />
          <Column field="subject" header="Subject" />
          <Column field="examType" header="Exam Type" />
          <Column field="evaluationScheme" header="Evaluation Scheme" />
          <Column field="startDate" header="Start Date" />
          <Column field="endDate" header="End Date" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
