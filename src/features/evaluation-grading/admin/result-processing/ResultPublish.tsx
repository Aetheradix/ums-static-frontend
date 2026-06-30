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

export default function ResultPublish() {
  const [form, setForm] = useState({
    publishDate: undefined,
    programme: '',
    semester: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      publishDate: '01/01/2024',
      programme: 'Mock programme 1',
      semester: 'Mock semester 1',
    },
    {
      id: 2,
      publishDate: '01/01/2024',
      programme: 'Mock programme 2',
      semester: 'Mock semester 2',
    },
    {
      id: 3,
      publishDate: '01/01/2024',
      programme: 'Mock programme 3',
      semester: 'Mock semester 3',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      publishDate: undefined,
      programme: '',
      semester: '',
    });
  };

  const handleClear = () => {
    setForm({
      publishDate: undefined,
      programme: '',
      semester: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Result Publish"
      description="Manage Result Publish"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Result Publish' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <DatePicker
            label="Publish Date"
            value={form.publishDate}
            onChange={(v: any) => handleChange('publishDate', v)}
            placeholder="Select Publish Date"
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
          <Column field="publishDate" header="Publish Date" />
          <Column field="programme" header="Programme" />
          <Column field="semester" header="Semester" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
