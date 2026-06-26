import { PortalSelector } from 'shared/new-components';
import { admissionsUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Admissions"
      moduleDescription="Configure programmes, fees, review applications, and manage portal content."
      backPath={admissionsUrls.root}
      backLabel="Admissions Management"
      portals={[
        {
          title: 'All Applications',
          description:
            'View all admission applications and update their status.',
          icon: 'folder_open',
          colorScheme: 'indigo',
          path: admissionsUrls.admin.applications,
        },
        {
          title: 'Fee Approval',
          description: 'Review and approve or reject pending fee payments.',
          icon: 'payments',
          colorScheme: 'green',
          path: admissionsUrls.admin.feeApproval,
        },
        {
          title: 'Programme Config',
          description:
            'Set admission criteria (Entrance / Merit / Both) per programme.',
          icon: 'schema',
          colorScheme: 'blue',
          path: admissionsUrls.admin.programmeConfig,
        },
        {
          title: 'Fee Configuration',
          description:
            'Configure registration and recurring fees by programme and category.',
          icon: 'receipt_long',
          colorScheme: 'orange',
          path: admissionsUrls.admin.feeConfig,
        },
        {
          title: 'Portal Settings',
          description:
            'Manage portal intro, prospectus, deadline, instructions, and FAQs.',
          icon: 'settings',
          colorScheme: 'purple',
          path: admissionsUrls.admin.portalSettings,
        },
        {
          title: 'Notifications',
          description: 'Publish public notices and mark them as featured.',
          icon: 'campaign',
          colorScheme: 'teal',
          path: admissionsUrls.admin.notifications,
        },
      ]}
    />
  );
}
