import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, DatePicker } from 'shared/components/forms';

export default function ExamCreation() {
  const [form, setForm] = useState({
    session: '',
    programme: '',
    semester: '',
    subject: '',
    examType: '',
    evaluationScheme: '',
    startDate: undefined,
    endDate: undefined,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Exam Creation"
      description="Manage Exam Creation"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Exam Creation' },
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
            label="Exam Type"
            value={form.examType}
            onChange={(v: any) => handleChange('examType', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Exam Type"
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
          <DatePicker
            label="Start Date"
            value={form.startDate}
            onChange={(v: any) => handleChange('startDate', v)}
            placeholder="Select Start Date"
          />
          <DatePicker
            label="End Date"
            value={form.endDate}
            onChange={(v: any) => handleChange('endDate', v)}
            placeholder="Select End Date"
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
