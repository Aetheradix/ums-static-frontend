import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';

const certificateTypes = [
  { name: 'Bonafide Certificate', value: 'bonafide' },
  { name: 'Migration Certificate', value: 'migration' },
  { name: 'Character Certificate', value: 'character' },
  { name: 'Degree Certificate', value: 'degree' },
];

const reasons = [
  { name: 'Higher Study', value: 'higher_study' },
  { name: 'Passport', value: 'passport' },
  { name: 'Visa', value: 'visa' },
  { name: 'Job', value: 'job' },
  { name: 'Scholarship', value: 'scholarship' },
];

export default function ApplyCertificate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: '',
    reason: '',
    purpose: '',
    remarks: '',
  });

  const handleSubmit = () => {
    alert('Application Submitted Successfully!');
    navigate('/certificate-management-system/student/applications');
  };

  const handleDraft = () => {
    alert('Draft Saved Successfully!');
  };

  return (
    <FormPage
      title="Apply for Certificate"
      description="Fill out the application form below to request a new certificate."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'Student Portal', to: '/home/sub-menu/student-portal' },
        { label: 'Apply Certificate' },
      ]}
    >
      <FormCard title="Student Details (Auto Fill)">
        <FormGrid columns={3}>
          <TextBox label="Enrollment No" value="0802CS221001" disabled />
          <TextBox label="Student Name" value="Ahmed Khan" disabled />
          <TextBox label="Father's Name" value="Mr. R Khan" disabled />
          <TextBox label="Course" value="B.Tech" disabled />
          <TextBox label="Branch" value="Computer Science" disabled />
          <TextBox label="Semester" value="Semester 6" disabled />
          <TextBox label="College" value="Main Campus" disabled />
          <TextBox label="Mobile" value="+91-9876543210" disabled />
          <TextBox label="Email" value="ahmed@example.com" disabled />
        </FormGrid>
      </FormCard>

      <FormCard title="Application Details">
        <FormGrid columns={2}>
          <DropDownList
            label="Certificate Type"
            data={certificateTypes}
            textField="name"
            optionValue="value"
            value={form.type}
            onChange={v => setForm({ ...form, type: String(v) })}
            required
          />
          <DropDownList
            label="Reason"
            data={reasons}
            textField="name"
            optionValue="value"
            value={form.reason}
            onChange={v => setForm({ ...form, reason: String(v) })}
            required
          />
          <TextBox
            label="Purpose"
            value={form.purpose}
            onChange={v => setForm({ ...form, purpose: v })}
          />
          <TextBox
            label="Remarks"
            value={form.remarks}
            onChange={v => setForm({ ...form, remarks: v })}
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Upload Documents">
        <div className="text-sm text-gray-500 mb-4">
          Please upload scanned copies of the required documents (PDF/JPG, Max
          2MB).
        </div>
        <FormGrid columns={2}>
          {/* Using basic file inputs as placeholders since FileUpload component isn't explicitly imported from shared in typical UMS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Govt. ID Proof (Voter ID / PAN / Driving License) *
            </label>
            <input type="file" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passport Size Photo *
            </label>
            <input type="file" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marksheet *
            </label>
            <input type="file" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee Receipt *
            </label>
            <input type="file" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Other Document (Optional)
            </label>
            <input type="file" className="w-full border p-2 rounded" />
          </div>
        </FormGrid>
      </FormCard>

      <div className="flex justify-end gap-3 mt-4">
        <Button label="Save Draft" variant="outlined" onClick={handleDraft} />
        <Button
          label="Submit Application"
          variant="primary"
          onClick={handleSubmit}
        />
      </div>
    </FormPage>
  );
}
