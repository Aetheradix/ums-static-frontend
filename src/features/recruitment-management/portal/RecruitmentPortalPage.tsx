import { PortalSelector } from 'shared/new-components';

export default function RecruitmentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Recruitment Management"
      moduleDescription="Select the appropriate portal to log in."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Candidate Login',
          description:
            'Login to view your status, upload documents, and fill choices.',
          icon: 'person',
          colorScheme: 'blue',
          path: '/recruitment-management/candidate',
        },
        {
          title: 'Verification Center Incharge',
          description: 'Login to verify candidate documents at your center.',
          icon: 'fact_check',
          colorScheme: 'orange',
          path: '/recruitment-management/verification-center',
        },
        {
          title: 'HR / Admin Portal',
          description:
            'Manage recruitment drives, timelines, and final approvals.',
          icon: 'admin_panel_settings',
          colorScheme: 'purple',
          path: '/recruitment-management/admin',
        },
      ]}
    />
  );
}
