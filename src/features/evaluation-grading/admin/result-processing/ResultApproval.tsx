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

export default function ResultApproval() {
  const [form, setForm] = useState({
    programme: '',
    semester: '',
    resultStatus: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      programme: 'Mock programme 1',
      semester: 'Mock semester 1',
      resultStatus: 'Active',
    },
    {
      id: 2,
      programme: 'Mock programme 2',
      semester: 'Mock semester 2',
      resultStatus: 'Active',
    },
    {
      id: 3,
      programme: 'Mock programme 3',
      semester: 'Mock semester 3',
      resultStatus: 'Active',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      programme: '',
      semester: '',
      resultStatus: '',
    });
  };

  const handleClear = () => {
    setForm({
      programme: '',
      semester: '',
      resultStatus: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Result Approval"
      description="Manage Result Approval"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Result Approval' },
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
            label="Result Status"
            value={form.resultStatus}
            onChange={(v: any) => handleChange('resultStatus', v)}
            data={[
              { text: 'Active', value: 'active' },
              { text: 'Inactive', value: 'inactive' },
            ]}
            placeholder="Select Result Status"
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
          <Column field="semester" header="Semester" />
          <Column field="resultStatus" header="Result Status" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
