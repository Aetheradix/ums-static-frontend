import { PortalSelector } from 'shared/new-components';
import { rtiUrls } from '../urls';

export default function RTIPortalPage() {
  return (
    <PortalSelector
      moduleTitle="RTI Management"
      moduleDescription="Manage RTI applications, forwarding, appeals, and reports."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'RTI Officer (CPIO)',
          description: 'Register, forward, review, and close RTI applications.',
          icon: 'gavel',
          colorScheme: 'blue',
          path: rtiUrls.admin.portal,
        },
        {
          title: 'Department Nodal Officer',
          description: 'View assigned RTIs and submit departmental responses.',
          icon: 'assignment_ind',
          colorScheme: 'green',
          path: rtiUrls.admin.portal,
        },
        {
          title: 'First Appellate Authority',
          description: 'Review appeals against CPIO decisions.',
          icon: 'balance',
          colorScheme: 'purple',
          path: rtiUrls.admin.appeals,
        },
        {
          title: 'Second Appellate Authority',
          description: 'Review appeals against FAA decisions.',
          icon: 'account_balance',
          colorScheme: 'red',
          path: rtiUrls.admin.appeals,
        },
        {
          title: 'Auditor',
          description: 'View-only access to all RTI records and reports.',
          icon: 'visibility',
          colorScheme: 'amber',
          path: rtiUrls.admin.inbox,
        },
      ]}
    />
  );
}
