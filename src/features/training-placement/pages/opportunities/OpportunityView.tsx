import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { tpUrls } from '../../urls';

export default function OpportunityView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isAdmin = location.pathname.includes('/admin/');
  const isCompany = location.pathname.includes('/company/');

  const mockJob = {
    id,
    title: 'Software Development Engineer',
    company: 'Infosys Technologies Ltd',
    type: 'Placement',
    season: 'PL2025-JUN',
    description:
      'Looking for a skilled developer to join our core engineering team in Bangalore.',
    designation: 'SDE-1',
    nature: 'Full time',
    processType: 'On-Campus',
    eligibility: 'Minimum 7.5 CGPA, No active backlogs',
    skills: 'React, Node.js, TypeScript',
    ctc: '12 LPA',
    location: 'Bangalore',
    status: 'Active',
  };

  const handleBack = () => {
    if (isAdmin) navigate(tpUrls.admin.opportunities);
    else if (isCompany) navigate(tpUrls.company.opportunities);
  };

  const handleEdit = () => {
    if (isAdmin) navigate(tpUrls.admin.opportunityEdit(id!));
    else if (isCompany) navigate(tpUrls.company.opportunityEdit(id!));
  };

  return (
    <FormPage
      title="View Opportunity"
      description={`Details for ${mockJob.title}`}
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        {
          label: isAdmin ? 'Admin Portal' : 'Company Portal',
          to: isAdmin ? tpUrls.admin.portal : tpUrls.company.portal,
        },
        {
          label: 'Opportunities',
          to: isAdmin
            ? tpUrls.admin.opportunities
            : tpUrls.company.opportunities,
        },
        { label: 'View' },
      ]}
      headerAction={
        <div className="flex gap-2">
          <button
            onClick={handleBack}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Back to List
          </button>
          <button
            onClick={handleEdit}
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
          >
            Edit Post
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <FormCard title="Basic Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Job Title</h4>
              <p className="mt-1 text-base text-gray-900">{mockJob.title}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Company</h4>
              <p className="mt-1 text-base text-gray-900">{mockJob.company}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Type</h4>
              <p className="mt-1 text-base text-gray-900">{mockJob.type}</p>
            </div>
            <div className="col-span-1 md:col-span-3">
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="mt-1 text-base text-gray-900 whitespace-pre-wrap">
                {mockJob.description}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Season</h4>
              <p className="mt-1 text-base text-gray-900">{mockJob.season}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Designation</h4>
              <p className="mt-1 text-base text-gray-900">
                {mockJob.designation}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Process Type
              </h4>
              <p className="mt-1 text-base text-gray-900">
                {mockJob.processType}
              </p>
            </div>
          </div>
        </FormCard>

        <FormCard title="Eligibility & Compensation">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Eligibility Criteria
              </h4>
              <p className="mt-1 text-base text-gray-900 whitespace-pre-wrap">
                {mockJob.eligibility}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Required Skills
              </h4>
              <p className="mt-1 text-base text-gray-900 whitespace-pre-wrap">
                {mockJob.skills}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Compensation (CTC/Stipend)
              </h4>
              <p className="mt-1 text-base text-gray-900">{mockJob.ctc}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Location</h4>
              <p className="mt-1 text-base text-gray-900">{mockJob.location}</p>
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
