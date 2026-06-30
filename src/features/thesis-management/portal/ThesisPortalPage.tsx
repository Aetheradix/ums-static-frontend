import { PortalSelector } from 'shared/new-components';
import { thesisUrls } from '../urls';

export default function ThesisPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Thesis Management System"
      moduleDescription="DAVV University Research & Thesis Management — Integrated with Turnitin, ORCID, Shodhganga, Crossref DOI & INFLIBNET."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Research Scholar',
          description:
            'Submit topic, upload proposal, track milestones, submit thesis and access repository.',
          icon: 'school',
          colorScheme: 'blue',
          path: thesisUrls.student.portal,
        },
        {
          title: 'Supervisor / Advisor',
          description:
            'Review proposals, monitor scholar progress, schedule meetings and recommend jury.',
          icon: 'groups',
          colorScheme: 'green',
          path: thesisUrls.supervisor.portal,
        },
        {
          title: 'Head of Department',
          description:
            'Endorse proposals, manage supervisor workload, monitor department research pipeline.',
          icon: 'account_balance',
          colorScheme: 'purple',
          path: thesisUrls.hod.portal,
        },
        {
          title: 'Research Cell (URC)',
          description:
            'Allocate registration codes, manage jury, schedule defense, publish to repository.',
          icon: 'corporate_fare',
          colorScheme: 'teal',
          path: thesisUrls.cell.portal,
        },
        {
          title: 'Admin Portal',
          description:
            'Configure masters, milestone workflows, plagiarism thresholds and notification templates.',
          icon: 'admin_panel_settings',
          colorScheme: 'orange',
          path: thesisUrls.admin.portal,
        },
      ]}
    />
  );
}
