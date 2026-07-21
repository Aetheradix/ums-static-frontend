import { PortalSelector } from 'shared/new-components';

export default function HostelEmployeePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Hostel Management — Employee Portal"
      moduleDescription="University Hostel Management — Staff & Warden Portal"
      backPath="/hostel-management"
      backLabel="Hostel Management"
      portals={[
        {
          title: 'Dashboards & Reports',
          description:
            'View warden dashboard, overall occupancy, and incident analysis.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: '/hostel-management/reports/warden-dashboard',
        },
        {
          title: 'Student Operations',
          description:
            'Manage gate passes, leave approvals, check-ins, and disciplinary actions.',
          icon: 'how_to_reg',
          colorScheme: 'green',
          path: '/hostel-management/student-operations/gate-pass-approval',
        },
        {
          title: 'Health & Mess',
          description:
            'Track meal attendance, medical emergencies, and sick diet requests.',
          icon: 'restaurant',
          colorScheme: 'orange',
          path: '/hostel-management/health/meal-attendance',
        },
        {
          title: 'Maintenance',
          description:
            'Assign maintenance tasks, track progress, and view feedback.',
          icon: 'build',
          colorScheme: 'purple',
          path: '/hostel-management/maintenance/assignment',
        },
        {
          title: 'Inventory & Stock',
          description:
            'Issue items to students/staff, perform room audits, and record damage.',
          icon: 'inventory_2',
          colorScheme: 'red',
          path: '/hostel-management/stock/issue',
        },
      ]}
    />
  );
}
