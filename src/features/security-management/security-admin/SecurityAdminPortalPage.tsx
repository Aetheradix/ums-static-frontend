import { PortalSelector } from 'shared/new-components';
import { smsUrls } from '../urls';

export default function SecurityAdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Security Admin Portal"
      moduleDescription="Assign incidents to officers, manage investigations and generate security reports."
      backPath={smsUrls.portal}
      backLabel="Security Management System"
      portals={[
        {
          title: 'Dashboard',
          description: 'Overview of assigned, pending, high-priority and today\'s cases.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: smsUrls.securityAdmin.dashboard,
        },
        {
          title: 'Incident Management',
          description: 'Assign incidents, track investigations and manage resolutions.',
          icon: 'report_problem',
          colorScheme: 'orange',
          path: smsUrls.securityAdmin.incidents,
        },
        {
          title: 'Helplines',
          description: 'View and manage university helplines.',
          icon: 'phone_in_talk',
          colorScheme: 'green',
          path: smsUrls.securityAdmin.helpline,
        },
        {
          title: 'Safety Guidelines',
          description: 'Manage safety guidelines and SOPs.',
          icon: 'menu_book',
          colorScheme: 'teal',
          path: smsUrls.securityAdmin.guidelines,
        },
        {
          title: 'Awareness Programs',
          description: 'Manage and monitor safety awareness programs.',
          icon: 'campaign',
          colorScheme: 'purple',
          path: smsUrls.securityAdmin.awareness,
        },
        {
          title: 'Reports',
          description: 'Generate incident and performance reports.',
          icon: 'bar_chart',
          colorScheme: 'indigo',
          path: smsUrls.securityAdmin.reports,
        },
      ]}
    />
  );
}
