import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, Checkbox, NumberBox } from 'shared/components/forms';

export default function SubjectEvaluationMapping() {
  const [form, setForm] = useState({
    session: '',
    programme: '',
    semester: '',
    subject: '',
    assessmentType: '',
    maximumMarks: undefined,
    passingMarks: undefined,
    weightage: undefined,
    credit: undefined,
    mandatory: false,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Subject Evaluation Mapping"
      description="Manage Subject Evaluation Mapping"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Subject Evaluation Mapping' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Session"
            value={form.session}
            onChange={(v: any) => handleChange('session', v)}
            data={[
              { text: '2023-2024', value: '2023-2024' },
              { text: '2024-2025', value: '2024-2025' },
            ]}
            placeholder="Select Session"
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
          <DropDownList
            label="Assessment Type"
            value={form.assessmentType}
            onChange={(v: any) => handleChange('assessmentType', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Assessment Type"
          />
          <NumberBox
            label="Maximum Marks"
            value={form.maximumMarks}
            onChange={(v: any) => handleChange('maximumMarks', v)}
            placeholder="Enter Maximum Marks"
          />
          <NumberBox
            label="Passing Marks"
            value={form.passingMarks}
            onChange={(v: any) => handleChange('passingMarks', v)}
            placeholder="Enter Passing Marks"
          />
          <NumberBox
            label="Weightage"
            value={form.weightage}
            onChange={(v: any) => handleChange('weightage', v)}
            placeholder="Enter Weightage"
          />
          <NumberBox
            label="Credit"
            value={form.credit}
            onChange={(v: any) => handleChange('credit', v)}
            placeholder="Enter Credit"
          />
          <div className="flex items-center pt-6">
            <Checkbox
              label="Mandatory"
              checked={Boolean(form.mandatory)}
              onChange={(e: any) => handleChange('mandatory', e.target.checked)}
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
