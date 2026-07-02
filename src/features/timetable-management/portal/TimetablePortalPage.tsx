import { PortalSelector } from 'shared/new-components';
import { timetableUrls } from '../urls';

export default function TimetablePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Timetable Management System"
      moduleDescription="Academic scheduling — configure sessions and time-slots, assign courses to faculty and rooms, detect clashes, publish and view timetables."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Timetable Admin',
          description:
            'Full control — set up sessions and periods, resolve clashes, publish timetables and view analytics.',
          icon: 'admin_panel_settings',
          colorScheme: 'red',
          path: timetableUrls.admin.portal,
        },
        {
          title: 'Scheduler',
          description:
            'Assign courses, faculty and rooms to time-slots and manage room allocation.',
          icon: 'edit_calendar',
          colorScheme: 'blue',
          path: timetableUrls.scheduler.portal,
        },
        {
          title: 'Faculty',
          description:
            'View your weekly teaching schedule and raise substitution requests.',
          icon: 'groups',
          colorScheme: 'green',
          path: timetableUrls.faculty.portal,
        },
        {
          title: 'Student',
          description:
            'View your class timetable and the semester examination schedule.',
          icon: 'school',
          colorScheme: 'purple',
          path: timetableUrls.student.portal,
        },
      ]}
    />
  );
}
