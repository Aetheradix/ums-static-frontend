import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DropDownList } from 'shared/components/forms';

export default function CreditCalculation() {
  const [form, setForm] = useState({
    programme: '',
    batch: '',
    semester: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      programme: 'Mock programme 1',
      batch: 'Mock batch 1',
      semester: 'Mock semester 1',
    },
    {
      id: 2,
      programme: 'Mock programme 2',
      batch: 'Mock batch 2',
      semester: 'Mock semester 2',
    },
    {
      id: 3,
      programme: 'Mock programme 3',
      batch: 'Mock batch 3',
      semester: 'Mock semester 3',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      programme: '',
      batch: '',
      semester: '',
    });
  };

  const handleClear = () => {
    setForm({
      programme: '',
      batch: '',
      semester: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Credit Calculation"
      description="Manage Credit Calculation"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Credit Calculation' },
      ]}
    >
      <FormCard title="Report Filters">
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
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
