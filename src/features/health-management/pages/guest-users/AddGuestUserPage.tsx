import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox, TextArea, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { hmsUrls } from '../../urls';
import { getHmsBreadcrumbs } from '../../utils';

const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const bloodOptions = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
];

export default function AddGuestUserPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    remarks: '',
  });

  const handleChange = (field: string) => (e: any) => {
    setForm(prev => ({
      ...prev,
      [field]: e?.value ?? e?.target?.value ?? e ?? '',
    }));
  };

  return (
    <FormPage
      title="Add Guest User"
      description="Register a new guest user for health services."
      breadcrumbs={getHmsBreadcrumbs('Guest Users', 'Add Guest')}
    >
      <FormCard title="Guest Details">
        <FormGrid>
          <TextBox
            label="Full Name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange('name')}
          />
          <TextBox
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={handleChange('email')}
          />
          <TextBox
            label="Mobile"
            placeholder="+91-XXXXXXXXXX"
            value={form.mobile}
            onChange={handleChange('mobile')}
          />
          <TextBox
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange('dateOfBirth')}
          />
          <DropDownList
            label="Gender"
            data={genderOptions}
            textField="label"
            optionValue="value"
            value={form.gender}
            onChange={handleChange('gender')}
          />
          <DropDownList
            label="Blood Group"
            data={bloodOptions}
            textField="label"
            optionValue="value"
            value={form.bloodGroup}
            onChange={handleChange('bloodGroup')}
          />
          <TextArea
            label="Remarks"
            rows={2}
            value={form.remarks}
            onChange={handleChange('remarks')}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate(hmsUrls.guestUsers)}
          />
          <Button
            label="Save Guest"
            icon="save"
            onClick={() => navigate(hmsUrls.guestUsers)}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
