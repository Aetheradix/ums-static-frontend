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
      moduleDescription="Manage your assigned hostel — attendance, leave approvals, visitor logs, incident reporting, and student complaints."
      breadcrumbs={breadcrumbs}
      portals={[
        {
          title: 'Dashboard',
          description:
            'Hostel occupancy, attendance summaries, and pending approvals for your assigned hostel',
          icon: 'dashboard',
          colorScheme: 'purple',
          path: '/hostel-services/warden/dashboard',
        },
        {
          title: 'Attendance Register',
          description:
            'Mark and review daily in/out attendance for hostel students',
          icon: 'event_available',
          colorScheme: 'indigo',
          path: '/hostel-services/warden/attendance',
        },
        {
          title: 'Leave & Outpass',
          description: 'Approve or reject student leave and outpass requests',
          icon: 'directions_walk',
          colorScheme: 'teal',
          path: '/hostel-services/warden/leave-outpass',
        },
        {
          title: 'Visitor Entry/Exit Log',
          description:
            'Log visitor entries and exits with ID proof verification',
          icon: 'badge',
          colorScheme: 'pink',
          path: '/hostel-services/warden/visitor-log',
        },
        {
          title: 'Incident Reporting',
          description:
            'Report and investigate hostel incidents and security concerns',
          icon: 'report',
          colorScheme: 'orange',
          path: '/hostel-services/warden/incident-reporting',
        },
        {
          title: 'Hostel Request / Complaint',
          description:
            'Track and resolve student maintenance requests and complaints',
          icon: 'feedback',
          colorScheme: 'red',
          path: '/hostel-services/warden/request',
        },
        {
          title: 'Disciplinary Action',
          description:
            'Record warnings, fines, and disciplinary measures for violations',
          icon: 'gavel',
          colorScheme: 'gray',
          path: '/hostel-services/warden/disciplinary-action',
        },
      ]}
    />
  );
}
