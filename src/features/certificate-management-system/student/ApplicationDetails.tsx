import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { Stepper } from 'shared/new-components';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox } from 'shared/components/forms';

const mockApplications = [
  {
    id: 1,
    appNo: 'RGPV/2026/BON/000001',
    type: 'Bonafide Certificate',
    date: '25-06-2026',
    status: 'Approved',
    activeIndex: 4,
    remarks: 'Your certificate has been generated successfully.',
  },
  {
    id: 2,
    appNo: 'RGPV/2026/MIG/000002',
    type: 'Migration Certificate',
    date: '26-06-2026',
    status: 'Pending Verification',
    activeIndex: 2,
    remarks: 'Your application is currently under review by the college.',
  },
  {
    id: 3,
    appNo: 'RGPV/2026/DEG/000003',
    type: 'Degree Certificate',
    date: '27-06-2026',
    status: 'Returned for Correction',
    activeIndex: 2,
    remarks:
      'Your uploaded Semester 5 marksheet is completely blurry and unreadable. Please re-upload a clear scanned copy to proceed.',
  },
  {
    id: 4,
    appNo: 'RGPV/2026/CHA/000004',
    type: 'Character Certificate',
    date: '28-06-2026',
    status: 'Rejected',
    activeIndex: 2,
    remarks:
      'Application permanently rejected due to submission of fraudulent or forged documents. No further action can be taken.',
  },
];

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const application =
    mockApplications.find(a => a.id === Number(id)) || mockApplications[0];

  const stepsItems = [
    { label: 'Draft' },
    { label: 'Submitted' },
    { label: 'Verification' },
    { label: 'Payment Completed' },
    { label: 'Approved' },
    { label: 'Issued' },
  ];

  return (
    <FormPage
      title={`Application Details - ${id || '0099'}`}
      description="View the complete status and timeline of your application."
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
        { label: 'Details' },
      ]}
    >
      <div className="flex gap-4 mb-4">
        <Button
          label="Back"
          variant="outlined"
          icon="arrow_back"
          onClick={() => navigate(-1)}
        />
        {application.status === 'Approved' && (
          <Button
            label="Download Certificate"
            variant="primary"
            icon="download"
          />
        )}
        {application.status === 'Returned for Correction' && (
          <Button
            label="Edit Application"
            variant="primary"
            icon="edit"
            onClick={() =>
              navigate(
                `/certificate-management-system/student/applications/${application.id}/edit`
              )
            }
          />
        )}
      </div>

      {application.remarks && (
        <div
          className={`border p-5 mb-6 rounded-lg shadow-sm ${
            application.status === 'Rejected'
              ? 'bg-red-100 border-red-500'
              : application.status === 'Returned for Correction'
                ? 'bg-orange-50 border-orange-300'
                : application.status === 'Approved'
                  ? 'bg-green-50 border-green-300'
                  : 'bg-blue-50 border-blue-300'
          }`}
        >
          <h3
            className={`text-lg font-bold flex items-center gap-2 mb-2 ${
              application.status === 'Rejected'
                ? 'text-red-900'
                : application.status === 'Returned for Correction'
                  ? 'text-orange-800'
                  : application.status === 'Approved'
                    ? 'text-green-800'
                    : 'text-blue-800'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {application.status === 'Rejected'
                ? 'cancel'
                : application.status === 'Returned for Correction'
                  ? 'warning'
                  : application.status === 'Approved'
                    ? 'check_circle'
                    : 'info'}
            </span>
            {application.status === 'Rejected'
              ? 'Application Permanently Rejected'
              : application.status === 'Returned for Correction'
                ? 'Action Required: Application Returned by College'
                : application.status === 'Approved'
                  ? 'Application Approved'
                  : 'Status Update'}
          </h3>
          <div
            className={`p-3 rounded bg-white/60 border ${
              application.status === 'Rejected'
                ? 'border-red-300 text-red-900'
                : application.status === 'Returned for Correction'
                  ? 'border-orange-200 text-orange-900'
                  : application.status === 'Approved'
                    ? 'border-green-200 text-green-900'
                    : 'border-blue-200 text-blue-900'
            }`}
          >
            <p className="m-0 text-base font-semibold">{application.remarks}</p>
          </div>
        </div>
      )}

      <FormCard title="Timeline & Status">
        <div className="py-4">
          <Stepper steps={stepsItems} activeStep={application.activeIndex} />
          <div className="mt-6 text-center">
            <span className="text-gray-500 font-semibold mr-2">
              Current Status:
            </span>
            <span className="text-lg font-bold text-blue-700">
              {application.status}
            </span>
          </div>
        </div>
      </FormCard>

      <FormCard title="Student Details">
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
        <FormGrid columns={3}>
          <TextBox label="Application No" value={application.appNo} disabled />
          <TextBox label="Certificate Type" value={application.type} disabled />
          <TextBox label="Applied Date" value={application.date} disabled />
          <TextBox label="Reason" value="Higher Study" disabled />
          <TextBox label="Purpose" value="Applying for MS" disabled />
        </FormGrid>
      </FormCard>

      <FormCard title="Uploaded Documents">
        <ul className="list-disc pl-5 m-0 text-blue-600">
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
    </FormPage>
  );
}
