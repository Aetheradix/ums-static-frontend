import { PortalSelector } from 'shared/new-components';
import { tpUrls } from './urls';

export default function TrainingPlacementPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Training & Placement"
      moduleDescription="Manage campus recruitment drives, company partnerships, and student placements."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Configure seasons, manage companies, monitor applications, and generate reports.',
          icon: 'admin_panel_settings',
          colorScheme: 'indigo',
          path: tpUrls.admin.portal,
        },
        {
          title: 'Department Portal',
          description:
            'Monitor placement opportunities and track student recruitment for your OU.',
          icon: 'account_tree',
          colorScheme: 'teal',
          path: tpUrls.dept.portal,
        },
        {
          title: 'Company Portal',
          description:
            'Manage company profile, enroll in seasons, and post job opportunities.',
          icon: 'business',
          colorScheme: 'blue',
          path: tpUrls.company.portal,
        },
        {
          title: 'Student Portal',
          description:
            'Register for placement drives, browse jobs, apply, and track applications.',
          icon: 'school',
          colorScheme: 'orange',
          path: tpUrls.student.portal,
        },
      ]}
    />
  );
}
