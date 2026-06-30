import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  NumberBox,
} from 'shared/components/forms';

export default function MarksVerification() {
  const [form, setForm] = useState({
    student: '',
    subject: '',
    marks: undefined,
    verifiedBy: '',
    verifiedDate: undefined,
    status: '',
    remarks: undefined,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Marks Verification"
      description="Manage Marks Verification"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Marks Verification' },
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
            label="Marks"
            value={form.marks}
            onChange={(v: any) => handleChange('marks', v)}
            placeholder="Enter Marks"
          />
          <TextBox
            label="Verified By"
            value={form.verifiedBy}
            onChange={(v: any) => handleChange('verifiedBy', v)}
            placeholder="Enter Verified By"
          />
          <DatePicker
            label="Verified Date"
            value={form.verifiedDate}
            onChange={(v: any) => handleChange('verifiedDate', v)}
            placeholder="Select Verified Date"
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
          <NumberBox
            label="Remarks"
            value={form.remarks}
            onChange={(v: any) => handleChange('remarks', v)}
            placeholder="Enter Remarks"
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
