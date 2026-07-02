import { PortalSelector } from 'shared/new-components';
import { timetableUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student — Timetable Management"
      moduleDescription="View your class timetable and the semester examination schedule."
      backPath={timetableUrls.portal}
      backLabel="Timetable Management"
      portals={[
        {
          title: 'My Timetable',
          description: 'Your weekly class timetable across days and periods.',
          icon: 'event',
          colorScheme: 'purple',
          path: timetableUrls.student.timetable,
        },
        {
          title: 'Exam Schedule',
          description: 'The examination schedule for your enrolled courses.',
          icon: 'assessment',
          colorScheme: 'blue',
          path: timetableUrls.student.exams,
        },
      ]}
    />
  );
}
