import { PortalSelector } from 'shared/new-components';

export default function HostelServicesPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Hostel Services Portal"
      moduleDescription="Manage hostel allocations, room configurations, attendance, fee collection, and mess management for Admin, Warden, and Students."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Manage hostel masters, room configurations, fee components, warden assignments, reports, and system-wide settings.',
          icon: 'admin_panel_settings',
          colorScheme: 'red',
          path: '/hostel-services/admin',
        },
        {
          title: 'Warden Portal',
          description:
            'View assigned hostel dashboard, manage attendance, approve leave & outpass, visitor logs, and incident reporting.',
          icon: 'badge',
          colorScheme: 'purple',
          path: '/hostel-services/warden',
        },
        {
          title: 'Student Portal',
          description:
            'Apply for hostel, view room allocation, pay fees, raise complaints, request room changes, and check mess menu.',
          icon: 'school',
          colorScheme: 'blue',
          path: '/hostel-services/student',
        },
      ]}
    />
  );
}
