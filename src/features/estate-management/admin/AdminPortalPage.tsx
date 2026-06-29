import { PortalSelector } from 'shared/new-components';
import { estateUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Estate Management"
      moduleDescription="Manage all estate-related components, infrastructure, and maintenance workflows."
      backPath={estateUrls.portal}
      backLabel="Estate Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Overview of buildings, floors, rooms, roads, and infrastructure statistics.',
          icon: 'dashboard',
          colorScheme: 'indigo',
          path: estateUrls.admin.dashboard,
        },
        {
          title: 'Manage Buildings',
          description:
            'Add, update, and manage buildings with floors, rooms, and house details.',
          icon: 'apartment',
          colorScheme: 'blue',
          path: estateUrls.admin.manageBuildings,
        },
        {
          title: 'Open Areas',
          description:
            'Manage gardens, parks, playgrounds, parking lots, and courtyards.',
          icon: 'park',
          colorScheme: 'green',
          path: estateUrls.admin.openAreas,
        },
        {
          title: 'Roads & Footpaths',
          description:
            'Record and manage campus roads, footpaths, and street lighting.',
          icon: 'add_road',
          colorScheme: 'orange',
          path: estateUrls.admin.roadsFootpaths,
        },
        {
          title: 'Settings',
          description:
            'Configure master data — wall types, foundations, roofs, blocks, and more.',
          icon: 'settings',
          colorScheme: 'purple',
          path: estateUrls.admin.settings,
        },
        {
          title: 'Maintenance Requests',
          description:
            'Create and manage maintenance requests, assign maintainers, and configure hierarchies.',
          icon: 'build',
          colorScheme: 'red',
          path: estateUrls.admin.maintenanceRequests,
        },
        {
          title: 'Assigned Requests',
          description:
            'View all maintenance requests assigned to estate maintainers.',
          icon: 'assignment_ind',
          colorScheme: 'teal',
          path: estateUrls.admin.assignedRequests,
        },
        {
          title: 'Work Orders',
          description:
            'Manage work orders, verify, and approve through hierarchy workflow.',
          icon: 'engineering',
          colorScheme: 'amber',
          path: estateUrls.admin.workOrders,
        },
        {
          title: 'Work Order Tasks',
          description: 'Create and track sub-tasks for active work orders.',
          icon: 'task_alt',
          colorScheme: 'teal',
          path: estateUrls.admin.workOrderTasks,
        },
        {
          title: 'Reports',
          description:
            'Export building and maintenance data in CSV, PDF, or Excel formats.',
          icon: 'assessment',
          colorScheme: 'gray',
          path: estateUrls.admin.reports,
        },
      ]}
    />
  );
}
