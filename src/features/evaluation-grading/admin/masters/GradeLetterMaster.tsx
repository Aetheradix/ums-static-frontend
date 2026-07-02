import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {
  TextBox,
  DropDownList,
  NumberBox,
  TextArea,
} from 'shared/components/forms';

export default function GradeLetterMaster() {
  const [form, setForm] = useState({
    gradeLetter: '',
    gradePoint: undefined,
    status: '',
    description: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      gradeLetter: 'Mock gradeLetter 1',
      gradePoint: 'Mock gradePoint 1',
      status: 'Active',
      description: 'Mock description 1',
    },
    {
      id: 2,
      gradeLetter: 'Mock gradeLetter 2',
      gradePoint: 'Mock gradePoint 2',
      status: 'Active',
      description: 'Mock description 2',
    },
    {
      id: 3,
      gradeLetter: 'Mock gradeLetter 3',
      gradePoint: 'Mock gradePoint 3',
      status: 'Active',
      description: 'Mock description 3',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      gradeLetter: '',
      gradePoint: undefined,
      status: '',
      description: '',
    });
  };

  const handleClear = () => {
    setForm({
      gradeLetter: '',
      gradePoint: undefined,
      status: '',
      description: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Grade Letter Master"
      description="Manage Grade Letter Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Grade Letter Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Grade Letter"
            value={form.gradeLetter}
            onChange={v => handleChange('gradeLetter', v)}
            placeholder="e.g., O, A+, A, B"
          />
          <NumberBox
            label="Grade Point"
            value={form.gradePoint}
            onChange={v => handleChange('gradePoint', v)}
            placeholder="Enter Grade Point"
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
          <div className="col-span-4 lg:col-span-3">
            <TextArea
              label="Description"
              value={form.description}
              onChange={(v: any) => handleChange('description', v)}
              placeholder="Enter Description"
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
          <Column field="gradeLetter" header="Grade Letter" />
          <Column field="gradePoint" header="Grade Point" />
          <Column field="status" header="Status" />
          <Column field="description" header="Description" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
