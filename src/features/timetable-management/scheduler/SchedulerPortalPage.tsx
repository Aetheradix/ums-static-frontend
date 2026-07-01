import { PortalSelector } from 'shared/new-components';
import { timetableUrls } from '../urls';

export default function SchedulerPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Scheduler — Timetable Management"
      moduleDescription="Assign courses, faculty and rooms to time-slots and manage room allocation."
      backPath={timetableUrls.portal}
      backLabel="Timetable Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'Snapshot of assignments, sections and room usage.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: timetableUrls.scheduler.dashboard,
        },
        {
          title: 'Course Assignment',
          description:
            'Assign a course, section, faculty and room to a day and period.',
          icon: 'edit_calendar',
          colorScheme: 'green',
          path: timetableUrls.scheduler.assignments,
        },
        {
          title: 'Room Allocation',
          description: 'Review rooms, capacities and their allocation.',
          icon: 'meeting_room',
          colorScheme: 'purple',
          path: timetableUrls.scheduler.rooms,
        },
      ]}
    />
  );
}
