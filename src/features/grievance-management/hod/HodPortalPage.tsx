import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function HodPortalPage() {
  return (
    <PortalSelector
      moduleTitle="HOD Login — Grievance Review Desk"
      moduleDescription="DAVV Indore — Department Head evaluation desk. Review digital notesheets, forward files to Committees/Registrar, or return with remarks."
      backPath={grvUrls.portal}
      backLabel="Grievance Management System"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Department statistics, active notesheets, and performance overview.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: grvUrls.hod.dashboard,
        },
        {
          title: 'Pending Complaints',
          description:
            'Access the list of files forwarded to your desk, search, and apply review.',
          icon: 'pending_actions',
          colorScheme: 'orange',
          path: grvUrls.hod.pending,
        },
      ]}
    />
  );
}
