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

export default function DivisionMaster() {
  const [form, setForm] = useState({
    divisionName: '',
    divisionCode: '',
    lowerPercentage: undefined,
    upperPercentage: undefined,
    status: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      divisionName: 'Mock divisionName 1',
      divisionCode: 'Mock divisionCode 1',
      lowerPercentage: 'Mock lowerPercentage 1',
      upperPercentage: 'Mock upperPercentage 1',
      status: 'Active',
    },
    {
      id: 2,
      divisionName: 'Mock divisionName 2',
      divisionCode: 'Mock divisionCode 2',
      lowerPercentage: 'Mock lowerPercentage 2',
      upperPercentage: 'Mock upperPercentage 2',
      status: 'Active',
    },
    {
      id: 3,
      divisionName: 'Mock divisionName 3',
      divisionCode: 'Mock divisionCode 3',
      lowerPercentage: 'Mock lowerPercentage 3',
      upperPercentage: 'Mock upperPercentage 3',
      status: 'Active',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      divisionName: '',
      divisionCode: '',
      lowerPercentage: undefined,
      upperPercentage: undefined,
      status: '',
    });
  };

  const handleClear = () => {
    setForm({
      divisionName: '',
      divisionCode: '',
      lowerPercentage: undefined,
      upperPercentage: undefined,
      status: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Division Master"
      description="Manage Division Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Division Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Division Code"
            value={form.divisionCode}
            onChange={v => handleChange('divisionCode', v)}
            placeholder="Enter Division Code"
          />
          <TextBox
            label="Division Name"
            value={form.divisionName}
            onChange={v => handleChange('divisionName', v)}
            placeholder="Enter Division Name"
          />
          <NumberBox
            label="Lower Percentage"
            value={form.lowerPercentage}
            onChange={v => handleChange('lowerPercentage', v)}
            placeholder="Lower Percentage"
          />
          <NumberBox
            label="Upper Percentage"
            value={form.upperPercentage}
            onChange={v => handleChange('upperPercentage', v)}
            placeholder="Upper Percentage"
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
          <Column field="divisionName" header="Division Name" />
          <Column field="divisionCode" header="Division Code" />
          <Column field="lowerPercentage" header="Lower Percentage" />
          <Column field="upperPercentage" header="Upper Percentage" />
          <Column field="status" header="Status" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
