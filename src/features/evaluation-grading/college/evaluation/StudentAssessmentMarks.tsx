import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DropDownList, TextBox } from 'shared/components/forms';

export default function StudentAssessmentMarks() {
  const [form, setForm] = useState({
    programme: '',
    batch: '',
    semester: '',
    subject: '',
    assessmentType: '',
    student: '',
    marks: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      programme: 'Mock programme 1',
      batch: 'Mock batch 1',
      semester: 'Mock semester 1',
      subject: 'Mock subject 1',
      assessmentType: 'Mock assessmentType 1',
      student: 'Mock student 1',
      marks: 10,
    },
    {
      id: 2,
      programme: 'Mock programme 2',
      batch: 'Mock batch 2',
      semester: 'Mock semester 2',
      subject: 'Mock subject 2',
      assessmentType: 'Mock assessmentType 2',
      student: 'Mock student 2',
      marks: 20,
    },
    {
      id: 3,
      programme: 'Mock programme 3',
      batch: 'Mock batch 3',
      semester: 'Mock semester 3',
      subject: 'Mock subject 3',
      assessmentType: 'Mock assessmentType 3',
      student: 'Mock student 3',
      marks: 30,
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      programme: '',
      batch: '',
      semester: '',
      subject: '',
      assessmentType: '',
      student: '',
      marks: '',
    });
  };

  const handleClear = () => {
    setForm({
      programme: '',
      batch: '',
      semester: '',
      subject: '',
      assessmentType: '',
      student: '',
      marks: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Student Assessment Marks"
      description="Enter marks for student assessments."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Student Assessment Marks' },
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
              { text: 'CS101', value: 'CS101' },
              { text: 'CS102', value: 'CS102' },
            ]}
            placeholder="Select Subject"
          />
          <DropDownList
            label="Assessment Type"
            value={form.assessmentType}
            onChange={(v: any) => handleChange('assessmentType', v)}
            data={[
              { text: 'Midterm', value: 'Midterm' },
              { text: 'Final', value: 'Final' },
            ]}
            placeholder="Select Assessment Type"
          />
          <DropDownList
            label="Student"
            value={form.student}
            onChange={(v: any) => handleChange('student', v)}
            data={[
              { text: 'John Doe', value: 'John Doe' },
              { text: 'Jane Smith', value: 'Jane Smith' },
            ]}
            placeholder="Select Student"
          />
          <TextBox
            label="Marks"
            value={form.marks}
            onChange={(v: any) => handleChange('marks', v)}
            placeholder="Enter Marks"
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
          <Column field="batch" header="Batch" />
          <Column field="semester" header="Semester" />
          <Column field="subject" header="Subject" />
          <Column field="assessmentType" header="Assessment Type" />
          <Column field="student" header="Student" />
          <Column field="marks" header="Marks" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
