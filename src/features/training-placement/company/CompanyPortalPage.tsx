import { PortalSelector } from 'shared/new-components';
import { tpUrls } from '../urls';

export default function CompanyPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Company Portal — Training & Placement"
      moduleDescription="Recruiter portal for campus hiring and job postings."
      backPath={tpUrls.root}
      backLabel="Training & Placement"
      portals={[
        {
          title: 'Dashboard',
          description: 'View applicants, job posts, and active seasons.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: tpUrls.company.dashboard,
        },
        {
          title: 'Company Profile',
          description: 'Create and manage your company profile.',
          icon: 'business',
          colorScheme: 'indigo',
          path: tpUrls.company.profile,
        },
        {
          title: 'Company Seasons',
          description: 'Apply for placement seasons and pay drive fees.',
          icon: 'event',
          colorScheme: 'teal',
          path: tpUrls.company.seasons,
        },
        {
          title: 'Opportunities',
          description: 'Post and manage internship and placement openings.',
          icon: 'work',
          colorScheme: 'orange',
          path: tpUrls.company.opportunities,
        },
      ]}
    />
  );
}
