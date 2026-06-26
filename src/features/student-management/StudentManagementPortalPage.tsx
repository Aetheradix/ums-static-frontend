import { PortalSelector } from 'shared/new-components';

export default function StudentManagementPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Management"
      moduleDescription="Manage all student lifecycle activities from admission to graduation."
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Manage students, bulk import, and perform administrative actions.',
          icon: 'admin_panel_settings',
          colorScheme: 'indigo',
          path: '/student-management/admin',
        },
        {
          title: 'Student Portal',
          description:
            'Enrolled student self-service for courses, grades, and profile.',
          icon: 'school',
          colorScheme: 'orange',
          path: '/student-management/student',
        },
      ]}
    />
  );
}
