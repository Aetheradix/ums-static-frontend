import { PortalSelector } from 'shared/new-components';

export default function EvaluationGradingPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Evaluation & Grading"
      moduleDescription="Manage all masters, configurations, examination and result processing modules."
      portals={[
        {
          title: 'Admin Login',
          description:
            'University admin portal for global settings and results.',
          icon: 'admin_panel_settings',
          colorScheme: 'indigo',
          path: '/evaluation-grading/admin-login',
        },
        {
          title: 'College Login',
          description: 'Faculty and college admin portal.',
          icon: 'domain',
          colorScheme: 'orange',
          path: '/evaluation-grading/college-login',
        },
        {
          title: 'Student Login',
          description: 'Student portal for results and services.',
          icon: 'person',
          colorScheme: 'green',
          path: '/evaluation-grading/student-login',
        },
      ]}
    />
  );
}
