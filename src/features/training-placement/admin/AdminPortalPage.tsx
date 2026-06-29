import { PortalSelector } from 'shared/new-components';
import { tpUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Training & Placement"
      moduleDescription="TPO administration for campus recruitment and placement drives."
      backPath={tpUrls.root}
      backLabel="Training & Placement"
      portals={[
        {
          title: 'Dashboard',
          description: 'View placement KPIs, trends, and pending actions.',
          icon: 'dashboard',
          colorScheme: 'indigo',
          path: tpUrls.admin.dashboard,
        },
        {
          title: 'Settings',
          description:
            'Configure placement seasons, mappings, and global configs.',
          icon: 'settings',
          colorScheme: 'purple',
          path: tpUrls.admin.settings.hub,
        },
        {
          title: 'Companies',
          description: 'Monitor company profiles and verification requests.',
          icon: 'business',
          colorScheme: 'blue',
          path: tpUrls.admin.companies,
        },
        {
          title: 'Company Seasons',
          description: 'Track company enrollment and fee payments per season.',
          icon: 'event',
          colorScheme: 'teal',
          path: tpUrls.admin.companySeasons,
        },
        {
          title: 'Student Applications',
          description: 'View applications and update hiring status.',
          icon: 'assignment',
          colorScheme: 'green',
          path: tpUrls.admin.applications,
        },
        {
          title: 'Opportunities',
          description: 'Monitor all job and internship postings.',
          icon: 'work',
          colorScheme: 'orange',
          path: tpUrls.admin.opportunities,
        },
        {
          title: 'Reports',
          description:
            'Generate season, company, job, and demographic reports.',
          icon: 'bar_chart',
          colorScheme: 'red',
          path: tpUrls.admin.reports,
        },
      ]}
    />
  );
}
