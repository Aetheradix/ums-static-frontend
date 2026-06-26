import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function EditApplication() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    type: 'degree',
    reason: 'higher_study',
    purpose: 'Applying for MS',
    remarks: '',
  });

  const returnedRemarks =
    'Your uploaded Semester 5 marksheet is completely blurry and unreadable. Please re-upload a clear scanned copy to proceed.';

  const handleSubmit = () => {
    alert('Application Re-Submitted Successfully!');
    navigate('/certificate-management-system/student/applications');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <FormPage
      title="Edit Returned Application"
      description="Correct the issues highlighted by the college and re-submit your application."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'Student Portal', to: '/home/sub-menu/student-portal' },
        {
          label: 'My Applications',
          to: '/certificate-management-system/student/applications',
        },
        { label: 'Edit' },
      ]}
    >
      <div className="border p-5 mb-6 rounded-lg shadow-sm bg-red-50 border-red-300">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-red-800">
          <span className="material-symbols-outlined text-2xl">warning</span>
          College Remarks (Action Required)
        </h3>
        <div className="p-3 rounded bg-white/60 border border-red-200 text-red-900">
          <p className="m-0 text-base font-semibold">{returnedRemarks}</p>
        </div>
      </div>

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
            label="Student Remarks (Optional)"
            value={form.remarks}
            onChange={v => setForm({ ...form, remarks: v })}
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Update Documents">
        <div className="text-sm text-gray-500 mb-4">
          Please re-upload the documents requested by the college (PDF/JPG, Max
          2MB).
        </div>
        <FormGrid columns={2}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Govt. ID Proof (Voter ID / PAN / Driving License) *
            </label>
            <input type="file" className="w-full border p-2 rounded" />
            <div className="text-xs text-blue-600 mt-1">
              Previously uploaded: Govt_ID_Proof.pdf
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passport Size Photo *
            </label>
            <input type="file" className="w-full border p-2 rounded" />
            <div className="text-xs text-blue-600 mt-1">
              Previously uploaded: Passport_Photo.jpg
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-red-600">
              Marksheet * (Needs Update)
            </label>
            <input
              type="file"
              className="w-full border p-2 rounded border-red-300 bg-red-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee Receipt *
            </label>
            <input type="file" className="w-full border p-2 rounded" />
            <div className="text-xs text-blue-600 mt-1">
              Previously uploaded: Fee_Receipt.pdf
            </div>
          </div>
        </FormGrid>
      </FormCard>

      <div className="flex justify-end gap-3 mt-4">
        <Button label="Cancel" variant="outlined" onClick={handleCancel} />
        <Button
          label="Re-Request Application"
          variant="primary"
          icon="send"
          onClick={handleSubmit}
        />
      </div>
    </FormPage>
  );
}
