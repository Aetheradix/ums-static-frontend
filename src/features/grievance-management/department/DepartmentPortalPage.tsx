import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function DepartmentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Department / Teacher Portal — Grievance Management"
      moduleDescription="Review assigned complaints, create digital notesheets and escalate to authorities."
      backPath={grvUrls.portal}
      backLabel="Grievance Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Pending complaints assigned to your department, SLA alerts and action summary.',
          icon: 'dashboard',
          colorScheme: 'green',
          path: grvUrls.department.dashboard,
        },
        {
          title: 'Complaint Inbox',
          description:
            'Queue of all complaints assigned to your department with search, filters and action buttons.',
          icon: 'inbox',
          colorScheme: 'blue',
          path: grvUrls.department.inbox,
        },
        {
          title: 'Complaint Details',
          description:
            'Full complaint view with student info, attachments, timeline and investigation panel.',
          icon: 'find_in_page',
          colorScheme: 'indigo',
          path: grvUrls.department.details,
        },
        {
          title: 'Notesheet & Action Taken',
          description:
            'Create, edit, sign and forward digital notesheets. Mark investigation complete.',
          icon: 'assignment',
          colorScheme: 'orange',
          path: grvUrls.department.notesheet,
        },
        {
          title: 'Reports',
          description:
            'Department-wise complaint statistics, resolution rates and SLA compliance reports.',
          icon: 'bar_chart',
          colorScheme: 'purple',
          path: grvUrls.department.reports,
        },
      ]}
    />
  );
}
