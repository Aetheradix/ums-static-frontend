import { PortalSelector } from 'shared/new-components';
import { thesisUrls } from '../urls';

export default function SupervisorPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Supervisor / Advisor Portal — Thesis Management"
      moduleDescription="Review scholar proposals, monitor progress, schedule meetings, endorse synopsis and recommend jury."
      backPath={thesisUrls.portal}
      backLabel="Thesis Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Scholar summary, pending actions, milestone status and research output analytics.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: thesisUrls.supervisor.dashboard,
        },
        {
          title: 'Scholars List',
          description:
            'View all assigned research scholars with status, phase and contact details.',
          icon: 'groups',
          colorScheme: 'green',
          path: thesisUrls.supervisor.scholarsList,
        },
        {
          title: 'Proposal Review',
          description:
            'Review, approve, revise or return scholar research proposals with feedback.',
          icon: 'rate_review',
          colorScheme: 'purple',
          path: thesisUrls.supervisor.proposalReview,
        },
        {
          title: 'Plagiarism Review',
          description:
            'Review Turnitin similarity reports and clear or flag for revision.',
          icon: 'verified_user',
          colorScheme: 'teal',
          path: thesisUrls.supervisor.plagiarismReview,
        },
        {
          title: 'Progress Review',
          description:
            'Evaluate scholar monthly and semester progress reports with remarks.',
          icon: 'assessment',
          colorScheme: 'orange',
          path: thesisUrls.supervisor.progressReview,
        },
        {
          title: 'Meetings',
          description:
            'Schedule and log advisory meetings with discussion notes and action items.',
          icon: 'event',
          colorScheme: 'indigo',
          path: thesisUrls.supervisor.meetings,
        },
        {
          title: 'Milestones',
          description:
            'Sign off on scholar milestone completions and flag overdue milestones.',
          icon: 'flag',
          colorScheme: 'amber',
          path: thesisUrls.supervisor.milestones,
        },
        {
          title: 'Synopsis Review',
          description:
            'Review and endorse scholar synopsis for HOD forwarding.',
          icon: 'edit_note',
          colorScheme: 'green',
          path: thesisUrls.supervisor.synopsisReview,
        },
        {
          title: 'Thesis Review',
          description:
            'Final thesis technical review with section-level feedback and corrections.',
          icon: 'description',
          colorScheme: 'red',
          path: thesisUrls.supervisor.thesisReview,
        },
        {
          title: 'Jury Recommendation',
          description:
            'Recommend external and internal jury members for viva defense panel.',
          icon: 'how_to_reg',
          colorScheme: 'pink',
          path: thesisUrls.supervisor.vivaRecommendation,
        },
      ]}
    />
  );
}
