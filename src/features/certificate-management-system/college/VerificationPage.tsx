import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox } from 'shared/components/forms';

export default function VerificationPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [remarks, setRemarks] = useState('');
  const [docsVerified, setDocsVerified] = useState(false);
  const [studentEligible, setStudentEligible] = useState(false);

  // Mock application data based on ID
  const isReturnedByUniversity = id === '3';
  const isReturnedToStudent = id === '5';

  const status = isReturnedByUniversity
    ? 'Returned by University'
    : isReturnedToStudent
      ? 'Returned to Student'
      : 'Pending Verification';

  const universityRemarks = isReturnedByUniversity
    ? 'The attached marksheet appears to be completely blurry. Please verify the physical document again and upload a clear scanned copy.'
    : '';

  const collegeRemarks = isReturnedToStudent
    ? 'The uploaded Govt ID Proof is not valid. Please upload a clear scanned copy of your Voter ID or PAN card.'
    : '';

  const handleAction = (action: string) => {
    alert(`Application ${action} Successfully!`);
  };

  return (
    <FormPage
      title="Application Verification"
      description="Verify student applications and uploaded documents before university approval."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'College Portal', to: '/home/sub-menu/college-portal' },
        {
          label: 'Applications List',
          to: '/certificate-management-system/college/verify',
        },
        { label: `Verify Application - ${id || '1'}` },
      ]}
    >
      <div className="flex gap-4 mb-4">
        <Button
          label="Back to List"
          variant="outlined"
          icon="arrow_back"
          onClick={() => navigate(-1)}
        />
      </div>
      {status === 'Returned by University' && (
        <div className="border p-5 mb-6 rounded-lg shadow-sm bg-red-50 border-red-300">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-red-800">
            <span className="material-symbols-outlined text-2xl">warning</span>
            Action Required: Returned by University
          </h3>
          <div className="p-3 rounded bg-white/60 border border-red-200 text-red-900">
            <p className="m-0 text-base font-semibold">{universityRemarks}</p>
          </div>
        </div>
      )}

      {status === 'Returned to Student' && (
        <div className="border p-5 mb-6 rounded-lg shadow-sm bg-orange-50 border-orange-300">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-orange-800">
            <span className="material-symbols-outlined text-2xl">history</span>
            Previously Returned to Student
          </h3>
          <p className="text-orange-900 mb-2">
            This application is currently pending correction from the student
            side. The following remarks were sent to the student:
          </p>
          <div className="p-3 rounded bg-white/60 border border-orange-200 text-orange-900">
            <p className="m-0 text-base font-semibold">{collegeRemarks}</p>
          </div>
        </div>
      )}

      <FormCard title="Student Details">
        <FormGrid columns={3}>
          <TextBox label="Enrollment No" value="0802CS221001" disabled />
          <TextBox label="Student Name" value="Ahmed Khan" disabled />
          <TextBox label="Course" value="B.Tech" disabled />
          <TextBox label="Branch" value="Computer Science" disabled />
          <TextBox label="Semester" value="Semester 6" disabled />
          <TextBox label="College" value="Main Campus" disabled />
        </FormGrid>
      </FormCard>

      <FormCard title="Certificate Details">
        <FormGrid columns={3}>
          <TextBox label="Application No" value="RGPV/BON/2026/0099" disabled />
          <TextBox
            label="Certificate Type"
            value="Bonafide Certificate"
            disabled
          />
          <TextBox label="Reason" value="Higher Study" disabled />
        </FormGrid>
      </FormCard>

      <FormCard title="Uploaded Documents">
        <ul className="list-disc pl-5 m-0 text-blue-600 mb-4">
          <li className="mb-2">
            <a href="#" className="hover:underline text-blue-600">
              Govt_ID_Proof.pdf
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:underline">
              Passport_Photo.jpg
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:underline">
              Semester5_Marksheet.pdf
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:underline">
              Fee_Receipt.pdf
            </a>
          </li>
        </ul>
      </FormCard>

      <FormCard title="Verification Actions">
        <div className="mb-6 flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={docsVerified}
              onChange={e => setDocsVerified(e.target.checked)}
            />
            <span className="font-medium text-gray-700">
              ✔ Documents Verified
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={studentEligible}
              onChange={e => setStudentEligible(e.target.checked)}
            />
            <span className="font-medium text-gray-700">
              ✔ Student Eligible
            </span>
          </label>
        </div>

        <FormGrid columns={1}>
          <TextBox
            label="Remarks (Mandatory for Rejection/Return)"
            value={remarks}
            onChange={v => setRemarks(v)}
          />
        </FormGrid>

        <div className="flex gap-4 mt-6 border-t pt-4 border-gray-200">
          <Button
            label="Return"
            variant="outlined"
            onClick={() => handleAction('Returned')}
            disabled={status === 'Returned to Student'}
          />
          <Button
            label="Reject"
            variant="danger"
            onClick={() => handleAction('Rejected')}
            disabled={status === 'Returned to Student'}
          />
          <div className="flex-1" />
          <Button
            label="Approve"
            variant="primary"
            icon="check"
            disabled={
              !docsVerified ||
              !studentEligible ||
              status === 'Returned to Student'
            }
            onClick={() => handleAction('Approved')}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
