import { PortalSelector } from 'shared/new-components';
import { thesisUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Thesis Management"
      moduleDescription="Configure thesis programs, research areas, guides, workflows, templates, and view system audits."
      backPath={thesisUrls.portal}
      backLabel="Thesis Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Overall system dashboard: registrations, active committees, and recent audit trails.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: thesisUrls.admin.dashboard,
        },
        {
          title: 'Program Master',
          description:
            'Configure and manage PhD, M.Phil or D.Sc programs with durations and rules.',
          icon: 'workspace_premium',
          colorScheme: 'purple',
          path: thesisUrls.admin.programMaster,
        },
        {
          title: 'Area Master',
          description:
            'Manage research domains, specialization fields, keywords and mapping categories.',
          icon: 'category',
          colorScheme: 'indigo',
          path: thesisUrls.admin.areaMaster,
        },
        {
          title: 'Department Master',
          description:
            'Configure departmental intakes, active codes and research cell department associations.',
          icon: 'account_balance',
          colorScheme: 'orange',
          path: thesisUrls.admin.deptMaster,
        },
        {
          title: 'Supervisor Master',
          description:
            'Manage guides and co-guides, designations, and allocation limits with active/inactive toggles.',
          icon: 'people',
          colorScheme: 'teal',
          path: thesisUrls.admin.supervisorMaster,
        },
        {
          title: 'Committee Master',
          description:
            'Configure Research Advisory Committees (RAC) and Doctoral Committees (DC).',
          icon: 'groups',
          colorScheme: 'amber',
          path: thesisUrls.admin.committeeMaster,
        },
        {
          title: 'Milestone Configuration',
          description:
            'Define and map research stages, expected due months and sequencing indices.',
          icon: 'flag',
          colorScheme: 'red',
          path: thesisUrls.admin.milestoneConfig,
        },
        {
          title: 'Workflow Configuration',
          description:
            'Set up approval flow sequences: Scholar to Guide, HOD, and URC Cell steps.',
          icon: 'account_tree',
          colorScheme: 'blue',
          path: thesisUrls.admin.workflowConfig,
        },
        {
          title: 'Plagiarism Settings',
          description:
            'Configure Turnitin API integrations, similarity thresholds and warning alert triggers.',
          icon: 'verified_user',
          colorScheme: 'teal',
          path: thesisUrls.admin.plagiarismSettings,
        },
        {
          title: 'Repository Configuration',
          description:
            'Manage Crossref DOI registry endpoints, handle servers and Shodhganga upload keys.',
          icon: 'library_books',
          colorScheme: 'red',
          path: thesisUrls.admin.repositoryConfig,
        },
        {
          title: 'Notification Templates',
          description:
            'Manage triggers, subject lines, and body content for Email, SMS and Push templates.',
          icon: 'notifications_active',
          colorScheme: 'pink',
          path: thesisUrls.admin.notificationTemplates,
        },
        {
          title: 'Reports',
          description:
            'Analyze system-wide metrics: completions, supervisor loading, and delay trends.',
          icon: 'bar_chart',
          colorScheme: 'indigo',
          path: thesisUrls.admin.reports,
        },
        {
          title: 'Audit Logs',
          description:
            'Track all administrative and workflow actions with performed by, timestamp, and status.',
          icon: 'receipt_long',
          colorScheme: 'gray',
          path: thesisUrls.admin.auditLogs,
        },
        {
          title: 'Permissions Control',
          description:
            'Manage access rights and role mappings for Scholars, Supervisors, HODs and Officers.',
          icon: 'security',
          colorScheme: 'pink',
          path: thesisUrls.admin.permissions,
        },
      ]}
    />
  );
}
