import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';

export default function Revaluation() {
  const [form, setForm] = useState({
    student: '',
    subject: '',
    reason: '',
    status: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Revaluation"
      description="Manage Revaluation"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Revaluation' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Student"
            value={form.student}
            onChange={(v: any) => handleChange('student', v)}
            data={[
              { text: 'John Doe', value: 'John Doe' },
              { text: 'Jane Smith', value: 'Jane Smith' },
            ]}
            placeholder="Select Student"
          />
          <DropDownList
            label="Subject"
            value={form.subject}
            onChange={(v: any) => handleChange('subject', v)}
            data={[
              { text: 'CS101', value: 'CS101' },
              { text: 'CS102', value: 'CS102' },
            ]}
            placeholder="Select Subject"
          />
          <TextBox
            label="Reason"
            value={form.reason}
            onChange={(v: any) => handleChange('reason', v)}
            placeholder="Enter Reason"
          />
          <DropDownList
            label="Status"
            value={form.status}
            onChange={(v: any) => handleChange('status', v)}
            data={[
              { text: 'Pending', value: 'Pending' },
              { text: 'Approved', value: 'Approved' },
              { text: 'Rejected', value: 'Rejected' },
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
