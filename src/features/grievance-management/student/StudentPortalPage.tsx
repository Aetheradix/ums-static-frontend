import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Login — Grievance Redressal"
      moduleDescription="DAVV Indore — UGC & AICTE compliant system for students to lodge, track and appeal grievances."
      backPath={grvUrls.portal}
      backLabel="Grievance Management System"
      portals={[
        {
          title: 'Dashboard',
          description: 'Overview of complaints status and quick links.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: grvUrls.student.dashboard,
        },
        {
          title: 'Raise Grievance',
          description:
            'Lodge a new grievance with attachments and department mapping.',
          icon: 'edit_note',
          colorScheme: 'red',
          path: grvUrls.student.raise,
        },
        {
          title: 'Track Status',
          description:
            'Follow the digital notesheet file movement and timeline.',
          icon: 'map',
          colorScheme: 'purple',
          path: grvUrls.student.track,
        },
        {
          title: 'File Appeal',
          description:
            'Lodge appeal to SGRC panel for resolved/closed complaints.',
          icon: 'gavel',
          colorScheme: 'orange',
          path: grvUrls.student.appeal,
        },
        {
          title: 'Complaint History',
          description: 'Log of all previously closed and resolved cases.',
          icon: 'history',
          colorScheme: 'gray',
          path: grvUrls.student.history,
        },
        {
          title: 'Communication Center',
          description: 'Submit clarifications and read official updates.',
          icon: 'chat',
          colorScheme: 'indigo',
          path: grvUrls.student.communication,
        },
      ]}
    />
  );
}
