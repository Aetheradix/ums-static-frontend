import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function GrievanceCellPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Grievance Cell Portal — Central Monitoring"
      moduleDescription="System-wide complaint management, SLA monitoring, committee oversight and reporting."
      backPath={grvUrls.portal}
      backLabel="Grievance Management"
      portals={[
        {
          title: 'Cell Dashboard',
          description:
            'System-wide KPIs, escalation alerts, SLA breach indicators and live complaint statistics.',
          icon: 'analytics',
          colorScheme: 'purple',
          path: grvUrls.cell.dashboard,
        },
        {
          title: 'Complaint Management',
          description:
            'Master list of all complaints across departments with advanced search and filter options.',
          icon: 'list_alt',
          colorScheme: 'blue',
          path: grvUrls.cell.management,
        },
        {
          title: 'Complaint Assignment',
          description:
            'Assign unassigned complaints to departments, officers and committees.',
          icon: 'assignment_turned_in',
          colorScheme: 'teal',
          path: grvUrls.cell.assignment,
        },
        {
          title: 'SLA Monitoring',
          description:
            'Real-time SLA countdown dashboard. Identify near-breach and breached complaints immediately.',
          icon: 'timer',
          colorScheme: 'red',
          path: grvUrls.cell.sla,
        },
        {
          title: 'Committee Management',
          description:
            'Manage SGRC, Anti-Ragging, ICC, SC/ST Cell, Exam and Finance committees.',
          icon: 'groups',
          colorScheme: 'indigo',
          path: grvUrls.cell.committees,
        },
        {
          title: 'Reports & Analytics',
          description:
            'Department, category, escalation, SLA compliance, NAAC, NIRF and UGC reports.',
          icon: 'bar_chart',
          colorScheme: 'orange',
          path: grvUrls.cell.reports,
        },
      ]}
    />
  );
}
