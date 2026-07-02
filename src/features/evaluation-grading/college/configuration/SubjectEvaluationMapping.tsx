import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DropDownList, Checkbox, NumberBox } from 'shared/components/forms';

export default function SubjectEvaluationMapping() {
  const [form, setForm] = useState({
    session: '',
    programme: '',
    semester: '',
    subject: '',
    assessmentType: '',
    maximumMarks: undefined,
    passingMarks: undefined,
    weightage: undefined,
    credit: undefined,
    mandatory: false,
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      session: 'Mock session 1',
      programme: 'Mock programme 1',
      semester: 'Mock semester 1',
      subject: 'Mock subject 1',
      assessmentType: 'Mock assessmentType 1',
      maximumMarks: 10,
      passingMarks: 10,
      weightage: 'Mock weightage 1',
      credit: 10,
      mandatory: true,
    },
    {
      id: 2,
      session: 'Mock session 2',
      programme: 'Mock programme 2',
      semester: 'Mock semester 2',
      subject: 'Mock subject 2',
      assessmentType: 'Mock assessmentType 2',
      maximumMarks: 20,
      passingMarks: 20,
      weightage: 'Mock weightage 2',
      credit: 20,
      mandatory: true,
    },
    {
      id: 3,
      session: 'Mock session 3',
      programme: 'Mock programme 3',
      semester: 'Mock semester 3',
      subject: 'Mock subject 3',
      assessmentType: 'Mock assessmentType 3',
      maximumMarks: 30,
      passingMarks: 30,
      weightage: 'Mock weightage 3',
      credit: 30,
      mandatory: true,
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
      assessmentType: '',
      maximumMarks: undefined,
      passingMarks: undefined,
      weightage: undefined,
      credit: undefined,
      mandatory: false,
    });
  };

  const handleClear = () => {
    setForm({
      session: '',
      programme: '',
      semester: '',
      subject: '',
      assessmentType: '',
      maximumMarks: undefined,
      passingMarks: undefined,
      weightage: undefined,
      credit: undefined,
      mandatory: false,
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Subject Evaluation Mapping"
      description="Manage Subject Evaluation Mapping"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Subject Evaluation Mapping' },
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
            label="Assessment Type"
            value={form.assessmentType}
            onChange={(v: any) => handleChange('assessmentType', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Assessment Type"
          />
          <NumberBox
            label="Maximum Marks"
            value={form.maximumMarks}
            onChange={(v: any) => handleChange('maximumMarks', v)}
            placeholder="Enter Maximum Marks"
          />
          <NumberBox
            label="Passing Marks"
            value={form.passingMarks}
            onChange={(v: any) => handleChange('passingMarks', v)}
            placeholder="Enter Passing Marks"
          />
          <NumberBox
            label="Weightage"
            value={form.weightage}
            onChange={(v: any) => handleChange('weightage', v)}
            placeholder="Enter Weightage"
          />
          <NumberBox
            label="Credit"
            value={form.credit}
            onChange={(v: any) => handleChange('credit', v)}
            placeholder="Enter Credit"
          />
          <div className="flex items-center pt-6">
            <Checkbox
              label="Mandatory"
              checked={Boolean(form.mandatory)}
              onChange={(e: any) => handleChange('mandatory', e.target.checked)}
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
          <Column field="session" header="Session" />
          <Column field="programme" header="Programme" />
          <Column field="semester" header="Semester" />
          <Column field="subject" header="Subject" />
          <Column field="assessmentType" header="Assessment Type" />
          <Column field="maximumMarks" header="Maximum Marks" />
          <Column field="passingMarks" header="Passing Marks" />
          <Column field="weightage" header="Weightage" />
          <Column field="credit" header="Credit" />
          <Column field="mandatory" header="Mandatory" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
