import { PortalSelector } from 'shared/new-components';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Sports Portal"
      moduleDescription="Manage sports masters, events, teams, and facility bookings."
      backPath="/sports-management"
      backLabel="Sports Management"
      portals={[
        {
          title: 'Team Creation',
          description: 'Approve or create official university sports teams.',
          icon: 'groups',
          colorScheme: 'teal',
          path: '/sports-management/admin/teams/creation',
        },
        {
          title: 'Squad Selection',
          description: 'Manage trial applicants and select squads',
          icon: 'checklist',
          colorScheme: 'orange',
          path: '/sports-management/admin/teams/squad-selection',
        },
        {
          title: 'Event Creation',
          description:
            'Schedule tournaments and inter-university sports events.',
          icon: 'event',
          colorScheme: 'purple',
          path: '/sports-management/admin/events/creation',
        },
        {
          title: 'Fixtures & Results',
          description: 'Manage matches, venues, and record event results.',
          icon: 'format_list_numbered',
          colorScheme: 'red',
          path: '/sports-management/admin/events/fixtures-results',
        },
        {
          title: 'Facility Booking (Admin)',
          description: 'Approve facility bookings',
          icon: 'edit_calendar',
          colorScheme: 'orange',
          path: '/sports-management/admin/booking/facility',
        },
        {
          title: 'Equipment Issue',
          description: 'Issue sports equipment to students and track returns.',
          icon: 'outbox',
          colorScheme: 'blue',
          path: '/sports-management/admin/booking/equipment',
        },
        {
          title: 'Achievements',
          description:
            'Record achievements and issue certificates to students.',
          icon: 'workspace_premium',
          colorScheme: 'orange',
          path: '/sports-management/admin/achievements/record',
        },
      ]}
    />
  );
}
