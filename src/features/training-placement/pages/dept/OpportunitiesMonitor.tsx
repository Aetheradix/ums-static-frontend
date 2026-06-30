import { useState } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { tpUrls } from '../../urls';
import { Button } from 'primereact/button';

export default function OpportunitiesMonitor() {
  const [search, setSearch] = useState('');

  const mockOpportunities = [
    {
      id: 'OPP-001',
      companyName: 'Infosys Technologies Ltd',
      jobTitle: 'Software Development Engineer',
      type: 'Placement',
      vacancies: 50,
      closingDate: '2024-08-30',
      status: 'Active',
      deptApplicants: 120,
    },
    {
      id: 'OPP-002',
      companyName: 'TCS',
      jobTitle: 'Data Analyst Internship',
      type: 'Internship',
      vacancies: 20,
      closingDate: '2024-09-15',
      status: 'Active',
      deptApplicants: 45,
    },
    {
      id: 'OPP-003',
      companyName: 'Wipro',
      jobTitle: 'Frontend Developer',
      type: 'Placement',
      vacancies: 10,
      closingDate: '2024-07-20',
      status: 'Closed',
      deptApplicants: 80,
    },
  ];

  const filteredData = mockOpportunities.filter(
    opp =>
      opp.companyName.toLowerCase().includes(search.toLowerCase()) ||
      opp.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'approved';
      case 'Closed':
        return 'rejected';
      default:
        return 'neutral';
    }
  };

  const handleView = () => {
    alert('View opportunity details');
  };

  return (
    <FormPage
      title="Opportunities Monitor"
      description="Monitor active and past opportunities relevant to your department."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Department Portal', to: tpUrls.dept.portal },
        { label: 'Opportunities' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <div className="mb-4 flex w-full sm:w-80 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="pi pi-search" />
            </span>
            <input
              type="text"
              placeholder="Search by company or job title..."
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
            columns={
              [
                { field: 'companyName', header: 'Company' },
                { field: 'jobTitle', header: 'Job Title' },
                { field: 'type', header: 'Type' },
                { field: 'vacancies', header: 'Vacancies' },
                { field: 'deptApplicants', header: 'Dept Applicants' },
                { field: 'closingDate', header: 'Closing Date' },
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
                  body: () => (
                    <Button
                      icon="pi pi-eye"
                      className="p-button-rounded p-button-text p-button-info p-1"
                      tooltip="View Details"
                      onClick={handleView}
                    />
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
