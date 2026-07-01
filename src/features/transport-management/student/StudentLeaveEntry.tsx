import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormGrid,
  FormActions,
} from 'shared/new-components';

import { TextBox, DatePicker } from 'shared/components/forms';

export default function StudentLeaveEntry() {
  const [form, setForm] = useState({
    studentName: '',
    admissionNumber: '',
    leaveFrom: undefined,
    leaveTo: undefined,
    leaveReason: '',
    approvedBy: '',
    remarks: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Student Leave Entry"
      description="Manage student leaves to auto-cancel pickup."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Student Login',
          to: '/transport-management/student-login/dashboard',
        },
        { label: 'Student Leave Entry' },
      ]}
    >
      <FormCard title="Leave Entry Details">
        <FormGrid columns={4}>
          <TextBox
            label="Admission Number"
            value={form.admissionNumber}
            onChange={v => handleChange('admissionNumber', v)}
            placeholder="Search Admission No"
          />
          <TextBox
            label="Student Name"
            value={form.studentName}
            onChange={v => handleChange('studentName', v)}
            placeholder="Student Name"
            required
          />
          <DatePicker
            label="Leave From"
            value={form.leaveFrom}
            onChange={v => handleChange('leaveFrom', v)}
            placeholder="DD/MM/YYYY"
            required
          />
          <DatePicker
            label="Leave To"
            value={form.leaveTo}
            onChange={v => handleChange('leaveTo', v)}
            placeholder="DD/MM/YYYY"
            required
          />
          <TextBox
            label="Leave Reason"
            value={form.leaveReason}
            onChange={v => handleChange('leaveReason', v)}
            placeholder="Ex: Medical, Family trip"
          />
          <TextBox
            label="Approved By"
            value={form.approvedBy}
            onChange={v => handleChange('approvedBy', v)}
            placeholder="Approver Name"
          />
          <TextBox
            label="Remarks"
            value={form.remarks}
            onChange={v => handleChange('remarks', v)}
            placeholder="Any remarks"
          />
        </FormGrid>

        <FormActions align="left" onReset={() => window.location.reload()} />
      </FormCard>
    </FormPage>
  );
}
