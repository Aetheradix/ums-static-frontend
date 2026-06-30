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
          description: 'KPI cards, recent incidents, guidelines and awareness programs overview.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: smsUrls.superAdmin.dashboard,
        },
        {
          title: 'Incident Category',
          description: 'Create and manage incident category masters.',
          icon: 'category',
          colorScheme: 'purple',
          path: smsUrls.superAdmin.incidentCategory,
        },
        {
          title: 'Incident Type',
          description: 'Manage incident types linked to categories.',
          icon: 'label',
          colorScheme: 'indigo',
          path: smsUrls.superAdmin.incidentType,
        },
        {
          title: 'Priority Master',
          description: 'Configure incident priority levels.',
          icon: 'priority_high',
          colorScheme: 'red',
          path: smsUrls.superAdmin.priority,
        },
        {
          title: 'Severity Master',
          description: 'Configure severity levels for incidents.',
          icon: 'warning',
          colorScheme: 'orange',
          path: smsUrls.superAdmin.severity,
        },
        {
          title: 'Status Master',
          description: 'Manage incident workflow statuses.',
          icon: 'toggle_on',
          colorScheme: 'teal',
          path: smsUrls.superAdmin.status,
        },
        {
          title: 'Building Master',
          description: 'Add and manage campus buildings.',
          icon: 'business',
          colorScheme: 'amber',
          path: smsUrls.superAdmin.building,
        },
        {
          title: 'Location Master',
          description: 'Manage specific locations within buildings.',
          icon: 'location_on',
          colorScheme: 'pink',
          path: smsUrls.superAdmin.location,
        },
        {
          title: 'Department Mapping',
          description: 'Map departments to security officers.',
          icon: 'account_tree',
          colorScheme: 'green',
          path: smsUrls.superAdmin.departmentMapping,
        },
        {
          title: 'Emergency Contact Types',
          description: 'Manage types of emergency contacts.',
          icon: 'contact_phone',
          colorScheme: 'red',
          path: smsUrls.superAdmin.emergencyContactType,
        },
        {
          title: 'Helpline Management',
          description: 'Manage all university helplines and emergency contacts.',
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
          description: 'System configuration, notifications and workflow settings.',
          icon: 'settings',
          colorScheme: 'indigo',
          path: smsUrls.superAdmin.settings,
        },
      ]}
    />
  );
}
