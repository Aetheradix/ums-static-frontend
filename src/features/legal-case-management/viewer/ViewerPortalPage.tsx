import { PortalSelector } from 'shared/new-components';
import { legalUrls } from '../urls';

export default function ViewerPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Case Viewer — Legal Case Management"
      moduleDescription="Read-only access to case dashboards, the case register and compliance reports."
      backPath={legalUrls.portal}
      backLabel="Legal Case Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'Caseload overview and status distribution.',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: legalUrls.viewer.dashboard,
        },
        {
          title: 'Case Register',
          description: 'Browse all university legal cases (read-only).',
          icon: 'gavel',
          colorScheme: 'blue',
          path: legalUrls.viewer.cases,
        },
        {
          title: 'Reports',
          description:
            'Cases by status, court and type with payment summaries.',
          icon: 'assessment',
          colorScheme: 'amber',
          path: legalUrls.viewer.reports,
        },
      ]}
    />
  );
}
