import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { DropDownList, TextBox } from 'shared/components/forms';

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
  { name: 'All Statuses', value: 'all' },
  { name: 'Pending Verification', value: 'pending' },
  { name: 'Approved', value: 'approved' },
  { name: 'Issued', value: 'issued' },
  { name: 'Rejected', value: 'rejected' },
];

export default function CertificateReport() {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    type: 'all',
    college: 'all',
    status: 'all',
  });

  const columns = [
    { field: 'applicationNo', header: 'Application No' },
    { field: 'student', header: 'Student' },
    { field: 'certificate', header: 'Certificate' },
    { field: 'issueDate', header: 'Issue Date' },
    { field: 'status', header: 'Status' },
  ];

  const data = [
    {
      id: 1,
      applicationNo: 'RGPV/BON/2026/0099',
      student: 'Ahmed Khan (0802CS221001)',
      certificate: 'Bonafide Certificate',
      issueDate: '26-06-2026',
      status: 'Issued',
    },
    {
      id: 2,
      applicationNo: 'RGPV/MIG/2026/0100',
      student: 'Ravi Sharma (0802CS221002)',
      certificate: 'Migration Certificate',
      issueDate: '-',
      status: 'Pending Verification',
    },
    {
      id: 3,
      applicationNo: 'RGPV/DEG/2026/0101',
      student: 'Priya Singh (0802CS221003)',
      certificate: 'Degree Certificate',
      issueDate: '25-06-2026',
      status: 'Issued',
    },
  ];

  const CustomFilters = (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <TextBox
        label="From Date"
        type="date"
        value={filters.fromDate}
        onChange={v => setFilters({ ...filters, fromDate: v })}
      />
      <TextBox
        label="To Date"
        type="date"
        value={filters.toDate}
        onChange={v => setFilters({ ...filters, toDate: v })}
      />
      <DropDownList
        label="Certificate Type"
        data={certificateTypes}
        textField="name"
        optionValue="value"
        value={filters.type}
        onChange={v => setFilters({ ...filters, type: String(v) })}
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
        label="Status"
        data={statuses}
        textField="name"
        optionValue="value"
        value={filters.status}
        onChange={v => setFilters({ ...filters, status: String(v) })}
      />
    </div>
  );

  return (
    <FormPage
      title="Certificate Report"
      description="View and filter all certificate applications and issued certificates."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'Reports', to: '/home/sub-menu/reports' },
        { label: 'Certificate Report' },
      ]}
    >
      <FormCard title="Filters">{CustomFilters}</FormCard>

      <GridPanel columns={columns as any} data={data} />
    </FormPage>
  );
}
