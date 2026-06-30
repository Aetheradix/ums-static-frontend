import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { tpUrls } from '../../urls';

export default function OpportunityApplicantsList() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.includes('/admin/');
  const isCompany = location.pathname.includes('/company/');

  const [search, setSearch] = useState('');

  // Mock job info
  const jobTitle = 'Software Development Engineer';
  const companyName = 'Infosys Technologies Ltd';

  // Mock applicants list for this specific job
  const mockApplicants = [
    {
      id: 'APP-101',
      studentName: 'John Doe',
      rollNo: '2021CS001',
      programme: 'B.Tech CSE',
      appliedDate: '2024-07-25',
      round: 'Technical Interview',
      status: 'Shortlisted',
    },
    {
      id: 'APP-104',
      studentName: 'Jane Watson',
      rollNo: '2021CS042',
      programme: 'B.Tech CSE',
      appliedDate: '2024-07-26',
      round: 'Aptitude Test',
      status: 'In Progress',
    },
  ];

  const filteredApplicants = mockApplicants.filter(
    app =>
      app.studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Offered':
      case 'Selected':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Shortlisted':
      case 'In Progress':
        return 'pending';
      default:
        return 'neutral';
    }
  };

  const handleBack = () => {
    if (isAdmin) navigate(tpUrls.admin.opportunities);
    else if (isCompany) navigate(tpUrls.company.opportunities);
  };

  const handleViewApplication = (row: any) => {
    if (isAdmin) {
      navigate(`${tpUrls.admin.applications}/view/${row.id}`);
    } else {
      // In company portal, we view application read-only
      alert(`Viewing application for ${row.studentName} (PDF/Resume view)`);
    }
  };

  return (
    <FormPage
      title="Applicants"
      description={`Applicants for ${jobTitle} at ${companyName}`}
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
        { label: 'Applicants' },
      ]}
      headerAction={
        <button
          onClick={handleBack}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          Back to List
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
              placeholder="Search by student or roll no..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <GridPanel
            data={filteredApplicants}
            dataKey="id"
            emptyMessage="No applicants found for this job post."
            pagination
            columns={
              [
                { field: 'studentName', header: 'Student Name' },
                { field: 'rollNo', header: 'Roll No.' },
                { field: 'programme', header: 'Programme' },
                { field: 'appliedDate', header: 'Applied On' },
                { field: 'round', header: 'Current Round' },
                {
                  field: 'status',
                  header: 'Status',
                  body: (row: any) => (
                    <StatusBadge
                      label={row.status}
                      variant={getStatusVariant(row.status)}
                    />
                  ),
                },
                {
                  field: 'actions',
                  header: 'Actions',
                  body: (row: any) => (
                    <button
                      onClick={() => handleViewApplication(row)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Application / Resume"
                    >
                      <i className="pi pi-eye mr-1" />
                      View Details
                    </button>
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
