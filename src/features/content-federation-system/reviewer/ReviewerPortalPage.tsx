import { PortalSelector } from 'shared/new-components';
import { cfsUrls } from '../urls';

export default function ReviewerPortalPage() {
  return (
    <PortalSelector
      moduleTitle="CFS Reviewer Portal"
      moduleDescription="Evaluate submitted content and provide approval recommendations."
      backPath={cfsUrls.root}
      backLabel="Portals"
      portals={[
        {
          title: 'Dashboard',
          description: 'Reviewer Metrics & Overview',
          icon: 'dashboard',
          colorScheme: 'orange',
          path: cfsUrls.reviewer.dashboard,
        },
        {
          title: 'Pending Review',
          description: 'Editorial queue reviews',
          icon: 'pending_actions',
          colorScheme: 'red',
          path: cfsUrls.reviewer.pending,
        },
        {
          title: 'Review History',
          description: 'Past review decisions',
          icon: 'history',
          colorScheme: 'indigo',
          path: cfsUrls.reviewer.history,
        },
      ]}
    />
  );
}
