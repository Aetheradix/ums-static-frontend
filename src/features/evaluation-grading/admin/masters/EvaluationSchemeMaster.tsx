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
  MultiSelectList,
} from 'shared/components/forms';

export default function EvaluationSchemeMaster() {
  const [form, setForm] = useState({
    schemeCode: '',
    schemeName: '',
    maxMarks: undefined,
    minPassMarks: undefined,
    assessmentTypes: [],
    status: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      schemeCode: 'Mock schemeCode 1',
      schemeName: 'Mock schemeName 1',
      maxMarks: 10,
      minPassMarks: 10,
      assessmentTypes: 'Mock assessmentTypes 1',
      status: 'Active',
    },
    {
      id: 2,
      schemeCode: 'Mock schemeCode 2',
      schemeName: 'Mock schemeName 2',
      maxMarks: 20,
      minPassMarks: 20,
      assessmentTypes: 'Mock assessmentTypes 2',
      status: 'Active',
    },
    {
      id: 3,
      schemeCode: 'Mock schemeCode 3',
      schemeName: 'Mock schemeName 3',
      maxMarks: 30,
      minPassMarks: 30,
      assessmentTypes: 'Mock assessmentTypes 3',
      status: 'Active',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      schemeCode: '',
      schemeName: '',
      maxMarks: undefined,
      minPassMarks: undefined,
      assessmentTypes: [],
      status: '',
    });
  };

  const handleClear = () => {
    setForm({
      schemeCode: '',
      schemeName: '',
      maxMarks: undefined,
      minPassMarks: undefined,
      assessmentTypes: [],
      status: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Evaluation Scheme Master"
      description="Manage Evaluation Scheme Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Evaluation Scheme Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Scheme Code"
            value={form.schemeCode}
            onChange={v => handleChange('schemeCode', v)}
            placeholder="Enter Scheme Code"
          />
          <TextBox
            label="Scheme Name"
            value={form.schemeName}
            onChange={v => handleChange('schemeName', v)}
            placeholder="Enter Scheme Name"
          />
          <NumberBox
            label="Max Marks"
            value={form.maxMarks}
            onChange={v => handleChange('maxMarks', v)}
            placeholder="Enter Max Marks"
          />
          <NumberBox
            label="Min Pass Marks"
            value={form.minPassMarks}
            onChange={v => handleChange('minPassMarks', v)}
            placeholder="Enter Min Pass Marks"
          />
          <div className="col-span-4 lg:col-span-2">
            <MultiSelectList
              label="Assessment Types"
              value={form.assessmentTypes}
              onChange={(v: any) => handleChange('assessmentTypes', v)}
              data={[
                { text: 'Theory', value: 'theory' },
                { text: 'Practical', value: 'practical' },
                { text: 'Viva', value: 'viva' },
                { text: 'Project', value: 'project' },
                { text: 'Seminar', value: 'seminar' },
              ]}
              placeholder="Select Assessment Types"
            />
          </div>
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
          <Column field="schemeCode" header="Scheme Code" />
          <Column field="schemeName" header="Scheme Name" />
          <Column field="maxMarks" header="Max Marks" />
          <Column field="minPassMarks" header="Min Pass Marks" />
          <Column field="assessmentTypes" header="Assessment Types" />
          <Column field="status" header="Status" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
