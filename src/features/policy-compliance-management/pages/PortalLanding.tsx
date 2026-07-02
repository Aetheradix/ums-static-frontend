import { PortalSelector, type PortalOption } from 'shared/new-components';

export default function PortalLanding() {
  const portalOptions: PortalOption[] = [
    {
      title: 'Student Portal',
      description: 'Join clubs, view events, and participate.',
      icon: 'person',
      colorScheme: 'blue',
      path: '/policy-compliance-management/my-policies',
    },
    {
      title: 'Admin Portal',
      description: 'Manage policies, events, and memberships.',
      icon: 'admin_panel_settings',
      colorScheme: 'purple',
      path: '/policy-compliance-management/dashboard',
    },
  ];

  return (
    <PortalSelector
      moduleTitle="Policy & Compliance Management"
      moduleDescription="Manage policies, compliance tasks, and view reports or join as a student."
      portals={portalOptions}
      backPath="/home"
    />
  );
}
