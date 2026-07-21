import { PortalSelector } from 'shared/new-components';

export default function AdminPortalPage() {
  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
    { label: 'Admin Portal' },
  ];

  return (
    <PortalSelector
      moduleTitle="Admin Portal — Hostel Services"
      moduleDescription="Configure hostel masters, manage room allocations, fee structures, warden assignments, and generate system-wide reports."
      breadcrumbs={breadcrumbs}
      portals={[
        {
          title: 'Dashboard',
          description:
            'Hostel occupancy rates, fee collection stats, and key performance indicators',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: '/hostel-services/admin/dashboard',
        },
        {
          title: 'Hostel Master',
          description:
            'Create and manage hostel entities, campus mapping, and safety details',
          icon: 'apartment',
          colorScheme: 'blue',
          path: '/hostel-services/admin/masters/hostel',
        },
        {
          title: 'Building Master',
          description:
            'Configure buildings, floors, and structural layout per hostel',
          icon: 'business',
          colorScheme: 'indigo',
          path: '/hostel-services/admin/masters/building',
        },
        {
          title: 'Room Type Master',
          description:
            'Define room categories — single, double, triple, dormitory',
          icon: 'category',
          colorScheme: 'purple',
          path: '/hostel-services/admin/masters/room-type',
        },
        {
          title: 'Room & Bed Master',
          description:
            'Manage individual rooms, bed counts, and fee applicability',
          icon: 'bed',
          colorScheme: 'pink',
          path: '/hostel-services/admin/masters/room-bed',
        },
        {
          title: 'Warden/Staff Master',
          description: 'Assign wardens, deputy wardens, caretakers to hostels',
          icon: 'badge',
          colorScheme: 'orange',
          path: '/hostel-services/admin/masters/warden-staff',
        },
        {
          title: 'Facility Master',
          description:
            'Define available facilities — gym, laundry, library, etc.',
          icon: 'local_convenience_store',
          colorScheme: 'teal',
          path: '/hostel-services/admin/masters/facility',
        },
        {
          title: 'Hostel-Facility Mapping',
          description:
            'Map facilities to specific hostels with fee applicability',
          icon: 'map',
          colorScheme: 'green',
          path: '/hostel-services/admin/masters/hostel-facility-mapping',
        },
        {
          title: 'Mess/Menu Master',
          description:
            'Configure weekly mess menus for breakfast, lunch, snacks, dinner',
          icon: 'restaurant_menu',
          colorScheme: 'red',
          path: '/hostel-services/admin/masters/mess-menu',
        },
        {
          title: 'Request Type Master',
          description:
            'Define complaint and request categories for hostel operations',
          icon: 'report_problem',
          colorScheme: 'amber',
          path: '/hostel-services/admin/masters/request-type',
        },
        {
          title: 'Fee Component Master',
          description:
            'Set up fee components, billing dates, and late fee policies',
          icon: 'payments',
          colorScheme: 'green',
          path: '/hostel-services/admin/masters/fee-component',
        },
        {
          title: 'Rule/Policy Master',
          description:
            'Define hostel rules, curfew timings, and disciplinary policies',
          icon: 'gavel',
          colorScheme: 'gray',
          path: '/hostel-services/admin/masters/rule-policy',
        },
        {
          title: 'Hostel Application',
          description:
            'Review and process student hostel admission applications',
          icon: 'assignment',
          colorScheme: 'blue',
          path: '/hostel-services/admin/transactions/application',
        },
        {
          title: 'Room & Bed Allocation',
          description: 'Allocate rooms and beds to approved students',
          icon: 'how_to_reg',
          colorScheme: 'green',
          path: '/hostel-services/admin/transactions/allocation',
        },
        {
          title: 'Student Fee Component',
          description: 'Generate and assign fee components to students',
          icon: 'receipt',
          colorScheme: 'amber',
          path: '/hostel-services/admin/transactions/fee-generation',
        },
        {
          title: 'Fee Collection & Receipt',
          description: 'Record fee payments and generate receipts',
          icon: 'price_check',
          colorScheme: 'teal',
          path: '/hostel-services/admin/transactions/fee-collection',
        },
        {
          title: 'Attendance Register',
          description:
            'Mark and review daily in/out attendance for all hostels',
          icon: 'event_available',
          colorScheme: 'indigo',
          path: '/hostel-services/admin/transactions/attendance',
        },
        {
          title: 'Leave & Outpass',
          description:
            'Process student leave applications and outpass requests',
          icon: 'directions_walk',
          colorScheme: 'purple',
          path: '/hostel-services/admin/transactions/leave-outpass',
        },
        {
          title: 'Visitor Entry/Exit Log',
          description: 'Track visitor entries and exits across all hostels',
          icon: 'badge',
          colorScheme: 'pink',
          path: '/hostel-services/admin/transactions/visitor-log',
        },
        {
          title: 'Hostel Request / Complaint',
          description:
            'Manage and resolve student complaints and maintenance requests',
          icon: 'feedback',
          colorScheme: 'red',
          path: '/hostel-services/admin/transactions/request',
        },
        {
          title: 'Incident Reporting',
          description:
            'Log and investigate hostel incidents and security issues',
          icon: 'report',
          colorScheme: 'orange',
          path: '/hostel-services/admin/transactions/incident-reporting',
        },
        {
          title: 'Disciplinary Action',
          description: 'Record disciplinary actions, fines, and warnings',
          icon: 'gavel',
          colorScheme: 'gray',
          path: '/hostel-services/admin/transactions/disciplinary-action',
        },
        {
          title: 'Room Change Request',
          description: 'Review and approve student room change requests',
          icon: 'swap_calls',
          colorScheme: 'teal',
          path: '/hostel-services/admin/transactions/room-change-request',
        },
        {
          title: 'Student-Facility Mapping',
          description: 'Map facilities to individual students',
          icon: 'link',
          colorScheme: 'green',
          path: '/hostel-services/admin/transactions/student-facility-mapping',
        },
        {
          title: 'Vacate/Checkout & Refund',
          description: 'Process student checkout and deposit refunds',
          icon: 'exit_to_app',
          colorScheme: 'orange',
          path: '/hostel-services/admin/transactions/checkout-refund',
        },
        {
          title: 'Reports',
          description:
            'Occupancy, attendance, and fee collection reports and analytics',
          icon: 'bar_chart',
          colorScheme: 'purple',
          path: '/hostel-services/admin/reports',
        },
      ]}
    />
  );
}
