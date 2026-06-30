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

export default function ProgrammeGradeMapping() {
  const [form, setForm] = useState({
    programme: '',
    gradeGroup: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      programme: 'Mock programme 1',
      gradeGroup: 'Mock gradeGroup 1',
    },
    {
      id: 2,
      programme: 'Mock programme 2',
      gradeGroup: 'Mock gradeGroup 2',
    },
    {
      id: 3,
      programme: 'Mock programme 3',
      gradeGroup: 'Mock gradeGroup 3',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      programme: '',
      gradeGroup: '',
    });
  };

  const handleClear = () => {
    setForm({
      programme: '',
      gradeGroup: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Programme Grade Mapping"
      description="Manage Programme Grade Mapping"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Programme Grade Mapping' },
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
            label="Grade Group"
            value={form.gradeGroup}
            onChange={(v: any) => handleChange('gradeGroup', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Grade Group"
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
          <Column field="gradeGroup" header="Grade Group" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
