import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
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
      </FormCard>

      <FormCard>
        <div className="flex items-center gap-4 mt-8">
          <Button label="Save" variant="success" className="min-w-[120px]" />
          <Button
            label="Clear"
            variant="danger"
            className="min-w-[120px]"
            onClick={() => window.location.reload()}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
