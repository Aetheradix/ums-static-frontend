import { useState } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { tpUrls } from '../../urls';
import { Button } from 'primereact/button';

export default function DeptStudentApplications() {
  const [search, setSearch] = useState('');

  const mockDeptApplications = [
    {
      id: 'APP-201',
      studentName: 'Charlie Brown',
      rollNo: '2021ME012',
      jobTitle: 'Mechanical Design Engineer',
      company: 'L&T',
      appliedDate: '2024-07-28',
      round: 'Technical Interview',
      status: 'Shortlisted',
    },
    {
      id: 'APP-202',
      studentName: 'Diana Prince',
      rollNo: '2021ME034',
      jobTitle: 'Graduate Engineer Trainee',
      company: 'Tata Motors',
      appliedDate: '2024-07-15',
      round: 'Aptitude Test',
      status: 'In Progress',
    },
    {
      id: 'APP-203',
      studentName: 'Evan Wright',
      rollNo: '2021ME056',
      jobTitle: 'Operations Analyst',
      company: 'Amazon',
      appliedDate: '2024-06-20',
      round: 'Final HR',
      status: 'Offered',
    },
  ];

  const filteredData = mockDeptApplications.filter(
    app =>
      app.studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      app.company.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Offered':
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

  const handleView = () => {
    alert('View student application details');
  };

  return (
    <FormPage
      title="Department Student Applications"
      description="Track the applications and hiring status of students from your department."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Department Portal', to: tpUrls.dept.portal },
        { label: 'Applications' },
      ]}
      headerAction={
        <Button
          label="Export to Excel"
          icon="pi pi-file-excel"
          severity="success"
          onClick={() => alert('Exporting data...')}
        />
      }
    >
      <FormCard>
        <div className="p-4">
          <div className="mb-4 flex w-full sm:w-80 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="pi pi-search" />
            </span>
            <input
              type="text"
              placeholder="Search by student, roll no, or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <GridPanel
            data={filteredData}
            dataKey="id"
            emptyMessage="No student applications found for this department."
            pagination
            columns={
              [
                { field: 'studentName', header: 'Student Name' },
                { field: 'rollNo', header: 'Roll No.' },
                { field: 'company', header: 'Company' },
                { field: 'jobTitle', header: 'Job Title' },
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
