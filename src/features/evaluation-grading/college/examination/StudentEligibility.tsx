import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  Checkbox,
  NumberBox,
} from 'shared/components/forms';

export default function StudentEligibility() {
  const [form, setForm] = useState({
    student: '',
    attendancePercentage: undefined,
    feeStatus: '',
    hallTicketStatus: '',
    eligible: false,
    debarred: false,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Student Eligibility"
      description="Manage Student Eligibility"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Student Eligibility' },
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
          <NumberBox
            label="Attendance Percentage"
            value={form.attendancePercentage}
            onChange={(v: any) => handleChange('attendancePercentage', v)}
            placeholder="Enter Attendance Percentage"
          />
          <TextBox
            label="Fee Status"
            value={form.feeStatus}
            onChange={(v: any) => handleChange('feeStatus', v)}
            placeholder="Enter Fee Status"
          />
          <TextBox
            label="Hall Ticket Status"
            value={form.hallTicketStatus}
            onChange={(v: any) => handleChange('hallTicketStatus', v)}
            placeholder="Enter Hall Ticket Status"
          />
          <div className="flex items-center pt-6">
            <Checkbox
              label="Eligible"
              checked={Boolean(form.eligible)}
              onChange={(e: any) => handleChange('eligible', e.target.checked)}
            />
          </div>
          <div className="flex items-center pt-6">
            <Checkbox
              label="Debarred"
              checked={Boolean(form.debarred)}
              onChange={(e: any) => handleChange('debarred', e.target.checked)}
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
