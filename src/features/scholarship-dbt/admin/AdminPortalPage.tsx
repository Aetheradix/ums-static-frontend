import { PortalSelector } from 'shared/new-components';
import { dbtUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Scholarship & DBT"
      moduleDescription="Configure scholarship masters, eligibility rules, government API integrations, DBT monitoring and audit logs."
      backPath={dbtUrls.portal}
      backLabel="Scholarship & DBT"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Complete analytics: applications, students, portals, DBT and recent activity.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: dbtUrls.admin.dashboard,
        },
        {
          title: 'Scholarship Master',
          description:
            'Create, edit and manage university scholarship programme records.',
          icon: 'workspace_premium',
          colorScheme: 'purple',
          path: dbtUrls.admin.scholarshipMaster,
        },
        {
          title: 'Scheme Master',
          description:
            'Configure government and university scholarship scheme parameters.',
          icon: 'assignment',
          colorScheme: 'indigo',
          path: dbtUrls.admin.schemeMaster,
        },
        {
          title: 'Eligibility Rule Engine',
          description:
            'Configure eligibility rules for category, income, attendance, CGPA and semester.',
          icon: 'rule',
          colorScheme: 'orange',
          path: dbtUrls.admin.eligibilityRules,
        },
        {
          title: 'Academic Year',
          description:
            'Manage academic year sessions and scholarship intake windows.',
          icon: 'calendar_month',
          colorScheme: 'teal',
          path: dbtUrls.admin.academicYear,
        },
        {
          title: 'Document Master',
          description:
            'Manage required document types, mandatory flags and verification rules.',
          icon: 'description',
          colorScheme: 'amber',
          path: dbtUrls.admin.documentMaster,
        },
        {
          title: 'Scholarship Configuration',
          description:
            'Set opening/closing dates, maximum amounts, income limits and rules.',
          icon: 'settings_applications',
          colorScheme: 'red',
          path: dbtUrls.admin.configuration,
        },
        {
          title: 'Government Integration',
          description:
            'Manage NSP, PFMS, NPCI, UIDAI, ABC, DigiLocker API endpoints and keys.',
          icon: 'api',
          colorScheme: 'blue',
          path: dbtUrls.admin.govtIntegration,
        },
        {
          title: 'Portal Sync Logs',
          description:
            'View complete sync history with all government portals.',
          icon: 'sync',
          colorScheme: 'teal',
          path: dbtUrls.admin.portalSyncLogs,
        },
        {
          title: 'Failed Sync Records',
          description:
            'Review failed sync records and retry individual or bulk uploads.',
          icon: 'sync_problem',
          colorScheme: 'red',
          path: dbtUrls.admin.failedSync,
        },
        {
          title: 'DBT Monitoring',
          description:
            'Monitor pending, success and failed DBT payment transactions.',
          icon: 'monitor_heart',
          colorScheme: 'green',
          path: dbtUrls.admin.dbtMonitoring,
        },
        {
          title: 'NPCI Validation',
          description:
            'Validate student Aadhaar-bank seeding status via NPCI mapper.',
          icon: 'account_balance',
          colorScheme: 'purple',
          path: dbtUrls.admin.npciValidation,
        },
        {
          title: 'Audit Logs',
          description:
            'View complete audit trail for all scholarship module actions.',
          icon: 'receipt',
          colorScheme: 'gray',
          path: dbtUrls.admin.auditLogs,
        },
        {
          title: 'Reports',
          description:
            'Generate multi-dimension reports by district, department, category, gender.',
          icon: 'bar_chart',
          colorScheme: 'indigo',
          path: dbtUrls.admin.reports,
        },
        {
          title: 'Notification Configuration',
          description:
            'Configure SMS, email and push notification templates and triggers.',
          icon: 'notifications_active',
          colorScheme: 'pink',
          path: dbtUrls.admin.notificationConfig,
        },
      ]}
    />
  );
}
