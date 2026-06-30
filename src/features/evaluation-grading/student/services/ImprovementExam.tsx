import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, NumberBox } from 'shared/components/forms';

export default function ImprovementExam() {
  const [form, setForm] = useState({
    student: '',
    subject: '',
    attempt: undefined,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Improvement Exam"
      description="Manage Improvement Exam"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Improvement Exam' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Student"
            value={form.student}
            onChange={(v: any) => handleChange('student', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Student"
          />
          <DropDownList
            label="Subject"
            value={form.subject}
            onChange={(v: any) => handleChange('subject', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Subject"
          />
          <NumberBox
            label="Attempt"
            value={form.attempt}
            onChange={(v: any) => handleChange('attempt', v)}
            placeholder="Enter Attempt"
          />
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
