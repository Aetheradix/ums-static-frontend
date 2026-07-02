import { PortalSelector } from 'shared/new-components';
import { admissionsUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Admissions"
      moduleDescription="Configure programmes, fees, eligibility rules, and manage the entire admission workflow."
      backPath={admissionsUrls.root}
      backLabel="Admissions Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'View admissions overview',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: admissionsUrls.admin.dashboard,
        },
        {
          title: 'Admission Cycle Master',
          description: 'Session/year configuration',
          icon: 'calendar_today',
          colorScheme: 'indigo',
          path: admissionsUrls.admin.cycleMaster,
        },
        {
          title: 'Eligibility Rule Engine',
          description: 'Eligibility criteria rules',
          icon: 'rule',
          colorScheme: 'orange',
          path: admissionsUrls.admin.eligibilityRules,
        },
        {
          title: 'Reservation Master',
          description: 'Category/quota config',
          icon: 'diversity_3',
          colorScheme: 'purple',
          path: admissionsUrls.admin.reservationMaster,
        },
        {
          title: 'Seat Matrix Config',
          description: 'Seat allocation matrix',
          icon: 'view_list',
          colorScheme: 'teal',
          path: admissionsUrls.admin.seatMatrix,
        },
        {
          title: 'Merit Rule Config',
          description: 'Merit calculation rules',
          icon: 'calculate',
          colorScheme: 'indigo',
          path: admissionsUrls.admin.meritRules,
        },
        {
          title: 'Document Master',
          description: 'Required documents list',
          icon: 'folder_open',
          colorScheme: 'green',
          path: admissionsUrls.admin.documentMaster,
        },
        {
          title: 'Programme Config',
          description: 'Set admission criteria per programme',
          icon: 'schema',
          colorScheme: 'purple',
          path: admissionsUrls.admin.programmeConfig,
        },
        {
          title: 'Fee Config',
          description: 'Registration and recurring fees',
          icon: 'receipt_long',
          colorScheme: 'teal',
          path: admissionsUrls.admin.feeConfig,
        },
        {
          title: 'All Applications',
          description: 'View all applications',
          icon: 'folder_shared',
          colorScheme: 'indigo',
          path: admissionsUrls.admin.applications,
        },
        {
          title: 'Fee Approval',
          description: 'Approve/reject fee payments',
          icon: 'payments',
          colorScheme: 'blue',
          path: admissionsUrls.admin.feeApproval,
        },
        {
          title: 'Portal Settings',
          description: 'Manage portal content',
          icon: 'settings',
          colorScheme: 'green',
          path: admissionsUrls.admin.portalSettings,
        },
        {
          title: 'Notifications',
          description: 'Publish public notices',
          icon: 'campaign',
          colorScheme: 'orange',
          path: admissionsUrls.admin.notifications,
        },
      ]}
    />
  );
}
