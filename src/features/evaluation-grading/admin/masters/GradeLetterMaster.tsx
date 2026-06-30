import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  NumberBox,
  TextArea,
} from 'shared/components/forms';

export default function GradeLetterMaster() {
  const [form, setForm] = useState({
    gradeLetter: '',
    gradePoint: undefined,
    status: '',
    description: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Grade Letter Master"
      description="Manage Grade Letter Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Grade Letter Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Grade Letter"
            value={form.gradeLetter}
            onChange={v => handleChange('gradeLetter', v)}
            placeholder="e.g., O, A+, A, B"
          />
          <NumberBox
            label="Grade Point"
            value={form.gradePoint}
            onChange={v => handleChange('gradePoint', v)}
            placeholder="Enter Grade Point"
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
