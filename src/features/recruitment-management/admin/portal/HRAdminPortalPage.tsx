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
          title: 'Verification Center Upload',
          description:
            'Upload candidates and their assigned verification centers. Manually assign incharge details.',
          icon: 'location_on',
          colorScheme: 'teal',
          path: '/recruitment-management/admin/verification-center',
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
          title: 'Document Verification by HO',
          description:
            'Head Office review: filter by test, subject and center, then bulk approve or reject verified candidates.',
          icon: 'fact_check',
          colorScheme: 'green',
          path: '/recruitment-management/admin/ho-verification',
        },

        {
          title: 'Create Joining Order',
          description:
            'Generate joining orders for allocated candidates (DO/JD/DPI access).',
          icon: 'post_add',
          colorScheme: 'indigo',
          path: '/recruitment-management/admin/joining-order',
        },
        {
          title: 'Recruitment Reports',
          description: 'Track recruitment metrics and candidate status.',
          icon: 'assessment',
          colorScheme: 'purple',
          path: '/recruitment-management/admin/reports',
        },
      ]}
    />
  );
}
