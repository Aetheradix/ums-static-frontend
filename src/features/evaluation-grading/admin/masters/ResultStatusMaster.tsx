import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TextBox, DropDownList, TextArea } from 'shared/components/forms';

export default function ResultStatusMaster() {
  const [form, setForm] = useState({
    statusCode: '',
    statusName: '',
    status: '',
    description: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      statusCode: 'Active',
      statusName: 'Active',
      status: 'Active',
      description: 'Mock description 1',
    },
    {
      id: 2,
      statusCode: 'Active',
      statusName: 'Active',
      status: 'Active',
      description: 'Mock description 2',
    },
    {
      id: 3,
      statusCode: 'Active',
      statusName: 'Active',
      status: 'Active',
      description: 'Mock description 3',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      statusCode: '',
      statusName: '',
      status: '',
      description: '',
    });
  };

  const handleClear = () => {
    setForm({
      statusCode: '',
      statusName: '',
      status: '',
      description: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Result Status Master"
      description="Manage Result Status Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Result Status Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Status Code"
            value={form.statusCode}
            onChange={v => handleChange('statusCode', v)}
            placeholder="Enter Status Code"
          />
          <TextBox
            label="Status Name"
            value={form.statusName}
            onChange={v => handleChange('statusName', v)}
            placeholder="Enter Status Name (e.g. Promoted)"
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
          <Column field="statusCode" header="Status Code" />
          <Column field="statusName" header="Status Name" />
          <Column field="status" header="Status" />
          <Column field="description" header="Description" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
