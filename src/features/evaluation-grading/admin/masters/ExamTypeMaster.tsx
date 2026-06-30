import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TextBox, DropDownList, NumberBox } from 'shared/components/forms';

export default function ExamTypeMaster() {
  const [form, setForm] = useState({
    examCode: '',
    examName: '',
    category: '',
    weightage: undefined,
    status: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      examCode: 'Mock examCode 1',
      examName: 'Mock examName 1',
      category: 'Mock category 1',
      weightage: 'Mock weightage 1',
      status: 'Active',
    },
    {
      id: 2,
      examCode: 'Mock examCode 2',
      examName: 'Mock examName 2',
      category: 'Mock category 2',
      weightage: 'Mock weightage 2',
      status: 'Active',
    },
    {
      id: 3,
      examCode: 'Mock examCode 3',
      examName: 'Mock examName 3',
      category: 'Mock category 3',
      weightage: 'Mock weightage 3',
      status: 'Active',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      examCode: '',
      examName: '',
      category: '',
      weightage: undefined,
      status: '',
    });
  };

  const handleClear = () => {
    setForm({
      examCode: '',
      examName: '',
      category: '',
      weightage: undefined,
      status: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Exam Type Master"
      description="Manage Exam Type Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Exam Type Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Exam Code"
            value={form.examCode}
            onChange={v => handleChange('examCode', v)}
            placeholder="Enter Exam Code"
          />
          <TextBox
            label="Exam Name"
            value={form.examName}
            onChange={v => handleChange('examName', v)}
            placeholder="Enter Exam Name"
          />
          <DropDownList
            label="Category"
            value={form.category}
            onChange={v => handleChange('category', v)}
            data={[
              { text: 'Regular', value: 'regular' },
              { text: 'Supplementary', value: 'supplementary' },
              { text: 'Improvement', value: 'improvement' },
              { text: 'Back Paper', value: 'back_paper' },
            ]}
            placeholder="Select Category"
          />
          <NumberBox
            label="Weightage %"
            value={form.weightage}
            onChange={v => handleChange('weightage', v)}
            placeholder="Enter Weightage %"
          />
          <DropDownList
            label="Status"
            value={form.status}
            onChange={v => handleChange('status', v)}
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
          <Column field="examCode" header="Exam Code" />
          <Column field="examName" header="Exam Name" />
          <Column field="category" header="Category" />
          <Column field="weightage" header="Weightage" />
          <Column field="status" header="Status" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
