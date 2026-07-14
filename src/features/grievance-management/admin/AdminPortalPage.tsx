import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Grievance Admin Hub — Central Console"
      moduleDescription="DAVV Indore — Configuration desk. Set masters, route department mappings, assign roles, and audit system activities."
      backPath={grvUrls.portal}
      backLabel="Grievance Management System"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Overview of system registrations, active portals, and configurations.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: grvUrls.admin.dashboard,
        },
        {
          title: 'Masters Configuration',
          description:
            'Manage Category, Sub Category, Department, Committee and Status master lists.',
          icon: 'settings_suggest',
          colorScheme: 'green',
          path: grvUrls.admin.masters,
        },
        {
          title: 'User & Role Management',
          description:
            'Create users, map roles, department mappings, and reset passwords.',
          icon: 'manage_accounts',
          colorScheme: 'purple',
          path: grvUrls.admin.users,
        },
        {
          title: 'Workflow Configuration',
          description:
            'Configure department routing, committee assignments, and approval flows.',
          icon: 'alt_route',
          colorScheme: 'orange',
          path: grvUrls.admin.workflow,
        },
        {
          title: 'Reports & Audit Logs',
          description:
            'Track user activity logs, complaint history logs, and system analytics.',
          icon: 'history',
          colorScheme: 'red',
          path: grvUrls.admin.reports,
        },
      ]}
    />
  );
}
