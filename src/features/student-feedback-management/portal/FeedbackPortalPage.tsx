import { PortalSelector } from 'shared/new-components';
import { feedbackUrls } from '../urls';

export default function FeedbackPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Feedback Management"
      moduleDescription="Manage feedback templates, questions, and analyze student responses."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Student Portal',
          description: 'View active feedback forms and submit your responses.',
          icon: 'feedback',
          colorScheme: 'green',
          path: feedbackUrls.student.dashboard,
        },
        {
          title: 'Admin Portal',
          description:
            'Configure templates, manage question banks, and view analysis.',
          icon: 'admin_panel_settings',
          colorScheme: 'blue',
          path: feedbackUrls.admin.portal,
        },
      ]}
    />
  );
}
