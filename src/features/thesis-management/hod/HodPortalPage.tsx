import { PortalSelector } from 'shared/new-components';
import { thesisUrls } from '../urls';

export default function HodPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Head of Department Portal — Thesis Management"
      moduleDescription="Endorse research proposals, manage supervisor workload, monitor department thesis pipeline."
      backPath={thesisUrls.portal}
      backLabel="Thesis Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Department research metrics, approval queue and supervisor workload analytics.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: thesisUrls.hod.dashboard,
        },
        {
          title: 'Proposal Approvals',
          description:
            'Review and approve or return research proposals endorsed by supervisors.',
          icon: 'approval',
          colorScheme: 'green',
          path: thesisUrls.hod.proposalApprovals,
        },
        {
          title: 'Supervisor Workload',
          description:
            'Monitor supervisor allocation vs maximum limit and availability status.',
          icon: 'groups',
          colorScheme: 'purple',
          path: thesisUrls.hod.supervisorWorkload,
        },
        {
          title: 'Department Progress',
          description:
            'View all PhD scholars with phase, milestone and deadline status.',
          icon: 'bar_chart',
          colorScheme: 'teal',
          path: thesisUrls.hod.deptProgress,
        },
        {
          title: 'Synopsis Endorsement',
          description:
            'Provide departmental endorsement for synopsis before URC Cell registration.',
          icon: 'edit_note',
          colorScheme: 'orange',
          path: thesisUrls.hod.synopsisEndorsement,
        },
        {
          title: 'Thesis Endorsement',
          description:
            'Final departmental endorsement for thesis before viva scheduling.',
          icon: 'description',
          colorScheme: 'red',
          path: thesisUrls.hod.thesisEndorsement,
        },
        {
          title: 'Reports',
          description:
            'Generate department-level research output, completion and delay reports.',
          icon: 'summarize',
          colorScheme: 'indigo',
          path: thesisUrls.hod.reports,
        },
      ]}
    />
  );
}
