import { PortalSelector } from 'shared/new-components';
import { smsUrls } from '../urls';

export default function SecurityOfficerPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Security Officer Portal"
      moduleDescription="View your assigned cases, conduct investigations and update incident status."
      backPath={smsUrls.portal}
      backLabel="Security Management System"
      portals={[
        {
          title: 'Dashboard',
          description:
            "My assigned cases, pending investigations and today's summary.",
          icon: 'dashboard',
          colorScheme: 'blue',
          path: smsUrls.officer.dashboard,
        },
        {
          title: 'Assigned Incidents',
          description:
            'View and manage your assigned incidents, investigations and resolutions.',
          icon: 'assignment',
          colorScheme: 'orange',
          path: smsUrls.officer.assignedIncidents,
        },
      ]}
    />
  );
}
