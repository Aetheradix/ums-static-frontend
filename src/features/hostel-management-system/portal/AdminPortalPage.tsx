import { PortalSelector } from 'shared/new-components';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';
import { hmsUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Hostel Admin"
      moduleDescription="Register hostels on the system, issue each one its warden credentials, and monitor seats, occupancy and collections across every hostel."
      backPath={hmsUrls.root}
      backLabel="Hostel Management System"
      breadcrumbs={hmsBreadcrumbs(null, 'Hostel Admin')}
      portals={[
        {
          title: 'Dashboard',
          description:
            'Hostels on the system, beds configured against beds allotted, pending admissions and fee collection at a glance.',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: hmsUrls.admin.dashboard,
        },
        {
          title: 'Hostel Registration',
          description:
            'Register a hostel with its name, type, location, capacity and warden — credentials are issued the moment it is saved.',
          icon: 'apartment',
          colorScheme: 'blue',
          path: hmsUrls.admin.hostelRegistration,
        },
        {
          title: 'Seat Monitoring',
          description:
            'Hostel-wise seats remaining, room-type breakdown and occupancy rate, so you can see where capacity is left.',
          icon: 'monitoring',
          colorScheme: 'orange',
          path: hmsUrls.admin.monitoring,
        },
        {
          title: 'Reports',
          description:
            'Occupancy, admission pipeline, fee collection, attendance and grievance reports across all hostels.',
          icon: 'bar_chart',
          colorScheme: 'purple',
          path: hmsUrls.admin.reports,
        },
      ]}
    />
  );
}
