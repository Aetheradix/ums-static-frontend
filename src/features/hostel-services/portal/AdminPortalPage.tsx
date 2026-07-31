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
      moduleDescription="University Executive Portal — Configure hostel masters, policy rules, fee structures, warden staff appointments, central allocations, billing, and system reports."
      breadcrumbs={breadcrumbs}
      portals={[
        {
          title: 'Dashboard',
          description:
            'Executive hostel occupancy rates, fee collection stats, and key performance indicators',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: '/hostel-services/admin/dashboard',
        },
        {
          title: 'Hostel Master',
          description:
            'Create and manage university hostel entities, campus mapping, and safety details',
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
          description: 'Define room categories — single, double, triple, suite',
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
          description:
            'Assign chief wardens, deputy wardens, caretakers to hostels',
          icon: 'badge',
          colorScheme: 'orange',
          path: '/hostel-services/admin/masters/warden-staff',
        },
        {
          title: 'Facility Master',
          description:
            'Define available facilities — gym, laundry, library, wi-fi',
          icon: 'local_convenience_store',
          colorScheme: 'teal',
          path: '/hostel-services/admin/masters/facility',
        },
        {
          title: 'Hostel-Facility Mapping',
          description: 'Map facilities to specific hostels with fee rules',
          icon: 'map',
          colorScheme: 'green',
          path: '/hostel-services/admin/masters/hostel-facility-mapping',
        },
        {
          title: 'Mess/Menu Master',
          description:
            'Configure standard weekly mess menu templates and meal schedules',
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
            'Define hostel code of conduct rules, curfew timings, and policies',
          icon: 'gavel',
          colorScheme: 'gray',
          path: '/hostel-services/admin/masters/rule-policy',
        },
        {
          title: 'Hostel Application Approval',
          description:
            'Review and approve student hostel admission applications',
          icon: 'assignment',
          colorScheme: 'blue',
          path: '/hostel-services/admin/transactions/application',
        },
        {
          title: 'Room & Bed Allocation',
          description:
            'Official central allocation of rooms and beds to approved students',
          icon: 'how_to_reg',
          colorScheme: 'green',
          path: '/hostel-services/admin/transactions/allocation',
        },
        {
          title: 'Student Fee Billing',
          description:
            'Generate and assign hostel fee components to student accounts',
          icon: 'receipt',
          colorScheme: 'amber',
          path: '/hostel-services/admin/transactions/fee-generation',
        },
        {
          title: 'Fee Collection & Receipt',
          description:
            'Record student fee payments and generate official receipts',
          icon: 'price_check',
          colorScheme: 'teal',
          path: '/hostel-services/admin/transactions/fee-collection',
        },
        {
          title: 'Vacate/Checkout & Refund',
          description:
            'Process student checkout clearances and caution deposit refunds',
          icon: 'exit_to_app',
          colorScheme: 'orange',
          path: '/hostel-services/admin/transactions/checkout-refund',
        },
        {
          title: 'Reports & Analytics',
          description:
            'University-wide occupancy, fee collection, and hostel analytics',
          icon: 'bar_chart',
          colorScheme: 'purple',
          path: '/hostel-services/admin/reports',
        },
      ]}
    />
  );
}
