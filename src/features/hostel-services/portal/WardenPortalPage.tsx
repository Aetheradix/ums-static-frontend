import { PortalSelector } from 'shared/new-components';

export default function WardenPortalPage() {
  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
    { label: 'Warden Portal' },
  ];

  return (
    <PortalSelector
      moduleTitle="Warden Portal — Hostel Services"
      moduleDescription="Manage day-to-day operations for your assigned hostel — mark attendance, approve leaves & outpasses, log visitors, process room changes, and resolve student complaints."
      breadcrumbs={breadcrumbs}
      portals={[
        {
          title: 'Dashboard',
          description:
            'Hostel occupancy, daily attendance summaries, and pending approvals for your hostel',
          icon: 'dashboard',
          colorScheme: 'purple',
          path: '/hostel-services/warden/dashboard',
        },
        {
          title: 'Attendance Register',
          description:
            'Mark and review daily in/out roll call and curfew attendance for hostel students',
          icon: 'event_available',
          colorScheme: 'indigo',
          path: '/hostel-services/warden/attendance',
        },
        {
          title: 'Leave & Outpass',
          description:
            'Approve or reject student leave applications and weekend outpasses',
          icon: 'directions_walk',
          colorScheme: 'teal',
          path: '/hostel-services/warden/leave-outpass',
        },
        {
          title: 'Visitor Entry/Exit Log',
          description:
            'Log visitor entries and exits with ID proof verification at the hostel gate',
          icon: 'badge',
          colorScheme: 'pink',
          path: '/hostel-services/warden/visitor-log',
        },
        {
          title: 'Inventory & Stock Management',
          description:
            'Track mess food raw ingredients (Mess Manager) and common hostel assets, linen, and supplies (Caretaker)',
          icon: 'inventory_2',
          colorScheme: 'blue',
          path: '/hostel-services/warden/inventory-stock',
        },
        {
          title: 'Maintenance Ticketing',
          description:
            'Assign technicians to logged student issues and track repair status through to student digital sign-off',
          icon: 'build',
          colorScheme: 'amber',
          path: '/hostel-services/warden/maintenance-tickets',
        },
        {
          title: 'Room Change Request',
          description:
            'Review and approve or reject student room change requests within your hostel',
          icon: 'swap_calls',
          colorScheme: 'blue',
          path: '/hostel-services/warden/room-change-request',
        },
        {
          title: 'Hostel Request / Complaint',
          description:
            'Track and resolve maintenance issues, electrical, and plumbing complaints',
          icon: 'feedback',
          colorScheme: 'red',
          path: '/hostel-services/warden/request',
        },
        {
          title: 'Incident Reporting',
          description:
            'Report and investigate security incidents, noise issues, or curfew breaches',
          icon: 'report',
          colorScheme: 'orange',
          path: '/hostel-services/warden/incident-reporting',
        },
        {
          title: 'Disciplinary Action',
          description:
            'Record warnings, fines, and disciplinary measures for policy violations',
          icon: 'gavel',
          colorScheme: 'gray',
          path: '/hostel-services/warden/disciplinary-action',
        },
        {
          title: 'Mess Menu Schedule',
          description:
            'View and verify the weekly mess menu schedule for daily student meals',
          icon: 'restaurant_menu',
          colorScheme: 'green',
          path: '/hostel-services/warden/mess-menu',
        },
      ]}
    />
  );
}
