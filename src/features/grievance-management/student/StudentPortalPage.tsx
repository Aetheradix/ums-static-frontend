import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Portal — Grievance Management"
      moduleDescription="Raise, track and manage your grievances. DAVV Indore — UGC / AICTE compliant redressal system."
      backPath={grvUrls.portal}
      backLabel="Grievance Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Overview of your complaints, pending actions, SLA status and quick access to all features.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: grvUrls.student.dashboard,
        },
        {
          title: 'Raise Grievance',
          description:
            'File a new complaint with category, description, attachments and priority selection.',
          icon: 'edit_note',
          colorScheme: 'red',
          path: grvUrls.student.raise,
        },
        {
          title: 'Track Complaint',
          description:
            'Follow the real-time status and approval timeline of your submitted grievances.',
          icon: 'track_changes',
          colorScheme: 'purple',
          path: grvUrls.student.track,
        },
        {
          title: 'Complaint Details',
          description:
            'View full complaint detail, SLA countdown, notesheet, comments and activity history.',
          icon: 'description',
          colorScheme: 'indigo',
          path: grvUrls.student.details,
        },
        {
          title: 'Communication Center',
          description:
            'In-app messages, notifications from grievance cell and SMS/Email history.',
          icon: 'forum',
          colorScheme: 'teal',
          path: grvUrls.student.communication,
        },
        {
          title: 'File an Appeal',
          description:
            'Not satisfied with the resolution? File an appeal to HoD / Registrar for review.',
          icon: 'gavel',
          colorScheme: 'orange',
          path: grvUrls.student.appeal,
        },
        {
          title: 'Complaint History',
          description:
            'View all your past complaints, resolutions and closed tickets.',
          icon: 'history',
          colorScheme: 'gray',
          path: grvUrls.student.history,
        },
      ]}
    />
  );
}
