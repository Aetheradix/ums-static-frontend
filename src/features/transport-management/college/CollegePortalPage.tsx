import { PortalSelector } from 'shared/new-components';

export default function CollegePortalPage() {
  return (
    <PortalSelector
      backPath="/transport-management"
      backLabel="Transport Management"
      moduleTitle="College Login"
      moduleDescription="College transport configuration and setup."
      portals={[
        {
          title: 'Dashboard',
          description: 'College transport overview.',
          path: '/transport-management/college-login/dashboard',
          icon: 'dashboard',
          colorScheme: 'orange',
        },
        {
          title: 'Transport Incharge Registration',
          description: 'Register and manage transport incharges.',
          path: '/transport-management/college-login/incharge-registration',
          icon: 'person_add',
          colorScheme: 'orange',
        },
        {
          title: 'Route to Bus Stop Mapping',
          description: 'Map bus routes to specific stops.',
          path: '/transport-management/college-login/route-bus-stop-mapping',
          icon: 'map',
          colorScheme: 'orange',
        },
        {
          title: 'Bus Gate Pass Process Detail',
          description: 'Manage bus gate pass entries.',
          path: '/transport-management/college-login/bus-gate-pass',
          icon: 'badge',
          colorScheme: 'orange',
        },
        {
          title: 'Driver to Vehicle Mapping',
          description: 'Map drivers and attenders to specific vehicles.',
          path: '/transport-management/college-login/driver-vehicle-mapping',
          icon: 'person_add',
          colorScheme: 'orange',
        },
        {
          title: 'Route to Bus Mapping',
          description: 'Map routes to specific buses/vehicles.',
          path: '/transport-management/college-login/route-bus-mapping',
          icon: 'alt_route',
          colorScheme: 'orange',
        },
        {
          title: 'Student to Route & Stop Mapping',
          description: 'Assign students to pickup/drop stops.',
          path: '/transport-management/college-login/student-route-mapping',
          icon: 'directions_bus',
          colorScheme: 'orange',
        },
        {
          title: 'Student Leave Entry',
          description: 'Manage student leaves to auto-cancel pickup.',
          path: '/transport-management/college-login/student-leave',
          icon: 'event_busy',
          colorScheme: 'orange',
        },
        {
          title: 'Student Pickup & Drop Entry',
          description: 'Record daily pickup and drop statuses.',
          path: '/transport-management/college-login/pickup-drop',
          icon: 'transfer_within_a_station',
          colorScheme: 'orange',
        },
        {
          title: 'College Bus Live Tracking',
          description: 'Live GPS tracking of college buses.',
          path: '/transport-management/college-login/live-tracking',
          icon: 'my_location',
          colorScheme: 'orange',
        },
        {
          title: 'Maintenance Request',
          description: 'Raise vehicle maintenance request.',
          path: '/transport-management/college-login/maintenance-request',
          icon: 'build',
          colorScheme: 'orange',
        },
        {
          title: 'Maintenance Log (Execution)',
          description: 'Record completed maintenance logs.',
          path: '/transport-management/college-login/maintenance-log',
          icon: 'plumbing',
          colorScheme: 'orange',
        },
        {
          title: 'Staff Leave Entry',
          description: 'Entry leaves for drivers and attenders.',
          path: '/transport-management/college-login/staff-leave',
          icon: 'event_busy',
          colorScheme: 'orange',
        },
        {
          title: 'Pickup Cancellation',
          description: 'Cancel one-time pickups for students.',
          path: '/transport-management/college-login/pickup-cancellation',
          icon: 'cancel_presentation',
          colorScheme: 'orange',
        },
        {
          title: 'Bus Stop Enrollment',
          description: 'Quick enroll to bus stop.',
          path: '/transport-management/college-login/bus-stop-enrollment',
          icon: 'hail',
          colorScheme: 'orange',
        },
      ]}
    />
  );
}
