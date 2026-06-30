import { PortalSelector } from 'shared/new-components';
import { tpUrls } from '../urls';

export default function DeptPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Department Portal — Training & Placement"
      moduleDescription="OU coordinator view for monitoring placements in your department."
      backPath={tpUrls.root}
      backLabel="Training & Placement"
      portals={[
        {
          title: 'Dashboard',
          description: 'OU-scoped placement statistics and activity.',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: tpUrls.dept.dashboard,
        },
        {
          title: 'Opportunities',
          description: 'Monitor job postings relevant to your students.',
          icon: 'work',
          colorScheme: 'blue',
          path: tpUrls.dept.opportunities,
        },
        {
          title: 'Student Applications',
          description: 'Track applications from students in your OU.',
          icon: 'assignment',
          colorScheme: 'green',
          path: tpUrls.dept.applications,
        },
      ]}
    />
  );
}
