import { PortalSelector } from 'shared/new-components';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="HR Admin Portal"
      moduleDescription="Select a core administrative module."
      backPath="/employee-management"
      backLabel="Employee Management"
      portals={[
        {
          title: 'Employee Management System (EMS)',
          description:
            'Manage onboarding, headcounts, global leave policies, and full employee records.',
          icon: 'manage_accounts',
          colorScheme: 'blue',
          path: '/employee-management/dashboard',
        },
        {
          title: 'Employee Reports',
          description:
            'View analytics, charts, and detailed reports for headcounts, leaves, and appraisals.',
          icon: 'monitoring',
          colorScheme: 'orange',
          path: '/employee-reports',
        },
      ]}
    />
  );
}
