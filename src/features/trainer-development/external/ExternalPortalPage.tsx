import { PortalSelector } from 'shared/new-components';
import { tdmUrls } from '../urls';

export default function ExternalPortalPage() {
  return (
    <PortalSelector
      moduleTitle="External Trainer Portal"
      moduleDescription="Access your assigned training sessions, upload materials, manage attendance and view honorarium."
      backPath={tdmUrls.portal}
      backLabel="Trainer Development Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Overview of assigned trainings, upcoming sessions and performance.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: tdmUrls.external.dashboard,
        },
        {
          title: 'Assigned Trainings',
          description: 'View all training programmes assigned to you.',
          icon: 'assignment',
          colorScheme: 'green',
          path: tdmUrls.external.assignedTrainings,
        },
        {
          title: 'Training Schedule',
          description:
            'Upcoming session schedule with venue and timing details.',
          icon: 'event',
          colorScheme: 'purple',
          path: tdmUrls.external.schedule,
        },
        {
          title: 'Attendance Management',
          description:
            'Mark and manage participant attendance for your sessions.',
          icon: 'fact_check',
          colorScheme: 'teal',
          path: tdmUrls.external.attendance,
        },
        {
          title: 'Training Materials',
          description: 'Upload presentations, handouts and session resources.',
          icon: 'folder_open',
          colorScheme: 'amber',
          path: tdmUrls.external.materials,
        },
        {
          title: 'Feedback & Ratings',
          description: 'View participant feedback and session ratings.',
          icon: 'rate_review',
          colorScheme: 'orange',
          path: tdmUrls.external.feedbackView,
        },
        {
          title: 'Honorarium',
          description:
            'View payment details, session-wise honorarium and payment status.',
          icon: 'payments',
          colorScheme: 'red',
          path: tdmUrls.external.honorarium,
        },
      ]}
    />
  );
}
