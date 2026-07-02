import { PortalSelector } from 'shared/new-components';
import { studentManagementUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Academics"
      moduleDescription="Configure programs, courses, semesters, batches, and system rules."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Dashboard',
          description: 'Academic admin overview',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: studentManagementUrls.admin.dashboard,
        },
        {
          title: 'Student Directory',
          description: 'View all students',
          icon: 'people',
          colorScheme: 'blue',
          path: studentManagementUrls.admin.directory,
        },
        {
          title: 'Import Students',
          description: 'Bulk import records',
          icon: 'upload',
          colorScheme: 'green',
          path: studentManagementUrls.admin.import,
        },
      ]}
    />
  );
}
