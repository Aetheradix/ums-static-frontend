import { PortalSelector } from 'shared/new-components';

export default function StudentPortalPage() {
  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
    { label: 'Student Portal' },
  ];

  return (
    <PortalSelector
      moduleTitle="Student Portal — Hostel Services"
      moduleDescription="Apply for hostel accommodation, view your room details, pay fees, check mess menu, raise complaints, and request room changes."
      breadcrumbs={breadcrumbs}
      portals={[
        {
          title: 'Hostel Application',
          description:
            'Apply for hostel accommodation and track application status',
          icon: 'assignment',
          colorScheme: 'blue',
          path: '/hostel-services/student/application',
        },
        {
          title: 'Room & Bed Allocation',
          description:
            'View your allocated room, bed details, and hostel information',
          icon: 'bed',
          colorScheme: 'indigo',
          path: '/hostel-services/student/allocation',
        },
        {
          title: 'Fee Payment',
          description:
            'View fee breakdowns, make payments, and download receipts',
          icon: 'payments',
          colorScheme: 'amber',
          path: '/hostel-services/student/fee-collection',
        },
        {
          title: 'Mess Menu',
          description: 'View weekly mess menu schedule for all meals',
          icon: 'restaurant_menu',
          colorScheme: 'green',
          path: '/hostel-services/student/mess-menu',
        },
        {
          title: 'Leave & Outpass',
          description: 'Apply for leave or outpass and track approval status',
          icon: 'directions_walk',
          colorScheme: 'purple',
          path: '/hostel-services/student/leave-outpass',
        },
        {
          title: 'Request / Complaint',
          description:
            'Raise maintenance requests and complaints to hostel administration',
          icon: 'feedback',
          colorScheme: 'red',
          path: '/hostel-services/student/request',
        },
        {
          title: 'Room Change Request',
          description: 'Submit a request to change your room or bed allocation',
          icon: 'swap_calls',
          colorScheme: 'teal',
          path: '/hostel-services/student/room-change-request',
        },
        {
          title: 'Vacate / Checkout',
          description:
            'Initiate hostel checkout and track deposit refund status',
          icon: 'exit_to_app',
          colorScheme: 'orange',
          path: '/hostel-services/student/checkout-refund',
        },
      ]}
    />
  );
}
