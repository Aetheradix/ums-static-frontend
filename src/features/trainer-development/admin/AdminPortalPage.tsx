import { PortalSelector } from 'shared/new-components';
import { tdmUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Trainer Development"
      moduleDescription="Complete administration of training programmes, registrations, competency mapping, assessments and certificates."
      backPath={tdmUrls.portal}
      backLabel="Trainer Development Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'KPI overview, charts, pending approvals and training calendar snapshot.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: tdmUrls.admin.dashboard,
        },
        {
          title: 'Masters',
          description:
            'Configure training categories, mode settings, competency frameworks, venue details, and certification policies.',
          icon: 'category',
          colorScheme: 'purple',
          path: tdmUrls.admin.mastersPortal,
        },
        {
          title: 'Trainer Registration',
          description:
            'Register internal and external trainers with qualifications and skills.',
          icon: 'person_add',
          colorScheme: 'green',
          path: tdmUrls.admin.trainerRegistration,
        },

        {
          title: 'Training Planning',
          description:
            'Plan training programmes with trainer, venue, schedule and budget.',
          icon: 'event_note',
          colorScheme: 'blue',
          path: tdmUrls.admin.trainingPlanning,
        },

        {
          title: 'Training Sessions',
          description:
            'Session-wise tracking with attendance and topic coverage.',
          icon: 'play_circle',
          colorScheme: 'indigo',
          path: tdmUrls.admin.trainingSessions,
        },
        {
          title: 'Attendance',
          description: 'QR and manual attendance for training sessions.',
          icon: 'assignment_turned_in',
          colorScheme: 'green',
          path: tdmUrls.admin.attendance,
        },

        {
          title: 'Feedback Management',
          description: 'Aggregate trainer and session feedback ratings.',
          icon: 'rate_review',
          colorScheme: 'amber',
          path: tdmUrls.admin.feedback,
        },
        {
          title: 'Performance Evaluation',
          description:
            'Trainer scorecard, skill growth and department rankings.',
          icon: 'insights',
          colorScheme: 'red',
          path: tdmUrls.admin.performance,
        },
        {
          title: 'Certificate Management',
          description:
            'Generate, issue, revoke and manage training certificates.',
          icon: 'workspace_premium',
          colorScheme: 'pink',
          path: tdmUrls.admin.certificates,
        },
        {
          title: 'Approval Workflow',
          description:
            'Multi-level approval for trainings, budgets and certificates.',
          icon: 'account_tree',
          colorScheme: 'teal',
          path: tdmUrls.admin.approvalWorkflow,
        },
        {
          title: 'Reports',
          description:
            'Comprehensive department, trainer, attendance and certificate reports.',
          icon: 'bar_chart',
          colorScheme: 'indigo',
          path: tdmUrls.admin.reports,
        },
        {
          title: 'Settings',
          description:
            'Notification templates, email configuration and module settings.',
          icon: 'settings',
          colorScheme: 'gray',
          path: tdmUrls.admin.settings,
        },
      ]}
    />
  );
}
