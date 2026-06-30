import { PortalSelector } from 'shared/new-components';

export default function EMSPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Employee Management System (EMS)"
      moduleDescription="Manage employee lifecycle from onboarding to retirement, track headcounts, appraisals, and leaves."
      backPath="/employee-management/admin-portal"
      backLabel="HR Admin Portal"
      portals={[
        {
          title: 'Dashboard',
          description:
            'HR command center — headcount, pending leaves, career events, and onboarding overview.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: '/employee-management/dashboard/analytics',
        },
        {
          title: 'Manage Employee',
          description: 'View and manage all employee records and files.',
          icon: 'manage_accounts',
          colorScheme: 'indigo',
          path: '/employee-management/manage-employees',
        },
        {
          title: 'Quick Onboarding',
          description:
            'Register a new employee with a quick simplified onboarding form.',
          icon: 'person_add',
          colorScheme: 'teal',
          path: '/employee-management/quick-onboarding',
        },
        {
          title: 'Full Onboarding',
          description: 'Step-by-step complete employee registration form.',
          icon: 'how_to_reg',
          colorScheme: 'blue',
          path: '/employee-management/full-onboarding',
        },
        {
          title: 'Bulk Import',
          description:
            'Import multiple employee profiles from Excel/CSV sheets.',
          icon: 'upload_file',
          colorScheme: 'orange',
          path: '/employee-management/bulk-import',
        },
        {
          title: 'Appraisal Management',
          description:
            'Manage and review employee performance appraisal reports (SAR).',
          icon: 'rate_review',
          colorScheme: 'purple',
          path: '/employee-management/appraisals',
        },
        {
          title: 'Leave Approval',
          description: 'Review and approve employee leave requests.',
          icon: 'verified_user',
          colorScheme: 'green',
          path: '/employee-management/leave-approval',
        },
        {
          title: 'Career Event Tracking',
          description:
            'Track employee career lifecycle events (promotions, transfers, retirements).',
          icon: 'timeline',
          colorScheme: 'red',
          path: '/employee-management/career-event-tracking',
        },
        {
          title: 'Settings',
          description:
            'Manage employee management system settings and masters.',
          icon: 'settings',
          colorScheme: 'gray',
          path: '/employee-management/settings',
        },
      ]}
    />
  );
}
