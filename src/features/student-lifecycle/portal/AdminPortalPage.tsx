import { PortalSelector } from 'shared/new-components';
import { studentLifecycleUrls, studentServicesUrl } from '../urls';

export default function AdminPortalPage() {
  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.root },
    { label: 'Admin Portal' },
  ];

  return (
    <PortalSelector
      moduleTitle="Admin Portal — Student Lifecycle"
      moduleDescription="Manage global settings, fee structure configs, course configurations, user registries, broadcasts, and roles permissions mapping."
      breadcrumbs={breadcrumbs}
      portals={[
        {
          title: 'Dashboard',
          description:
            'Student enrollments analysis, fee collections, and academic standings stats',
          icon: 'dashboard',
          colorScheme: 'red',
          path: studentLifecycleUrls.admin.dashboard,
        },
        {
          title: 'User Accounts',
          description:
            'Manage login accounts for faculty advisors and administrative users',
          icon: 'people',
          colorScheme: 'blue',
          path: studentLifecycleUrls.admin.users,
        },
        {
          title: 'Student Roster',
          description: 'Roster of active students, profile editing and details',
          icon: 'school',
          colorScheme: 'teal',
          path: studentLifecycleUrls.admin.students,
        },
        {
          title: 'Masters Config',
          description:
            'Define courses, branches, credit guidelines, and CBCS syllabus',
          icon: 'settings_applications',
          colorScheme: 'indigo',
          path: studentLifecycleUrls.admin.masters,
        },
        {
          title: 'Fees Config',
          description:
            'Configure academic fee invoices and manual payments entry',
          icon: 'payments',
          colorScheme: 'amber',
          path: studentLifecycleUrls.admin.fees,
        },
        {
          title: 'Announcements',
          description:
            'Broadcast notice announcements and deadline deadlines alerts',
          icon: 'campaign',
          colorScheme: 'orange',
          path: studentLifecycleUrls.admin.announcements,
        },
        {
          title: 'Reports & Exports',
          description:
            'Download CSV audit summaries for grades, profiles, and fee registers',
          icon: 'summarize',
          colorScheme: 'purple',
          path: studentLifecycleUrls.admin.reports,
        },
        {
          title: 'Roles & Permissions',
          description:
            'Edit access control capabilities matrix for admin sub-roles',
          icon: 'security',
          colorScheme: 'red',
          path: studentLifecycleUrls.admin.roles,
        },
        {
          title: 'Portal Settings',
          description:
            'Configure active semester sessions, attendance thresholds, and features',
          icon: 'settings',
          colorScheme: 'gray',
          path: studentLifecycleUrls.admin.settings,
        },
      ]}
    />
  );
}
