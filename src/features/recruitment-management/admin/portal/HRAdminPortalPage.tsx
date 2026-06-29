import { PortalSelector } from 'shared/new-components';

export default function HRAdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="HR / Admin Portal"
      moduleDescription="Manage the full recruitment lifecycle."
      backPath="/recruitment-management"
      backLabel="Recruitment Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Recruitment KPIs, status breakdown, and vacancy fill rates.',
          icon: 'dashboard',
          colorScheme: 'purple',
          path: '/recruitment-management/admin/dashboard',
        },
        {
          title: 'Merit List Upload',
          description:
            'Bulk import candidate merit list for a recruitment drive.',
          icon: 'upload',
          colorScheme: 'green',
          path: '/recruitment-management/admin/merit-list',
        },
        {
          title: 'Vacancy Upload',
          description: 'Upload and manage sanctioned posts and vacancies.',
          icon: 'work',
          colorScheme: 'blue',
          path: '/recruitment-management/admin/vacancies',
        },
        {
          title: 'Document Configuration',
          description:
            'Configure required documents per designation and subject.',
          icon: 'description',
          colorScheme: 'orange',
          path: '/recruitment-management/admin/document-config',
        },
        {
          title: 'Candidate Approvals',
          description:
            'Multi-select candidates and bulk approve or reject after Tier 1 verification.',
          icon: 'how_to_reg',
          colorScheme: 'purple',
          path: '/recruitment-management/admin/approvals',
        },
      ]}
    />
  );
}
