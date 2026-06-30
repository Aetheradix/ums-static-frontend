import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';

export default function ProgrammeEvaluationSchemeMapping() {
  const [form, setForm] = useState({
    academicSession: '',
    programme: '',
    batch: '',
    semester: '',
    subject: '',
    evaluationScheme: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Programme Evaluation Scheme Mapping"
      description="Manage Programme Evaluation Scheme Mapping"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Programme Evaluation Scheme Mapping' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Academic Session"
            value={form.academicSession}
            onChange={(v: any) => handleChange('academicSession', v)}
            placeholder="Enter Academic Session"
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
            label="Batch"
            value={form.batch}
            onChange={(v: any) => handleChange('batch', v)}
            data={[
              { text: '2021', value: '2021' },
              { text: '2022', value: '2022' },
              { text: '2023', value: '2023' },
            ]}
            placeholder="Select Batch"
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
            label="Evaluation Scheme"
            value={form.evaluationScheme}
            onChange={(v: any) => handleChange('evaluationScheme', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Evaluation Scheme"
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
