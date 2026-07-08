import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Grievance Management"
      moduleDescription="Configure master data, escalation matrices, SLA configurations, notification templates and API sync logs."
      backPath={grvUrls.portal}
      backLabel="Grievance Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Overall system performance metrics, sync status, and system audit summary.',
          icon: 'dashboard',
          colorScheme: 'red',
          path: grvUrls.admin.dashboard,
        },
        {
          title: 'Category Master',
          description:
            'Manage grievance categories, sub-categories, mapped committees, and default SLA timelines.',
          icon: 'category',
          colorScheme: 'blue',
          path: grvUrls.admin.categories,
        },
        {
          title: 'Department Mapping',
          description:
            'Map categories to academic/administrative departments and designate nodal officers.',
          icon: 'map',
          colorScheme: 'green',
          path: grvUrls.admin.departments,
        },
        {
          title: 'Workflow & Escalation Matrix',
          description:
            'Build and manage multi-level escalation workflows (Level 1 to Level 5) for university grievances.',
          icon: 'schema',
          colorScheme: 'purple',
          path: grvUrls.admin.workflow,
        },
        {
          title: 'SLA Configuration',
          description:
            'Configure response times, reminder schedules, and resolution times by category and priority.',
          icon: 'more_time',
          colorScheme: 'orange',
          path: grvUrls.admin.sla,
        },
        {
          title: 'Notification Templates',
          description:
            'Customize SMS, Email, WhatsApp, and In-App notification content for workflow events.',
          icon: 'message',
          colorScheme: 'teal',
          path: grvUrls.admin.notifications,
        },
        {
          title: 'Integration Dashboard',
          description:
            'Monitor API connections to CM Helpline, UGC e-Samadhan, CPGRAMS, and eOffice systems.',
          icon: 'api',
          colorScheme: 'indigo',
          path: grvUrls.admin.integrations,
        },
        {
          title: 'Audit Logs',
          description:
            'UGC-compliant RTI audit logs recording old vs new values, IP addresses, and user actions.',
          icon: 'history_edu',
          colorScheme: 'gray',
          path: grvUrls.admin.audit,
        },
      ]}
    />
  );
}
