import { PortalSelector } from 'shared/new-components';
import { learningUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Learning Management"
      moduleDescription="Configure courses, map faculty and students, manage masters and view reports."
      backPath={learningUrls.portal}
      backLabel="Learning Management System"
      portals={[
        {
          title: 'Dashboard',
          description: 'KPI metrics, enrollment charts, and system status.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: learningUrls.admin.dashboard,
        },
        {
          title: 'Masters',
          description: 'Manage course, category, content type, assessment type, and certificates.',
          icon: 'category',
          colorScheme: 'purple',
          path: learningUrls.admin.masters,
        },
        {
          title: 'Configuration',
          description: 'Course mapping, student enrollments, faculty mapping, and assignments.',
          icon: 'settings',
          colorScheme: 'gray',
          path: learningUrls.admin.configuration,
        },
        {
          title: 'Reports',
          description: 'View course completion, learning progress, student, and faculty reports.',
          icon: 'bar_chart',
          colorScheme: 'indigo',
          path: learningUrls.admin.reports,
        },
      ]}
    />
  );
}
