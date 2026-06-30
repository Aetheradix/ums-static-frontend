import { PortalSelector } from 'shared/new-components';

export default function VerificationCenterPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Verification Center Incharge"
      moduleDescription="Select a section to manage candidate verification."
      backPath="/recruitment-management"
      backLabel="Recruitment Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'Overview of candidates assigned to your center.',
          icon: 'dashboard',
          colorScheme: 'orange',
          path: '/recruitment-management/verification-center/dashboard',
        },
        {
          title: 'Candidate Queue',
          description:
            'Open each candidate, review documents, and mark Verified or Rejected.',
          icon: 'queue',
          colorScheme: 'orange',
          path: '/recruitment-management/verification-center/queue',
        },
        {
          title: 'Verification Reports',
          description: 'View verification reports and statistics.',
          icon: 'assessment',
          colorScheme: 'orange',
          path: '/recruitment-management/verification-center/reports',
        },
      ]}
    />
  );
}
