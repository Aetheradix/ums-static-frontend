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

export default function IssuedCertificateReport() {
  const [filters, setFilters] = useState({
    type: 'all',
    issueDate: '',
    certificateNumber: '',
  });

  const columns = [
    { field: 'applicationNo', header: 'Application No' },
    { field: 'certificateNo', header: 'Certificate No' },
    { field: 'student', header: 'Student' },
    { field: 'certificate', header: 'Certificate' },
    { field: 'issueDate', header: 'Issue Date' },
  ];

  const data = [
    {
      id: 1,
      applicationNo: 'RGPV/BON/2026/0099',
      certificateNo: 'CERT-2026-001',
      student: 'Ahmed Khan (0802CS221001)',
      certificate: 'Bonafide Certificate',
      issueDate: '26-06-2026',
    },
    {
      id: 3,
      applicationNo: 'RGPV/DEG/2026/0101',
      certificateNo: 'CERT-2026-002',
      student: 'Priya Singh (0802CS221003)',
      certificate: 'Degree Certificate',
      issueDate: '25-06-2026',
    },
  ];

  const CustomFilters = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DropDownList
        label="Certificate Type"
        data={certificateTypes}
        textField="name"
        optionValue="value"
        value={filters.type}
        onChange={v => setFilters({ ...filters, type: String(v) })}
      />
      <TextBox
        label="Issue Date"
        type="date"
        value={filters.issueDate}
        onChange={v => setFilters({ ...filters, issueDate: v })}
      />
      <TextBox
        label="Certificate Number"
        value={filters.certificateNumber}
        onChange={v => setFilters({ ...filters, certificateNumber: v })}
      />
    </div>
  );

  return (
    <FormPage
      title="Issued Certificate Report"
      description="View and search generated certificates by number or date."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'Reports', to: '/home/sub-menu/reports' },
        { label: 'Issued Certificates' },
      ]}
    >
      <FormCard title="Filters">{CustomFilters}</FormCard>

      <GridPanel columns={columns as any} data={data} />
    </FormPage>
  );
}
