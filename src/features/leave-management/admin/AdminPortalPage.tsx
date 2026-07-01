import { PortalSelector } from 'shared/new-components';
import { lmsUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Leave Management"
      moduleDescription="Manage all leave operations, masters, attendance, biometric and reports."
      backPath={lmsUrls.portal}
      backLabel="Leave Management System"
      portals={[
        {
          title: 'Dashboard',
          description:
            'KPI cards, charts, pending approvals and quick actions.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: lmsUrls.admin.dashboard,
        },
        {
          title: 'Masters',
          description: 'Manage leave types, policy configurations, approval hierarchies, and academic calendars.',
          icon: 'category',
          colorScheme: 'purple',
          path: lmsUrls.admin.mastersPortal,
        },
        {
          title: 'Leave Requests',
          description: 'Review, approve and manage all leave applications.',
          icon: 'assignment',
          colorScheme: 'red',
          path: lmsUrls.admin.leaveRequests,
        },
        {
          title: 'Attendance',
          description:
            "Today's attendance dashboard and employee attendance grid.",
          icon: 'assignment_turned_in',
          colorScheme: 'green',
          path: lmsUrls.admin.attendance,
        },
        {
          title: 'Biometric',
          description: 'Biometric punch records and missing entry alerts.',
          icon: 'fingerprint',
          colorScheme: 'amber',
          path: lmsUrls.admin.biometric,
        },
        {
          title: 'LTC Management',
          description: 'Leave Travel Concession claims and approvals.',
          icon: 'travel_explore',
          colorScheme: 'pink',
          path: lmsUrls.admin.ltc,
        },
        {
          title: 'Reports',
          description: 'Generate and export comprehensive leave reports.',
          icon: 'bar_chart',
          colorScheme: 'indigo',
          path: lmsUrls.admin.reports,
        },
        {
          title: 'Settings',
          description: 'Workflow, notifications, biometric integration.',
          icon: 'settings',
          colorScheme: 'gray',
          path: lmsUrls.admin.settings,
        },
      ]}
    />
  );
}
