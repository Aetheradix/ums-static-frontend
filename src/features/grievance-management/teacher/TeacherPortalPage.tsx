import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function TeacherPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Employee Login — Grievance Redressal"
      moduleDescription="DAVV Indore — Institutional desk for faculty and staff members to lodge and track employment-related grievances."
      backPath={grvUrls.portal}
      backLabel="Grievance Management System"
      portals={[
        {
          title: 'Dashboard',
          description: 'Overview of complaints status and quick links.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: grvUrls.teacher.dashboard,
        },
        {
          title: 'Raise Grievance',
          description:
            'Lodge a new grievance with attachments and department mapping.',
          icon: 'edit_note',
          colorScheme: 'red',
          path: grvUrls.teacher.raise,
        },
        {
          title: 'Track Status',
          description:
            'Follow the digital notesheet file movement and timeline.',
          icon: 'map',
          colorScheme: 'purple',
          path: grvUrls.teacher.track,
        },
        {
          title: 'File Appeal',
          description:
            'Lodge appeal to SGRC panel for resolved/closed complaints.',
          icon: 'gavel',
          colorScheme: 'orange',
          path: grvUrls.teacher.appeal,
        },
        {
          title: 'Complaint History',
          description: 'Log of all previously closed and resolved cases.',
          icon: 'history',
          colorScheme: 'gray',
          path: grvUrls.teacher.history,
        },
        {
          title: 'Communication Center',
          description: 'Submit clarifications and read official updates.',
          icon: 'chat',
          colorScheme: 'indigo',
          path: grvUrls.teacher.communication,
        },
      ]}
    />
  );
}
