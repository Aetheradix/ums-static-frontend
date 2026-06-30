import { PortalSelector } from 'shared/new-components';
import { cfsUrls } from './urls';

export default function ContentFederationPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Content Federation System"
      moduleDescription="Manage all content, workflows, and review processes across the organization."
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Global content tracking, review overrides, and module settings.',
          icon: 'admin_panel_settings',
          colorScheme: 'blue',
          path: cfsUrls.admin.portal,
        },
        {
          title: 'OU Admin Portal',
          description:
            'Create, manage, and submit content for your Organizational Unit.',
          icon: 'manage_accounts',
          colorScheme: 'green',
          path: cfsUrls.ouAdmin.portal,
        },
        {
          title: 'Reviewer Portal',
          description:
            'Evaluate submitted content and provide approval recommendations.',
          icon: 'rate_review',
          colorScheme: 'orange',
          path: cfsUrls.reviewer.portal,
        },
      ]}
    />
  );
}
