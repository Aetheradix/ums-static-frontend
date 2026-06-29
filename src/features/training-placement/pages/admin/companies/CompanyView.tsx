import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { tpUrls } from '../../../urls';

export default function CompanyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isCompanyPortal = location.pathname.includes('/company/');

  // Mock profile data - in a real app, fetched based on id or company token
  const mockCompany = {
    id: id || 'COMP-001',
    name: 'Infosys Technologies Ltd',
    details:
      'Infosys is a global leader in next-generation digital services and consulting. Over 300,000 people work to amplify human potential and create the next opportunity for people, businesses, and communities. We enable clients in more than 56 countries to navigate their digital transformation.',
    headOffice: 'Electronic City, Hosur Road, Bangalore, Karnataka - 560100',
    website: 'https://infosys.com',
    hrName: 'Priya Sharma',
    hrContact: '+91-9876543210',
    hrEmail: 'priya.sharma@infosys.com',
  };

  const handleBack = () => {
    if (isCompanyPortal) {
      navigate(tpUrls.company.portal);
    } else {
      navigate(tpUrls.admin.companies);
    }
  };

  const handleEdit = () => {
    if (isCompanyPortal) {
      // In static mode, go to edit using local company id or mock id
      navigate(`${tpUrls.company.profile}/edit`);
    } else {
      navigate(tpUrls.admin.companyEdit(mockCompany.id));
    }
  };

  return (
    <FormPage
      title="Company Profile"
      description="Detailed overview of the recruiting organization."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        {
          label: isCompanyPortal ? 'Company Portal' : 'Admin Portal',
          to: isCompanyPortal ? tpUrls.company.portal : tpUrls.admin.portal,
        },
        ...(!isCompanyPortal
          ? [{ label: 'Companies', to: tpUrls.admin.companies }]
          : []),
        { label: mockCompany.name },
      ]}
      headerAction={
        <div className="flex gap-2">
          <button
            onClick={handleBack}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isCompanyPortal ? 'Back to Portal' : 'Back to Directory'}
          </button>
          <button
            onClick={handleEdit}
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit Profile
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <FormCard title="Company Information">
          <div className="grid grid-cols-1 gap-6 p-2 md:grid-cols-3">
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-sm font-medium text-gray-500">
                Company Name
              </h4>
              <p className="mt-1 text-base font-semibold text-gray-900">
                {mockCompany.name}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Website</h4>
              <p className="mt-1 text-base text-blue-600 hover:underline">
                <a href={mockCompany.website} target="_blank" rel="noreferrer">
                  {mockCompany.website}
                </a>
              </p>
            </div>

            <div className="col-span-1 md:col-span-3">
              <h4 className="text-sm font-medium text-gray-500">
                Head Office Address
              </h4>
              <p className="mt-1 text-base text-gray-900">
                {mockCompany.headOffice}
              </p>
            </div>

            <div className="col-span-1 md:col-span-3">
              <h4 className="text-sm font-medium text-gray-500">
                About Company
              </h4>
              <p className="mt-1 text-base text-gray-700 whitespace-pre-line">
                {mockCompany.details}
              </p>
            </div>
          </div>
        </FormCard>

        <FormCard title="Primary HR Contact">
          <div className="grid grid-cols-1 gap-6 p-2 md:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Contact Person
              </h4>
              <p className="mt-1 text-base text-gray-900">
                {mockCompany.hrName}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">HR Email</h4>
              <p className="mt-1 text-base text-gray-900">
                {mockCompany.hrEmail}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                HR Phone / Contact
              </h4>
              <p className="mt-1 text-base text-gray-900">
                {mockCompany.hrContact}
              </p>
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
