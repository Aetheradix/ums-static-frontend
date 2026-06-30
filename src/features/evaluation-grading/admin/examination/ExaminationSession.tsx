import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList, DatePicker } from 'shared/components/forms';

export default function ExaminationSession() {
  const [form, setForm] = useState({
    session: '',
    examSession: '',
    startDate: undefined,
    endDate: undefined,
    resultDate: undefined,
    status: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Examination Session"
      description="Manage Examination Session"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Examination Session' },
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
          <TextBox
            label="Exam Session"
            value={form.examSession}
            onChange={(v: any) => handleChange('examSession', v)}
            placeholder="Enter Exam Session"
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
          <DatePicker
            label="Result Date"
            value={form.resultDate}
            onChange={(v: any) => handleChange('resultDate', v)}
            placeholder="Select Result Date"
          />
          <DropDownList
            label="Status"
            value={form.status}
            onChange={(v: any) => handleChange('status', v)}
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
