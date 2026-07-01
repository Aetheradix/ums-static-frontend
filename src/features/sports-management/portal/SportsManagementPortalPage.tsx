import { PortalSelector } from 'shared/new-components';

export default function SportsManagementPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Sports Management"
      moduleDescription="Select your login portal to proceed."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Student Portal',
          description:
            'Register for sports, book facilities, and manage your sports profile.',
          icon: 'person',
          colorScheme: 'orange',
          path: '/sports-management/student',
        },
        {
          title: 'Admin Portal',
          description:
            'Manage master configurations, teams, events, and bookings.',
          icon: 'admin_panel_settings',
          colorScheme: 'blue',
          path: '/sports-management/admin',
        },
        {
          title: 'Master Configurations',
          description:
            'Configure sports, facilities, equipment, and achievement masters.',
          icon: 'settings',
          colorScheme: 'purple',
          path: '/sports-management/master',
        },
      ]}
    />
  );
}
