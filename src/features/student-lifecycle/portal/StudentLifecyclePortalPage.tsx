import { PortalSelector } from 'shared/new-components';
import { studentLifecycleUrls, studentServicesUrl } from '../urls';

export default function StudentLifecyclePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Lifecycle Portal"
      moduleDescription="Manage academic profiles, course registrations, examinations, and results for Students, Faculty, and Admin staff."
      backPath={studentServicesUrl}
      backLabel="Student Services"
      portals={[
        {
          title: 'Student Portal',
          description:
            'Access academic dashboard, course selections, MST and quiz marks, examinations, hall ticket downloads, and results grade cards.',
          icon: 'school',
          colorScheme: 'blue',
          path: studentLifecycleUrls.student.root,
        },
        {
          title: 'Faculty Portal',
          description:
            'Class rosters, student daily attendance logging, and internal assessments MST & quiz marks overrides.',
          icon: 'groups',
          colorScheme: 'purple',
          path: studentLifecycleUrls.faculty.root,
        },
        {
          title: 'Admin Portal',
          description:
            'Configure academic semesters, fees invoices, announcements, student rosters, and roles & permissions matrix.',
          icon: 'admin_panel_settings',
          colorScheme: 'red',
          path: studentLifecycleUrls.admin.root,
        },
      ]}
    />
  );
}
