import { PortalSelector } from 'shared/new-components';
import { smsUrls } from '../urls';

export default function SuperAdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Super Admin — Security Management"
      moduleDescription="Full administrative control over security masters, incidents, helplines, guidelines and reports."
      backPath={smsUrls.portal}
      backLabel="Security Management System"
      portals={[
        {
          title: 'Dashboard',
          description:
            'KPI cards, recent incidents, guidelines and awareness programs overview.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: smsUrls.superAdmin.dashboard,
        },
        {
          title: 'Masters',
          description:
            'Configure incident categories, types, priorities, severities, statuses, buildings, locations, department mapping, and emergency contacts.',
          icon: 'category',
          colorScheme: 'purple',
          path: smsUrls.superAdmin.mastersPortal,
        },
        {
          title: 'Helpline Management',
          description:
            'Manage all university helplines and emergency contacts.',
          icon: 'phone_in_talk',
          colorScheme: 'blue',
          path: smsUrls.superAdmin.helpline,
        },
        {
          title: 'Guidelines',
          description: 'Create and manage safety guidelines and SOPs.',
          icon: 'menu_book',
          colorScheme: 'teal',
          path: smsUrls.superAdmin.guidelines,
        },
        {
          title: 'Awareness Programs',
          description: 'Manage safety awareness programs and events.',
          icon: 'campaign',
          colorScheme: 'purple',
          path: smsUrls.superAdmin.awareness,
        },
        {
          title: 'Incident Management',
          description: 'View and manage all incidents across the university.',
          icon: 'report_problem',
          colorScheme: 'orange',
          path: smsUrls.superAdmin.incidents,
        },
        {
          title: 'Reports',
          description: 'Generate comprehensive security and incident reports.',
          icon: 'bar_chart',
          colorScheme: 'indigo',
          path: smsUrls.superAdmin.reports,
        },
        {
          title: 'Settings',
          description:
            'System configuration, notifications and workflow settings.',
          icon: 'settings',
          colorScheme: 'indigo',
          path: smsUrls.superAdmin.settings,
        },
      ]}
    />
  );
}
