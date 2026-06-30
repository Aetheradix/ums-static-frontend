import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
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
