import { PortalSelector } from 'shared/new-components';
import { timetableUrls } from '../urls';

export default function FacultyPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Faculty — Timetable Management"
      moduleDescription="View your weekly teaching schedule and raise substitution requests."
      backPath={timetableUrls.portal}
      backLabel="Timetable Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'Your weekly class load and pending substitutions.',
          icon: 'dashboard',
          colorScheme: 'green',
          path: timetableUrls.faculty.dashboard,
        },
        {
          title: 'My Schedule',
          description:
            'Your weekly teaching timetable across days and periods.',
          icon: 'event',
          colorScheme: 'blue',
          path: timetableUrls.faculty.schedule,
        },
        {
          title: 'Substitution Requests',
          description: 'Request a substitute for a class you cannot take.',
          icon: 'edit_note',
          colorScheme: 'purple',
          path: timetableUrls.faculty.substitutions,
        },
      ]}
    />
  );
}
