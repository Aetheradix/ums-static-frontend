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

export default function EvaluationPolicyMaster() {
  const [form, setForm] = useState({
    policyCode: '',
    policyName: '',
    applicableBatch: '',
    graceMarksAllowed: undefined,
    evaluationRules: '',
    status: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      policyCode: 'Mock policyCode 1',
      policyName: 'Mock policyName 1',
      applicableBatch: 'Mock applicableBatch 1',
      graceMarksAllowed: 10,
      evaluationRules: 'Mock evaluationRules 1',
      status: 'Active',
    },
    {
      id: 2,
      policyCode: 'Mock policyCode 2',
      policyName: 'Mock policyName 2',
      applicableBatch: 'Mock applicableBatch 2',
      graceMarksAllowed: 20,
      evaluationRules: 'Mock evaluationRules 2',
      status: 'Active',
    },
    {
      id: 3,
      policyCode: 'Mock policyCode 3',
      policyName: 'Mock policyName 3',
      applicableBatch: 'Mock applicableBatch 3',
      graceMarksAllowed: 30,
      evaluationRules: 'Mock evaluationRules 3',
      status: 'Active',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      policyCode: '',
      policyName: '',
      applicableBatch: '',
      graceMarksAllowed: undefined,
      evaluationRules: '',
      status: '',
    });
  };

  const handleClear = () => {
    setForm({
      policyCode: '',
      policyName: '',
      applicableBatch: '',
      graceMarksAllowed: undefined,
      evaluationRules: '',
      status: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Evaluation Policy Master"
      description="Manage Evaluation Policy Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Evaluation Policy Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Policy Code"
            value={form.policyCode}
            onChange={v => handleChange('policyCode', v)}
            placeholder="Enter Policy Code"
          />
          <TextBox
            label="Policy Name"
            value={form.policyName}
            onChange={v => handleChange('policyName', v)}
            placeholder="Enter Policy Name"
          />
          <DropDownList
            label="Applicable Batch"
            value={form.applicableBatch}
            onChange={v => handleChange('applicableBatch', v)}
            data={[
              { text: '2020', value: '2020' },
              { text: '2021', value: '2021' },
              { text: '2022', value: '2022' },
              { text: '2023', value: '2023' },
              { text: '2024', value: '2024' },
            ]}
            placeholder="Select Batch"
          />
          <NumberBox
            label="Grace Marks Allowed"
            value={form.graceMarksAllowed}
            onChange={v => handleChange('graceMarksAllowed', v)}
            placeholder="Enter Grace Marks"
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
              label="Evaluation Rules"
              value={form.evaluationRules}
              onChange={(v: any) => handleChange('evaluationRules', v)}
              placeholder="Enter Rules (e.g. Best of two internals)"
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
          <Column field="policyCode" header="Policy Code" />
          <Column field="policyName" header="Policy Name" />
          <Column field="applicableBatch" header="Applicable Batch" />
          <Column field="graceMarksAllowed" header="Grace Marks Allowed" />
          <Column field="evaluationRules" header="Evaluation Rules" />
          <Column field="status" header="Status" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
