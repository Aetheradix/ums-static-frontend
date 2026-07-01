import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { membershipTypes } from '../../data';
import { hmsUrls } from '../../urls';

const memberTypeOptions = [
  { label: 'Employee', value: 'Employee' },
  { label: 'Student', value: 'Student' },
  { label: 'Guest', value: 'Guest' },
];

export default function AddMembershipPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    memberType: 'Employee',
    memberName: '',
    memberId: '',
    program: '',
    academicYear: '',
    academicSession: '',
    healthCenter: '',
    membershipTypeId: '',
    membershipDate: '',
    validFrom: '',
  });

  const planOptions = membershipTypes.map(mt => ({
    label: `${mt.name} (₹${mt.feeAmount})`,
    value: mt.id,
  }));

  const handleChange = (field: string) => (e: any) => {
    setForm(prev => ({
      ...prev,
      [field]: e?.value ?? e?.target?.value ?? e ?? '',
    }));
  };

  return (
    <FormPage
      title="Add Membership"
      description="Register a new health membership for an employee, student, or guest."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Health Services', to: hmsUrls.portal },
        { label: 'Memberships', to: hmsUrls.memberships },
        { label: 'Add Membership' },
      ]}
    >
      <FormCard title="Membership Details">
        <FormGrid>
          <DropDownList
            label="Member Type"
            data={memberTypeOptions}
            textField="label"
            optionValue="value"
            value={form.memberType}
            onChange={handleChange('memberType')}
          />
          <TextBox
            label="Member Name"
            placeholder="Full name"
            value={form.memberName}
            onChange={handleChange('memberName')}
          />
          <TextBox
            label="Member ID"
            placeholder="Auto-generated or manual"
            value={form.memberId}
            onChange={handleChange('memberId')}
          />
          <TextBox
            label="Program"
            placeholder="e.g. B.Tech, M.Sc"
            value={form.program}
            onChange={handleChange('program')}
          />
          <TextBox
            label="Academic Year"
            placeholder="e.g. 2024-25"
            value={form.academicYear}
            onChange={handleChange('academicYear')}
          />
          <TextBox
            label="Academic Session"
            placeholder="e.g. Odd Semester"
            value={form.academicSession}
            onChange={handleChange('academicSession')}
          />
          <DropDownList
            label="Membership Plan"
            data={planOptions}
            textField="label"
            optionValue="value"
            value={form.membershipTypeId}
            onChange={handleChange('membershipTypeId')}
          />
          <TextBox
            label="Health Center"
            placeholder="e.g. Campus Health Center"
            value={form.healthCenter}
            onChange={handleChange('healthCenter')}
          />
          <TextBox
            label="Membership Date"
            type="date"
            value={form.membershipDate}
            onChange={handleChange('membershipDate')}
          />
          <TextBox
            label="Valid From"
            type="date"
            value={form.validFrom}
            onChange={handleChange('validFrom')}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate(hmsUrls.memberships)}
          />
          <Button
            label="Save Membership"
            icon="save"
            onClick={() => navigate(hmsUrls.memberships)}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
