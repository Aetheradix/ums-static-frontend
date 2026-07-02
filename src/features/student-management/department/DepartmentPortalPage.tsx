import { PortalSelector } from 'shared/new-components';
import { studentManagementUrls } from '../urls';

export default function DepartmentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Department Portal — Academics"
      moduleDescription="Manage department students, batches, sections, and promotions."
      backPath={studentManagementUrls.admin.root}
      backLabel="Student Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'Department overview',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: studentManagementUrls.department.dashboard,
        },
        {
          title: 'Batch Allocation',
          description: 'Assign students to batches',
          icon: 'group_add',
          colorScheme: 'indigo',
          path: studentManagementUrls.department.batchAllocation,
        },
        {
          title: 'Section Allocation',
          description: 'Assign students to sections',
          icon: 'view_list',
          colorScheme: 'purple',
          path: studentManagementUrls.department.sectionAllocation,
        },
        {
          title: 'Subject Mapping',
          description: 'Map subjects to faculty and batches',
          icon: 'account_tree',
          colorScheme: 'blue',
          path: studentManagementUrls.department.subjectMapping,
        },
        {
          title: 'Semester Promotion',
          description: 'Promote students to next semester',
          icon: 'upgrade',
          colorScheme: 'green',
          path: studentManagementUrls.department.promotion,
        },
      ]}
    />
  );
}
