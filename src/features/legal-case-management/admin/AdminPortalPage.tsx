import { PortalSelector } from 'shared/new-components';
import { legalUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Case Administrator — Legal Case Management"
      moduleDescription="Register and manage legal cases, schedule hearings, log advocate payments and generate compliance reports."
      backPath={legalUrls.portal}
      backLabel="Legal Case Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Caseload overview, upcoming hearings and status distribution charts.',
          icon: 'dashboard',
          colorScheme: 'red',
          path: legalUrls.admin.dashboard,
        },
        {
          title: 'Case Register',
          description:
            'Browse, register, edit and drill into all university legal cases.',
          icon: 'gavel',
          colorScheme: 'blue',
          path: legalUrls.admin.cases,
        },
        {
          title: 'Hearings',
          description:
            'Schedule and track hearing dates, attendance and adjournments.',
          icon: 'event',
          colorScheme: 'purple',
          path: legalUrls.admin.hearings,
        },
        {
          title: 'Advocate Payments',
          description:
            'Log and verify advocate fee payments against cases and hearings.',
          icon: 'payments',
          colorScheme: 'green',
          path: legalUrls.admin.payments,
        },
        {
          title: 'Reports',
          description:
            'Cases by status, court and type, pending hearings and payment summaries.',
          icon: 'assessment',
          colorScheme: 'amber',
          path: legalUrls.admin.reports,
        },
      ]}
    />
  );
}
