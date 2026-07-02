import { PortalSelector } from 'shared/new-components';
import { timetableUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Timetable Admin — Timetable Management"
      moduleDescription="Configure academic sessions and time-slots, resolve scheduling clashes, publish timetables and review analytics."
      backPath={timetableUrls.portal}
      backLabel="Timetable Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Active timetables, class counts, unresolved clashes and room utilisation.',
          icon: 'dashboard',
          colorScheme: 'red',
          path: timetableUrls.admin.dashboard,
        },
        {
          title: 'Sessions & Time-slots',
          description:
            'Set up academic sessions, define daily periods and exam windows.',
          icon: 'event',
          colorScheme: 'blue',
          path: timetableUrls.admin.setup,
        },
        {
          title: 'Clashes',
          description:
            'Review and resolve faculty, room and section scheduling conflicts.',
          icon: 'gavel',
          colorScheme: 'purple',
          path: timetableUrls.admin.clashes,
        },
        {
          title: 'Timetables',
          description:
            'Browse generated timetables and publish them for students and faculty.',
          icon: 'assignment',
          colorScheme: 'green',
          path: timetableUrls.admin.timetables,
        },
        {
          title: 'Reports',
          description:
            'Clash analytics, timetable status distribution and room utilisation.',
          icon: 'assessment',
          colorScheme: 'amber',
          path: timetableUrls.admin.reports,
        },
      ]}
    />
  );
}
