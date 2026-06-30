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
          title: 'Upload Documents',
          description:
            'Upload and manage your required documents before locking your profile.',
          icon: 'upload_file',
          colorScheme: 'blue',
          path: '/recruitment-management/candidate/documents',
        },
        {
          title: 'Choice Filling',
          description:
            'Fill your division and district posting preferences (available after approval).',
          icon: 'checklist',
          colorScheme: 'orange',
          path: '/recruitment-management/candidate/choice-filling',
        },
        {
          title: 'Joining Request',
          description:
            'Submit your joining request to your allocated school after receiving the order.',
          icon: 'assignment_turned_in',
          colorScheme: 'indigo',
          path: '/recruitment-management/candidate/joining-request',
        },
      ]}
    />
  );
}
