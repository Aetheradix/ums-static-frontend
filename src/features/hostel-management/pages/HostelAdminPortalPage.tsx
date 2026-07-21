import { PortalSelector } from 'shared/new-components';

export default function HostelAdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Hostel Management — Admin Portal"
      moduleDescription="University Hostel Management — ERP Administrator (Hostel Office)"
      backPath="/hostel-management"
      backLabel="Hostel Management"
      portals={[
        {
          title: 'Masters',
          description:
            'Configure hostel masters, basic facilities, shifts, item catalogs, and mess menus.',
          icon: 'settings',
          colorScheme: 'blue',
          path: '/hostel-management/masters/new-hostel-registration',
        },
        {
          title: 'Room Management',
          description:
            'Manage allotments, allocations, check-ins, and room change requests.',
          icon: 'hotel',
          colorScheme: 'indigo',
          path: '/hostel-management/room-management/allotment-roster',
        },
        {
          title: 'Stock Management',
          description:
            'Oversee procurements, vendor management, purchase orders, and inventory overview.',
          icon: 'inventory_2',
          colorScheme: 'green',
          path: '/hostel-management/stock/procurement',
        },
        {
          title: 'Hostel Student Application',
          description:
            'Track application status, scrutiny process, and lock student profiles.',
          icon: 'assignment',
          colorScheme: 'purple',
          path: '/hostel-management/student-application/scrutiny-list',
        },
        {
          title: 'Staff Management',
          description:
            'Manage hostel staff registration, shifts, and attendance.',
          icon: 'groups',
          colorScheme: 'orange',
          path: '/hostel-management/staff/registration',
        },
        {
          title: 'Reports',
          description:
            'View occupancy, revenue, disciplinary, staff performance, and system logs.',
          icon: 'monitoring',
          colorScheme: 'teal',
          path: '/hostel-management/reports/admin-dashboard',
        },
      ]}
    />
  );
}
