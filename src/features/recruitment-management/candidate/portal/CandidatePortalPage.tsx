import { PortalSelector } from 'shared/new-components';

export default function CandidatePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Candidate Portal"
      moduleDescription="Select a section to manage your application."
      backPath="/recruitment-management"
      backLabel="Recruitment Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'View your application status and journey overview.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: '/recruitment-management/candidate/dashboard',
        },
        {
          title: 'Upload Documents',
          description:
            'Upload and manage your required documents before locking your profile.',
          icon: 'upload_file',
          colorScheme: 'blue',
          path: '/recruitment-management/candidate/documents',
        },
        {
          title: 'Verification Status',
          description:
            'Track your document verification and HR approval status.',
          icon: 'fact_check',
          colorScheme: 'green',
          path: '/recruitment-management/candidate/status',
        },
        {
          title: 'Choice Filling',
          description:
            'Fill your division and district posting preferences (available after approval).',
          icon: 'checklist',
          colorScheme: 'orange',
          path: '/recruitment-management/candidate/choice-filling',
        },
      ]}
    />
  );
}
