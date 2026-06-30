import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, Checkbox } from 'shared/components/forms';

export default function StudentPromotion() {
  const [form, setForm] = useState({
    currentSemester: '',
    nextSemester: '',
    promote: false,
    hold: false,
    detain: false,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Student Promotion"
      description="Manage Student Promotion"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Student Promotion' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Current Semester"
            value={form.currentSemester}
            onChange={(v: any) => handleChange('currentSemester', v)}
            placeholder="Enter Current Semester"
          />
          <TextBox
            label="Next Semester"
            value={form.nextSemester}
            onChange={(v: any) => handleChange('nextSemester', v)}
            placeholder="Enter Next Semester"
          />
          <div className="flex items-center pt-6">
            <Checkbox
              label="Promote"
              checked={Boolean(form.promote)}
              onChange={(e: any) => handleChange('promote', e.target.checked)}
            />
          </div>
          <div className="flex items-center pt-6">
            <Checkbox
              label="Hold"
              checked={Boolean(form.hold)}
              onChange={(e: any) => handleChange('hold', e.target.checked)}
            />
          </div>
          <div className="flex items-center pt-6">
            <Checkbox
              label="Detain"
              checked={Boolean(form.detain)}
              onChange={(e: any) => handleChange('detain', e.target.checked)}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard>
        <div className="flex items-center gap-4 mt-8">
          <Button label="Save" variant="success" className="min-w-[150px]" />
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
