import { PortalSelector } from 'shared/new-components';
import { essentialServicesUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Essential Services"
      moduleDescription="Centrally configure and oversee institutional facilities and workflows."
      backPath={essentialServicesUrls.portal}
      backLabel="Essential Services"
      portals={[
        {
          title: 'Dashboard',
          description:
            'View real-time bookings overview, counts, and recent workflow activity.',
          icon: 'dashboard',
          colorScheme: 'indigo',
          path: essentialServicesUrls.admin.dashboard,
        },
        {
          title: 'Approval Hierarchy',
          description:
            'Set verifier and approver flows for Parking, Conference, Guest House, and Transport.',
          icon: 'flowchart',
          colorScheme: 'blue',
          path: essentialServicesUrls.admin.hierarchy,
        },
        {
          title: 'Email Templates',
          description:
            'Customize notifications and subjects for workflow approvals, rejections, and booking logs.',
          icon: 'mail',
          colorScheme: 'purple',
          path: essentialServicesUrls.admin.templates,
        },
        {
          title: 'Parking Section',
          description:
            'Manage year boundaries, vehicle parking slots, check status logs, and print passes.',
          icon: 'local_parking',
          colorScheme: 'teal',
          path: essentialServicesUrls.admin.parking,
        },
        {
          title: 'Conference Halls',
          description:
            'Register halls, map incharge officials, allocate rooms for seminars, and resolve schedules.',
          icon: 'co_present',
          colorScheme: 'green',
          path: essentialServicesUrls.admin.conference,
        },
        {
          title: 'Guest House Section',
          description:
            'Configure lodging rooms, tax rules, occupancy allocations, check-in, check-out, and billing.',
          icon: 'hotel',
          colorScheme: 'amber',
          path: essentialServicesUrls.admin.guestHouse,
        },
        {
          title: 'Transport Division',
          description:
            'Dispatch transport requests, allocate university vehicles, map drivers, and audit trips.',
          icon: 'directions_bus',
          colorScheme: 'orange',
          path: essentialServicesUrls.admin.transport,
        },
        {
          title: 'System Logs',
          description:
            'Audit email alerts and processing logs for administrative traceability.',
          icon: 'list_alt',
          colorScheme: 'gray',
          path: essentialServicesUrls.admin.logs,
        },
        {
          title: 'Analytical Reports',
          description:
            'Query detailed reports with parameters, and download CSV, PDF, or spreadsheet exports.',
          icon: 'analytics',
          colorScheme: 'red',
          path: essentialServicesUrls.admin.reports,
        },
      ]}
    />
  );
}
