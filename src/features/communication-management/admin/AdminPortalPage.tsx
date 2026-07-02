import { PortalSelector } from 'shared/new-components';
import { commUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Communication Admin — Networking & Communication"
      moduleDescription="Compose bulk email and SMS, manage recipient groups and mailing lists, configure gateways and review delivery logs."
      backPath={commUrls.portal}
      backLabel="Communication Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Volume overview, communications by channel and monthly send trends.',
          icon: 'dashboard',
          colorScheme: 'red',
          path: commUrls.admin.dashboard,
        },
        {
          title: 'Compose Email',
          description:
            'Draft and send a bulk email to employees, students or a group.',
          icon: 'mail',
          colorScheme: 'blue',
          path: commUrls.admin.composeEmail,
        },
        {
          title: 'Compose SMS',
          description:
            'Draft and send a bulk SMS with live character count guidance.',
          icon: 'sms',
          colorScheme: 'purple',
          path: commUrls.admin.composeSms,
        },
        {
          title: 'Groups',
          description:
            'Create and manage employee and student recipient groups.',
          icon: 'groups',
          colorScheme: 'green',
          path: commUrls.admin.groups,
        },
        {
          title: 'Mailing Lists',
          description: 'Maintain named email distribution lists.',
          icon: 'forum',
          colorScheme: 'teal',
          path: commUrls.admin.mailingLists,
        },
        {
          title: 'Communication Logs',
          description: 'Review the full email and SMS delivery history.',
          icon: 'history',
          colorScheme: 'indigo',
          path: commUrls.admin.logs,
        },
        {
          title: 'Settings',
          description: 'Configure SMTP and SMS gateway credentials.',
          icon: 'settings',
          colorScheme: 'amber',
          path: commUrls.admin.settings,
        },
      ]}
    />
  );
}
