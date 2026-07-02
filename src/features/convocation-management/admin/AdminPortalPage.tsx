import { PortalSelector } from 'shared/new-components';
import { CONVOCATION_URLS } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Convocation Admin Portal"
      moduleDescription="Manage convocation event setups, student eligibility, applications, and degree dispatch."
      backPath={CONVOCATION_URLS.PORTAL}
      backLabel="Back to Convocation Portal"
      portals={[
        {
          title: 'Dashboard',
          description: 'View convocation statistics and registration metrics.',
          icon: 'dashboard',
          colorScheme: 'indigo',
          path: CONVOCATION_URLS.ADMIN.DASHBOARD,
        },
        {
          title: 'Event Setup',
          description: 'Define event name, numbering prefix, and timeline.',
          icon: 'event',
          colorScheme: 'indigo',
          path: CONVOCATION_URLS.ADMIN.SETUP,
        },
        {
          title: 'Configuration',
          description: 'Manage advanced settings, fees, and pass designs.',
          icon: 'settings',
          colorScheme: 'indigo',
          path: CONVOCATION_URLS.ADMIN.CONFIG,
        },
        {
          title: 'Student Eligibility',
          description: 'Manage the eligible student list and statuses.',
          icon: 'fact_check',
          colorScheme: 'indigo',
          path: CONVOCATION_URLS.ADMIN.ELIGIBILITY,
        },
        {
          title: 'Application Review',
          description: 'Verify student registrations and uploaded documents.',
          icon: 'plagiarism',
          colorScheme: 'indigo',
          path: CONVOCATION_URLS.ADMIN.APPLICATIONS,
        },
        {
          title: 'Degree Dispatch',
          description: 'Track and manage the dispatch of degrees via post.',
          icon: 'local_shipping',
          colorScheme: 'indigo',
          path: CONVOCATION_URLS.ADMIN.DISPATCH,
        },
        {
          title: 'Exports & Reports',
          description: 'Generate reports and export ZIP data packages.',
          icon: 'summarize',
          colorScheme: 'indigo',
          path: CONVOCATION_URLS.ADMIN.REPORTS,
        },
      ]}
    />
  );
}
