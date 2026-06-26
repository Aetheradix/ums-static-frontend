import { PortalSelector } from 'shared/new-components';

export default function EmployeePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Employee Management"
      moduleDescription="Access the HR system based on your role."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'HR Admin Portal',
          description:
            'Access the core Employee Management System and analytics Reports.',
          icon: 'admin_panel_settings',
          colorScheme: 'blue',
          path: '/employee-management/admin-portal',
        },
        {
          title: 'Employee Portal (ESS)',
          description:
            'Access your personal profile, apply for leaves, submit appraisals, and track travel.',
          icon: 'badge',
          colorScheme: 'green',
          path: '/employee-management/ess-dashboard',
        },
        {
          title: 'Career Advancement',
          description: 'Manage career advancement sessions and assessments.',
          icon: 'trending_up',
          colorScheme: 'orange',
          path: '/career-advancement',
        },
      ]}
    />
  );
}
