import { PortalSelector } from 'shared/new-components';
import { thesisUrls } from '../urls';

export default function CellPortalPage() {
  return (
    <PortalSelector
      moduleTitle="University Research Cell (URC) Portal — Thesis Management"
      moduleDescription="Register scholars, allocate codes, manage jury, schedule viva, evaluate and publish to repository."
      backPath={thesisUrls.portal}
      backLabel="Thesis Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'URC operational dashboard with registration counts, pending actions and pipeline metrics.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: thesisUrls.cell.dashboard,
        },
        {
          title: 'Proposal Management',
          description:
            'Review HOD-endorsed proposals and process for research registration.',
          icon: 'approval',
          colorScheme: 'purple',
          path: thesisUrls.cell.proposalManagement,
        },
        {
          title: 'Scholar Registration',
          description:
            'Allocate unique research codes and create official scholar records in URC database.',
          icon: 'how_to_reg',
          colorScheme: 'green',
          path: thesisUrls.cell.scholarRegistration,
        },
        {
          title: 'Supervisor Allocation',
          description:
            'Assign and re-assign supervisors and co-supervisors to registered scholars.',
          icon: 'assignment_ind',
          colorScheme: 'teal',
          path: thesisUrls.cell.supervisorAllocation,
        },
        {
          title: 'Plagiarism Verification',
          description:
            'Initiate Turnitin checks, view reports and mark clearance status.',
          icon: 'verified_user',
          colorScheme: 'orange',
          path: thesisUrls.cell.plagiarismVerification,
        },
        {
          title: 'Milestone Monitoring',
          description:
            'Monitor all scholar milestones with overdue alerts and automated notifications.',
          icon: 'flag',
          colorScheme: 'red',
          path: thesisUrls.cell.milestoneMonitoring,
        },
        {
          title: 'Jury Management',
          description:
            'Create and manage jury panel database for viva defense examinations.',
          icon: 'groups',
          colorScheme: 'indigo',
          path: thesisUrls.cell.juryManagement,
        },
        {
          title: 'Defense Scheduling',
          description:
            'Schedule viva defense dates, venues and notify all stakeholders.',
          icon: 'event',
          colorScheme: 'amber',
          path: thesisUrls.cell.defenseScheduling,
        },
        {
          title: 'Evaluation',
          description:
            'Enter viva scorecard data and record jury verdict for each scholar.',
          icon: 'grading',
          colorScheme: 'green',
          path: thesisUrls.cell.evaluation,
        },
        {
          title: 'Repository Publishing',
          description:
            'Publish approved thesis to Shodhganga / INFLIBNET and assign Crossref DOI.',
          icon: 'library_books',
          colorScheme: 'blue',
          path: thesisUrls.cell.repository,
        },
        {
          title: 'Reports',
          description:
            'Generate URC operational reports on registrations, timelines and outputs.',
          icon: 'bar_chart',
          colorScheme: 'gray',
          path: thesisUrls.cell.reports,
        },
      ]}
    />
  );
}
