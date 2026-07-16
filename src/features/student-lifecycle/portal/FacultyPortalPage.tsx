import { PortalSelector } from 'shared/new-components';
import { studentLifecycleUrls, studentServicesUrl } from '../urls';

export default function FacultyPortalPage() {
  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.root },
    { label: 'Faculty Portal' },
  ];

  return (
    <PortalSelector
      moduleTitle="Faculty Portal — Student Lifecycle"
      moduleDescription="Record student daily attendance rosters, view enrolled class rosters, and enter continuous internal assessment marks (MST & Quiz)."
      breadcrumbs={breadcrumbs}
      portals={[
        {
          title: 'Dashboard',
          description:
            'Assigned classes count, enrolled students, and pending entries',
          icon: 'dashboard',
          colorScheme: 'purple',
          path: studentLifecycleUrls.faculty.dashboard,
        },
        {
          title: 'Class List / Roster',
          description: 'Roster of enrolled students in assigned courses',
          icon: 'list_alt',
          colorScheme: 'blue',
          path: studentLifecycleUrls.faculty.classList,
        },
        {
          title: 'Attendance Entry',
          description: 'Log daily attendance sheets for student lectures',
          icon: 'event_available',
          colorScheme: 'green',
          path: studentLifecycleUrls.faculty.attendance,
        },
        {
          title: 'Marks Entry',
          description:
            'Enter internal continuous evaluation (MST-1, MST-2, Quiz) scores',
          icon: 'border_color',
          colorScheme: 'orange',
          path: studentLifecycleUrls.faculty.marksEntry,
        },
      ]}
    />
  );
}
