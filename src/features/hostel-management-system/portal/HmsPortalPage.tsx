import { PortalSelector } from 'shared/new-components';
import { hmsUrls } from '../urls';

/** The four entry points into the Hostel Management System. */
export default function HmsPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Hostel Management System"
      moduleDescription="Hostel registration, room configuration and allotment, admissions from a public forum, and the day-to-day running of every hostel — attendance, leave, mess, payments, visitors and grievances."
      backPath="/home/menu"
      backLabel="Home"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management System' },
      ]}
      portals={[
        {
          title: 'Public Forum',
          description:
            'Open to applicants — fill the hostel admission form without signing in, and track it until your ERP credentials are issued.',
          icon: 'public',
          colorScheme: 'green',
          path: hmsUrls.public.root,
          badge: 'No login',
        },
        {
          title: 'Hostel Admin',
          description:
            'Register hostels and issue their credentials, monitor seats remaining hostel-wise, and read the occupancy and collection reports.',
          icon: 'admin_panel_settings',
          colorScheme: 'red',
          path: hmsUrls.admin.root,
        },
        {
          title: 'Hostel Warden',
          description:
            'Configure rooms and facilities, approve admissions, allot rooms, and run attendance, leave, mess, visitors and grievances.',
          icon: 'badge',
          colorScheme: 'purple',
          path: hmsUrls.warden.root,
        },
        {
          title: 'Student Login',
          description:
            'Your room and dues, in/out entries, leave with parent consent, mess menu and feedback, activities, and complaints.',
          icon: 'school',
          colorScheme: 'blue',
          path: hmsUrls.student.root,
        },
      ]}
    />
  );
}
