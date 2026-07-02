import { PortalSelector } from 'shared/new-components';
import { studentManagementUrls } from '../urls';

export default function FacultyPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Faculty Portal — Academics"
      moduleDescription="Manage attendance, internal marks, and student progress."
      backPath={studentManagementUrls.admin.root}
      backLabel="Student Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'Assigned students overview',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: studentManagementUrls.faculty.dashboard,
        },
        {
          title: 'Internal Assessment',
          description: 'Enter internal marks',
          icon: 'border_color',
          colorScheme: 'orange',
          path: studentManagementUrls.faculty.internalAssessment,
        },
        {
          title: 'Student Progress',
          description: 'Track student development',
          icon: 'trending_up',
          colorScheme: 'indigo',
          path: studentManagementUrls.faculty.progress,
        },
      ]}
    />
  );
}
