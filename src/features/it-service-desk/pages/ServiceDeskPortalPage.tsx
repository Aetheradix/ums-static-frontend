import { PortalSelector } from 'shared/new-components';
import { mockCurrentUser } from '../data';
import { itsmUrls } from '../urls';

const roleInfo: Record<
  string,
  {
    title: string;
    description: string;
    icon: string;
    colorScheme:
      | 'blue'
      | 'green'
      | 'purple'
      | 'orange'
      | 'red'
      | 'teal'
      | 'indigo'
      | 'amber'
      | 'pink';
    path: string;
  }
> = {
  'service-desk-admin': {
    title: 'Service Desk Admin',
    description:
      'Full control: manage tickets, agents, SLA rules, reports, and system settings.',
    icon: 'admin_panel_settings',
    colorScheme: 'blue',
    path: itsmUrls.admin.portal,
  },
  'module-admin': {
    title: 'Module Admin',
    description: 'Manage tickets and settings for assigned ERP modules.',
    icon: 'module',
    colorScheme: 'green',
    path: itsmUrls.moduleAdmin.portal,
  },
  agent: {
    title: 'Service Desk Agent',
    description:
      'Handle assigned tickets, update status, and communicate with requesters.',
    icon: 'support_agent',
    colorScheme: 'purple',
    path: itsmUrls.agent.portal,
  },
  employee: {
    title: 'Employee',
    description: 'Raise and track your own support tickets.',
    icon: 'person',
    colorScheme: 'orange',
    path: itsmUrls.employee.portal,
  },
};

export default function ServiceDeskPortalPage() {
  const roleKey = mockCurrentUser?.role ?? 'employee';
  const explicit = roleInfo[roleKey];

  const portals = explicit ? [explicit] : Object.values(roleInfo);

  return (
    <PortalSelector
      moduleTitle="IT Service Desk"
      moduleDescription="Enterprise service management: raise tickets, track resolution, manage SLAs, and access the knowledge base."
      backPath="/home"
      backLabel="Home"
      portals={portals}
    />
  );
}
