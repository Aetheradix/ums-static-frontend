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

export default function EvaluatorMapping() {
  const [form, setForm] = useState({
    faculty: '',
    programme: '',
    semester: '',
    subject: '',
    assessmentType: '',
    effectiveFrom: undefined,
    effectiveTo: undefined,
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      faculty: 'Mock faculty 1',
      programme: 'Mock programme 1',
      semester: 'Mock semester 1',
      subject: 'Mock subject 1',
      assessmentType: 'Mock assessmentType 1',
      effectiveFrom: 'Mock effectiveFrom 1',
      effectiveTo: 'Mock effectiveTo 1',
    },
    {
      id: 2,
      faculty: 'Mock faculty 2',
      programme: 'Mock programme 2',
      semester: 'Mock semester 2',
      subject: 'Mock subject 2',
      assessmentType: 'Mock assessmentType 2',
      effectiveFrom: 'Mock effectiveFrom 2',
      effectiveTo: 'Mock effectiveTo 2',
    },
    {
      id: 3,
      faculty: 'Mock faculty 3',
      programme: 'Mock programme 3',
      semester: 'Mock semester 3',
      subject: 'Mock subject 3',
      assessmentType: 'Mock assessmentType 3',
      effectiveFrom: 'Mock effectiveFrom 3',
      effectiveTo: 'Mock effectiveTo 3',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      faculty: '',
      programme: '',
      semester: '',
      subject: '',
      assessmentType: '',
      effectiveFrom: undefined,
      effectiveTo: undefined,
    });
  };

  const handleClear = () => {
    setForm({
      faculty: '',
      programme: '',
      semester: '',
      subject: '',
      assessmentType: '',
      effectiveFrom: undefined,
      effectiveTo: undefined,
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Evaluator Mapping"
      description="Manage Evaluator Mapping"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Evaluator Mapping' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
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
          <DatePicker
            label="Effective From"
            value={form.effectiveFrom}
            onChange={(v: any) => handleChange('effectiveFrom', v)}
            placeholder="Select Effective From"
          />
          <DatePicker
            label="Effective To"
            value={form.effectiveTo}
            onChange={(v: any) => handleChange('effectiveTo', v)}
            placeholder="Select Effective To"
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
          <Column field="faculty" header="Faculty" />
          <Column field="programme" header="Programme" />
          <Column field="semester" header="Semester" />
          <Column field="subject" header="Subject" />
          <Column field="assessmentType" header="Assessment Type" />
          <Column field="effectiveFrom" header="Effective From" />
          <Column field="effectiveTo" header="Effective To" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
