import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function RegistrarPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Registrar Login — Final Authority Desk"
      moduleDescription="DAVV Indore — Final sanction and dispute resolution authority. Review notesheets, approve committee recommendations, and issue resolution letters."
      backPath={grvUrls.portal}
      backLabel="Grievance Management System"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Overview of pending orders, resolved cases, and executive summaries.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: grvUrls.registrar.dashboard,
        },
        {
          title: 'Pending Decisions',
          description:
            'Access the list of files awaiting your final resolution, sign order, and closure.',
          icon: 'gavel',
          colorScheme: 'orange',
          path: grvUrls.registrar.pending,
        },
      ]}
    />
  );
}
