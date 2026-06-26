import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { DropDownList } from 'shared/components/forms';

const certificateTypes = [
  { name: 'All Certificates', value: 'all' },
  { name: 'Bonafide Certificate', value: 'bonafide' },
  { name: 'Migration Certificate', value: 'migration' },
  { name: 'Character Certificate', value: 'character' },
  { name: 'Degree Certificate', value: 'degree' },
];

const colleges = [
  { name: 'All Colleges', value: 'all' },
  { name: 'Main Campus', value: 'main' },
  { name: 'City Campus', value: 'city' },
];

const statuses = [
  { name: 'All Pending Statuses', value: 'all' },
  { name: 'Pending Verification (College)', value: 'pending_college' },
  { name: 'Pending Approval (University)', value: 'pending_university' },
  { name: 'Returned to Student', value: 'returned_student' },
];

export default function PendingApplicationsReport() {
  const [filters, setFilters] = useState({
    type: 'all',
    college: 'all',
    status: 'all',
  });

  const columns = [
    { field: 'applicationNo', header: 'Application No' },
    { field: 'student', header: 'Student' },
    { field: 'certificate', header: 'Certificate' },
    { field: 'college', header: 'College' },
    { field: 'status', header: 'Status' },
  ];

  const data = [
    {
      id: 1,
      applicationNo: 'RGPV/MIG/2026/0100',
      student: 'Ravi Sharma (0802CS221002)',
      certificate: 'Migration Certificate',
      college: 'Main Campus',
      status: 'Pending Verification (College)',
    },
    {
      id: 2,
      applicationNo: 'RGPV/BON/2026/0105',
      student: 'Amit Kumar (0802CS221004)',
      certificate: 'Bonafide Certificate',
      college: 'City Campus',
      status: 'Pending Approval (University)',
    },
    {
      id: 3,
      applicationNo: 'RGPV/DEG/2026/0107',
      student: 'Vikram Patel (0802CS221005)',
      certificate: 'Degree Certificate',
      college: 'Main Campus',
      status: 'Returned to Student',
    },
  ];

  const CustomFilters = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DropDownList
        label="Status"
        data={statuses}
        textField="name"
        optionValue="value"
        value={filters.status}
        onChange={v => setFilters({ ...filters, status: String(v) })}
      />
      <DropDownList
        label="College"
        data={colleges}
        textField="name"
        optionValue="value"
        value={filters.college}
        onChange={v => setFilters({ ...filters, college: String(v) })}
      />
      <DropDownList
        label="Certificate Type"
        data={certificateTypes}
        textField="name"
        optionValue="value"
        value={filters.type}
        onChange={v => setFilters({ ...filters, type: String(v) })}
      />
    </div>
  );

  return (
    <FormPage
      title="Pending Applications Report"
      description="View applications that are currently pending action."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'Reports', to: '/home/sub-menu/reports' },
        { label: 'Pending Applications' },
      ]}
    >
      <FormCard title="Filters">{CustomFilters}</FormCard>

      <GridPanel columns={columns as any} data={data} />
    </FormPage>
  );
}
