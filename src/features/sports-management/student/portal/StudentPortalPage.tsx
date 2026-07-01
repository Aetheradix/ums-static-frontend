import { PortalSelector } from 'shared/new-components';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Sports Portal"
      moduleDescription="Manage your sports activities, registrations, and bookings."
      backPath="/sports-management"
      backLabel="Sports Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Get an overview of your sports activities and registrations.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: '/sports-management/student/dashboard',
        },
        {
          title: 'My Sports Profile',
          description:
            'View your sports history, achievements, and quota points.',
          icon: 'person',
          colorScheme: 'purple',
          path: '/settings/student-sports-profile/1',
        },
        {
          title: 'Sports Registration',
          description:
            'Register for sports and upload medical fitness declarations.',
          icon: 'how_to_reg',
          colorScheme: 'green',
          path: '/sports-management/student/profile/registration',
        },
        {
          title: 'Event Registration',
          description: 'Register yourself or your team for upcoming events.',
          icon: 'emoji_events',
          colorScheme: 'orange',
          path: '/sports-management/student/events/registration',
        },
        {
          title: 'Facility Booking',
          description:
            'Request ground or court bookings for practice and matches.',
          icon: 'sports_baseball',
          colorScheme: 'teal',
          path: '/sports-management/student/booking/facility',
        },
        {
          title: 'My Reports',
          description:
            'View your activity summary, achievements, and booking history.',
          icon: 'bar_chart',
          colorScheme: 'indigo',
          path: '/sports-management/student/reports',
        },
      ]}
    />
  );
}
