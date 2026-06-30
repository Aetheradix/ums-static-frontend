import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { tpUrls } from '../../urls';

export default function OpportunityList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');

  // Determine role based on URL path
  const isAdmin = location.pathname.includes('/admin/');
  const isCompany = location.pathname.includes('/company/');

  const mockOpportunities = [
    {
      id: 'JOB-101',
      title: 'Software Development Engineer',
      company: 'Infosys Technologies Ltd',
      type: 'Placement',
      season: 'PL2025-JUN',
      vacancies: 50,
      applicationsCount: 120,
      openingDate: '2024-08-01',
      closingDate: '2024-08-15',
      status: 'Active',
    },
    {
      id: 'JOB-102',
      title: 'Summer Intern - Analytics',
      company: 'Tech Mahindra',
      type: 'Internship',
      season: 'PL2025-JUN',
      vacancies: 10,
      applicationsCount: 45,
      openingDate: '2024-07-20',
      closingDate: '2024-07-30',
      status: 'Closed',
    },
    {
      id: 'JOB-103',
      title: 'Frontend Developer',
      company: 'Infosys Technologies Ltd',
      type: 'Placement',
      season: 'PL2025-JUN',
      vacancies: 5,
      applicationsCount: 0,
      openingDate: '2024-08-10',
      closingDate: '2024-08-20',
      status: 'Draft',
    },
  ];

  // Filter based on role (Mock behavior: Company only sees their own jobs)
  const roleData = isCompany
    ? mockOpportunities.filter(j => j.company === 'Infosys Technologies Ltd')
    : mockOpportunities;

  const filteredData = roleData.filter(
    job =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'approved';
      case 'Closed':
        return 'rejected';
      case 'Draft':
        return 'pending';
      default:
        return 'neutral';
    }
  };

  const handleAdd = () => {
    if (isAdmin) navigate(tpUrls.admin.opportunityAdd);
    else if (isCompany) navigate(tpUrls.company.opportunityAdd);
  };

  const handleEdit = (row: any) => {
    if (isAdmin) navigate(tpUrls.admin.opportunityEdit(row.id));
    else if (isCompany) navigate(tpUrls.company.opportunityEdit(row.id));
  };

  const handleView = (row: any) => {
    if (isAdmin) navigate(tpUrls.admin.opportunityView(row.id));
    else if (isCompany) navigate(tpUrls.company.opportunityView(row.id));
  };

  const handleViewApplicants = (row: any) => {
    if (isAdmin) navigate(`${tpUrls.admin.opportunities}/${row.id}/applicants`);
    else if (isCompany)
      navigate(`${tpUrls.company.opportunities}/${row.id}/applicants`);
  };

  return (
    <FormPage
      title={isAdmin ? 'All Opportunities' : 'My Opportunities'}
      description="Manage job and internship postings."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        {
          label: isAdmin ? 'Admin Portal' : 'Company Portal',
          to: isAdmin ? tpUrls.admin.portal : tpUrls.company.portal,
        },
        { label: 'Opportunities' },
      ]}
      headerAction={
        <button
          onClick={handleAdd}
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
        >
          <i className="pi pi-plus mr-2" />
          Add Opportunity
        </button>
      }
    >
      <FormCard>
        <div className="p-4">
          <div className="mb-4 flex w-full sm:w-64 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="pi pi-search" />
            </span>
            <input
              type="text"
              placeholder="Search by title or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <GridPanel
            data={filteredData}
            dataKey="id"
            emptyMessage="No opportunities found."
            pagination
            onEdit={handleEdit}
            columns={
              [
                { field: 'title', header: 'Job Title' },
                ...(isAdmin ? [{ field: 'company', header: 'Company' }] : []),
                { field: 'type', header: 'Type' },
                { field: 'vacancies', header: 'Vacancies' },
                { field: 'applicationsCount', header: 'Applicants' },
                { field: 'closingDate', header: 'Closing Date' },
                {
                  field: 'status',
                  header: 'Status',
                  body: (row: any) => (
                    <StatusBadge
                      label={row.status}
                      variant={getStatusColor(row.status)}
                    />
                  ),
                },
                {
                  field: 'actions',
                  header: 'More Actions',
                  body: (row: any) => (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleView(row)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <i className="pi pi-eye" />
                      </button>
                      {row.status === 'Draft' && isCompany && (
                        <button
                          className="text-green-600 hover:text-green-800"
                          title="Publish"
                        >
                          <i className="pi pi-send" />
                        </button>
                      )}
                      <button
                        onClick={() => handleViewApplicants(row)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="View Applicants"
                      >
                        <i className="pi pi-users" />
                      </button>
                    </div>
                  ),
                },
              ] as never[]
            }
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
